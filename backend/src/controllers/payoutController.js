const crypto = require('crypto');
const { Op } = require('sequelize');
const { Payout, Escrow, User } = require('../models');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const RETRY_BASE_DELAY_MS = Number.parseInt(process.env.PAYOUT_RETRY_BASE_DELAY_MS || '300000', 10);
const RETRY_MAX_DELAY_MS = Number.parseInt(process.env.PAYOUT_RETRY_MAX_DELAY_MS || '21600000', 10);

function computeNextRetryAt(retryCount) {
  const delay = Math.min(RETRY_MAX_DELAY_MS, RETRY_BASE_DELAY_MS * 2 ** Math.max(0, retryCount));
  return new Date(Date.now() + delay);
}

async function retryPayouts(req, res) {
  try {
    const { payoutId, limit } = req.body || {};

    if (payoutId) {
      const payout = await Payout.findByPk(payoutId);
      if (!payout) {
        return res.status(404).json({ success: false, message: 'Payout not found' });
      }
      await payout.update({ status: 'queued', failureReason: null, nextRetryAt: null });
      return res.json({ success: true, data: [{ payoutId: payout.id, status: 'queued' }] });
    }

    const payouts = await Payout.findAll({
      where: { status: 'failed' },
      limit: Number.isInteger(limit) ? limit : 25
    });

    const results = [];
    for (const payout of payouts) {
      await payout.update({ status: 'queued', failureReason: null, nextRetryAt: null });
      results.push({ payoutId: payout.id, status: 'queued' });
    }

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error('Retry payouts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retry payouts' });
  }
}

function verifyPaystackSignature(rawBody, signature, secret) {
  if (!secret) return false;
  if (!signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

async function createPaystackRecipient(req, res) {
  try {
    const { userId, accountNumber, bankCode, name, type } = req.body || {};
    const targetUserId = userId || req.user?.id;
    if (!targetUserId || !accountNumber || !bankCode || !name) {
      return res.status(400).json({ success: false, message: 'recipient_details_required' });
    }

    if (userId && req.user?.role !== 'admin' && userId !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ success: false, message: 'paystack_secret_missing' });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transferrecipient`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: type || 'nuban',
        name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN'
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.data?.recipient_code) {
      return res.status(502).json({ success: false, message: payload?.message || 'paystack_recipient_failed' });
    }

    await user.update({ payoutRecipientCode: payload.data.recipient_code });

    return res.json({
      success: true,
      data: {
        userId: user.id,
        recipientCode: payload.data.recipient_code,
        details: payload.data
      }
    });
  } catch (error) {
    console.error('Create recipient error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create recipient' });
  }
}

async function processQueuedPayouts(limit = 25) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('paystack_secret_missing');
  }

  const now = new Date();
  const payouts = await Payout.findAll({
    where: {
      [Op.or]: [
        { status: 'queued' },
        { status: 'failed', nextRetryAt: { [Op.lte]: now } }
      ]
    },
    order: [['createdAt', 'ASC']],
    limit: Number.isInteger(limit) ? limit : 25
  });

  const results = [];

  for (const payout of payouts) {
    const user = await User.findByPk(payout.sellerId);
    if (!user?.payoutRecipientCode) {
      await payout.update({ status: 'failed', failureReason: 'missing_payout_recipient' });
      await Escrow.update({ status: 'failed', failureReason: 'missing_payout_recipient' }, { where: { id: payout.escrowId } });
      results.push({ payoutId: payout.id, status: 'failed', reason: 'missing_payout_recipient' });
      continue;
    }

    await payout.update({ lastAttemptAt: new Date() });

    const response = await fetch(`${PAYSTACK_BASE_URL}/transfer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'balance',
        amount: payout.amountKobo,
        recipient: user.payoutRecipientCode,
        reason: `FarmSea ${payout.beneficiaryType} payout`
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.data?.transfer_code) {
      const retryCount = (payout.retryCount || 0) + 1;
      await payout.update({
        status: 'failed',
        failureReason: payload?.message || 'transfer_failed',
        rawTransferResponse: payload,
        retryCount,
        nextRetryAt: computeNextRetryAt(retryCount)
      });
      await Escrow.update({ status: 'failed', failureReason: payload?.message || 'transfer_failed' }, { where: { id: payout.escrowId } });
      results.push({ payoutId: payout.id, status: 'failed', reason: payload?.message || 'transfer_failed' });
      continue;
    }

    await payout.update({
      status: 'sent',
      paystackTransferCode: payload.data.transfer_code,
      rawTransferResponse: payload,
      nextRetryAt: null
    });

    await Escrow.update({ status: 'released', releasedAt: new Date() }, { where: { id: payout.escrowId } });

    results.push({ payoutId: payout.id, status: 'sent', transferCode: payload.data.transfer_code });
  }

  return results;
}

async function executeQueuedPayouts(req, res) {
  try {
    const { limit } = req.body || {};
    const results = await processQueuedPayouts(Number.isInteger(limit) ? limit : 25);
    return res.json({ success: true, data: results });
  } catch (error) {
    console.error('Execute payouts error:', error);
    const message = error?.message === 'paystack_secret_missing' ? 'paystack_secret_missing' : 'Failed to execute payouts';
    return res.status(500).json({ success: false, message });
  }
}

async function getPayouts(req, res) {
  try {
    const { status, beneficiaryType, orderId } = req.query || {};
    const where = {};

    if (req.user.role !== 'admin') {
      where.sellerId = req.user.id;
    }

    if (status) where.status = status;
    if (beneficiaryType) where.beneficiaryType = beneficiaryType;
    if (orderId) where.orderId = orderId;

    const payouts = await Payout.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: payouts });
  } catch (error) {
    console.error('Get payouts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payouts' });
  }
}

async function getPayoutById(req, res) {
  try {
    const { payoutId } = req.params;
    const payout = await Payout.findByPk(payoutId);
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found' });
    }

    if (req.user.role !== 'admin' && payout.sellerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    return res.json({ success: true, data: payout });
  } catch (error) {
    console.error('Get payout by id error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch payout' });
  }
}

async function paystackTransferWebhook(req, res) {
  try {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers['x-paystack-signature'] || null;
    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).json({ received: false, error: 'missing_raw_body' });
    }

    const rawBodyString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody);
    if (!verifyPaystackSignature(rawBodyString, signature, secret)) {
      return res.status(400).json({ received: false, error: 'invalid_signature' });
    }

    const payload = req.body || {};
    const event = payload?.event;
    const data = payload?.data || {};
    const transferCode = data?.transfer_code || null;

    if (!transferCode) {
      return res.json({ received: true });
    }

    const payout = await Payout.findOne({ where: { paystackTransferCode: transferCode } });
    if (!payout) {
      return res.json({ received: true });
    }

    if (event === 'transfer.success') {
      await payout.update({ status: 'sent', rawTransferResponse: payload });
      await Escrow.update({ status: 'released', releasedAt: new Date() }, { where: { id: payout.escrowId } });
    }

    if (event === 'transfer.failed') {
      const retryCount = (payout.retryCount || 0) + 1;
      await payout.update({
        status: 'failed',
        failureReason: data?.reason || 'transfer_failed',
        rawTransferResponse: payload,
        retryCount,
        nextRetryAt: computeNextRetryAt(retryCount)
      });
      await Escrow.update({ status: 'failed', failureReason: data?.reason || 'transfer_failed' }, { where: { id: payout.escrowId } });
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Paystack transfer webhook error:', error);
    return res.status(500).json({ received: false });
  }
}

module.exports = {
  createPaystackRecipient,
  executeQueuedPayouts,
  paystackTransferWebhook,
  processQueuedPayouts,
  getPayouts,
  getPayoutById,
  retryPayouts
};
