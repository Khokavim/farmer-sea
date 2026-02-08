const crypto = require('crypto');
const { Order, OrderItem, Product, Payment, Escrow } = require('../models');

const PLATFORM_FEE_BPS = Number.parseInt(process.env.PLATFORM_FEE_BPS || '200', 10); // 2%

function computeFeeKobo(grossKobo) {
  return Math.floor((grossKobo * PLATFORM_FEE_BPS) / 10000);
}

function verifyPaystackSignature(rawBody, signature, secret) {
  if (!secret) return false;
  if (!signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

async function ensureEscrowForOrder(orderId) {
  const existingCount = await Escrow.count({ where: { orderId, beneficiaryType: 'seller' } });
  if (existingCount > 0) return;

  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    ]
  });

  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  const sellerTotalsKobo = new Map();
  for (const item of order.items || []) {
    const sellerId = item?.product?.farmerId;
    if (!sellerId) continue;
    const totalPrice = Number.parseFloat(item.totalPrice);
    const grossKobo = Math.round(totalPrice * 100);
    sellerTotalsKobo.set(sellerId, (sellerTotalsKobo.get(sellerId) || 0) + grossKobo);
  }

  for (const [sellerId, grossAmountKobo] of sellerTotalsKobo.entries()) {
    const platformFeeKobo = computeFeeKobo(grossAmountKobo);
    const netAmountKobo = Math.max(0, grossAmountKobo - platformFeeKobo);
    await Escrow.create({
      orderId,
      sellerId,
      grossAmountKobo,
      platformFeeKobo,
      netAmountKobo,
      beneficiaryType: 'seller',
      status: 'held'
    });
  }
}

const initializePaystackPayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId_required' });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const isMock = process.env.PAYSTACK_MOCK === 'true';
    if (!secretKey && !isMock) {
      return res.status(500).json({ success: false, message: 'paystack_secret_missing' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(409).json({ success: false, message: 'Order already paid' });
    }

    const amountNgn = Number.parseFloat(order.totalAmount);
    const amountKobo = Math.round(amountNgn * 100);

    const reference = `FS_${order.id}_${Date.now()}`;

    let payload;
    if (isMock) {
      payload = {
        status: true,
        message: 'mock_initialize',
        data: {
          reference,
          access_code: `mock_${reference}`,
          authorization_url: `https://checkout.paystack.com/${reference}`
        }
      };
    } else {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: req.user.email,
          amount: amountKobo,
          currency: 'NGN',
          reference,
          metadata: {
            order_id: order.id,
            buyer_id: req.user.id
          }
        })
      });

      payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data?.reference) {
        return res.status(502).json({ success: false, message: payload?.message || 'paystack_initialize_failed' });
      }
    }

    await Payment.create({
      orderId: order.id,
      provider: 'paystack',
      reference: payload.data.reference,
      status: 'initialized',
      amountKobo,
      currency: 'NGN',
      accessCode: payload.data.access_code,
      authorizationUrl: payload.data.authorization_url,
      rawInitializeResponse: payload
    });

    return res.json({
      success: true,
      data: {
        orderId: order.id,
        reference: payload.data.reference,
        access_code: payload.data.access_code,
        authorization_url: payload.data.authorization_url
      }
    });
  } catch (error) {
    console.error('Paystack initialize error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
};

const verifyPaystackPayment = async (req, res) => {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const isMock = process.env.PAYSTACK_MOCK === 'true';
    if (!secretKey && !isMock) {
      return res.status(500).json({ success: false, message: 'paystack_secret_missing' });
    }

    const reference = req.query?.reference;
    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ success: false, message: 'reference_required' });
    }

    const payment = await Payment.findOne({ where: { reference } });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const order = await Order.findByPk(payment.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.buyerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to verify this payment' });
    }

    let payload;
    if (isMock) {
      payload = {
        status: true,
        message: 'mock_verify',
        data: {
          status: 'success',
          reference,
          gateway_response: 'mock_success'
        }
      };
    } else {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`
        },
        cache: 'no-store'
      });

      payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        return res.status(502).json({ success: false, message: payload?.message || 'paystack_verify_failed' });
      }
    }

    const status = payload?.data?.status;
    if (status === 'success') {
      // Defensive checks: only mark as paid when Paystack confirms the expected amount/currency/order.
      const paidAmount = Number(payload?.data?.amount);
      const paidCurrency = payload?.data?.currency;
      const metadata = payload?.data?.metadata || {};

      const amountMatches =
        Number.isFinite(paidAmount) ? paidAmount === Number(payment.amountKobo) : true;
      const currencyMatches =
        typeof paidCurrency === 'string' ? paidCurrency === String(payment.currency || 'NGN') : true;
      const orderMatches =
        metadata?.order_id ? String(metadata.order_id) === String(order.id) : true;
      const buyerMatches =
        metadata?.buyer_id ? String(metadata.buyer_id) === String(order.buyerId) : true;

      if (!amountMatches || !currencyMatches || !orderMatches || !buyerMatches) {
        await payment.update({ status: 'failed', rawVerifyResponse: payload });
        return res.status(409).json({
          success: false,
          message: 'payment_mismatch',
          data: {
            reference,
            orderId: order.id,
            paidAmount,
            expectedAmount: Number(payment.amountKobo),
            paidCurrency,
            expectedCurrency: payment.currency || 'NGN'
          }
        });
      }

      await payment.update({ status: 'success', rawVerifyResponse: payload });
      await order.update({ paymentStatus: 'paid', paymentMethod: 'paystack' });
      await ensureEscrowForOrder(order.id);
    } else {
      await payment.update({ status: 'failed', rawVerifyResponse: payload });
      await order.update({ paymentStatus: 'failed', paymentMethod: 'paystack' });
    }

    return res.json({
      success: true,
      data: {
        reference,
        orderId: order.id,
        status: payload?.data?.status || 'unknown',
        gateway_response: payload?.data?.gateway_response || null
      }
    });
  } catch (error) {
    console.error('Paystack verify error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

const paystackWebhook = async (req, res) => {
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
    const reference = data?.reference;

    if (reference) {
      const payment = await Payment.findOne({ where: { reference } });
      if (payment) {
        await payment.update({ rawWebhookEvent: payload });
      }

      if (event === 'charge.success') {
        if (payment && payment.status !== 'success') {
          const amount = Number(data?.amount);
          const currency = data?.currency;
          const amountMatches = Number.isFinite(amount) ? amount === Number(payment.amountKobo) : true;
          const currencyMatches = typeof currency === 'string' ? currency === String(payment.currency || 'NGN') : true;

          if (amountMatches && currencyMatches) {
            await payment.update({ status: 'success' });
          } else {
            await payment.update({ status: 'failed' });
          }
        }

        if (payment) {
          const order = await Order.findByPk(payment.orderId);
          if (order && order.paymentStatus !== 'paid') {
            const amount = Number(data?.amount);
            const currency = data?.currency;
            const amountMatches = Number.isFinite(amount) ? amount === Number(payment.amountKobo) : true;
            const currencyMatches = typeof currency === 'string' ? currency === String(payment.currency || 'NGN') : true;

            if (amountMatches && currencyMatches) {
              await order.update({ paymentStatus: 'paid', paymentMethod: 'paystack' });
              await ensureEscrowForOrder(order.id);
            }
          }
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return res.status(500).json({ received: false });
  }
};

module.exports = {
  initializePaystackPayment,
  verifyPaystackPayment,
  paystackWebhook,
  ensureEscrowForOrder
};
