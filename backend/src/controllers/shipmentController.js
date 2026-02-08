const { Shipment, Order, Escrow, Payout, User, ShipmentLocation } = require('../models');

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function releaseEscrowForOrder(orderId) {
  const order = await Order.findByPk(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  if (order.paymentStatus !== 'paid') {
    const err = new Error('Order not paid');
    err.statusCode = 409;
    throw err;
  }

  const escrows = await Escrow.findAll({ where: { orderId, beneficiaryType: 'seller', status: 'held' } });
  const results = [];

  for (const escrow of escrows) {
    const seller = await User.findByPk(escrow.sellerId);

    if (!seller?.payoutRecipientCode) {
      await escrow.update({
        status: 'failed',
        failureReason: 'missing_payout_recipient'
      });
      results.push({
        escrowId: escrow.id,
        sellerId: escrow.sellerId,
        sellerRecipientCode: null,
        payoutId: null,
        amountKobo: escrow.netAmountKobo,
        status: 'failed'
      });
      continue;
    }

    const payout = await Payout.create({
      orderId,
      escrowId: escrow.id,
      sellerId: escrow.sellerId,
      beneficiaryType: 'seller',
      provider: 'paystack',
      amountKobo: escrow.netAmountKobo,
      currency: 'NGN',
      status: 'queued'
    });

    await escrow.update({ status: 'release_pending' });

    results.push({
      escrowId: escrow.id,
      sellerId: escrow.sellerId,
      sellerRecipientCode: seller?.payoutRecipientCode || null,
      payoutId: payout.id,
      amountKobo: escrow.netAmountKobo,
      status: 'release_pending'
    });
  }

  return results;
}

async function releaseLogisticsEscrowForOrder(orderId) {
  const order = await Order.findByPk(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }

  if (order.paymentStatus !== 'paid') {
    const err = new Error('Order not paid');
    err.statusCode = 409;
    throw err;
  }

  const shipment = await Shipment.findOne({ where: { orderId } });
  if (!shipment) {
    const err = new Error('Shipment not found');
    err.statusCode = 404;
    throw err;
  }

  if (!shipment.logisticsProviderId) {
    const err = new Error('Shipment has no logistics provider');
    err.statusCode = 409;
    throw err;
  }

  const feeKobo = shipment.logisticsFeeKobo;
  if (!feeKobo || Number(feeKobo) <= 0) {
    return [];
  }

  let escrow = await Escrow.findOne({
    where: {
      orderId,
      beneficiaryType: 'logistics',
      sellerId: shipment.logisticsProviderId
    }
  });

  if (!escrow) {
    escrow = await Escrow.create({
      orderId,
      sellerId: shipment.logisticsProviderId,
      grossAmountKobo: feeKobo,
      platformFeeKobo: 0,
      netAmountKobo: feeKobo,
      beneficiaryType: 'logistics',
      status: 'held'
    });
  }

  if (escrow.status !== 'held') {
    return [{ escrowId: escrow.id, status: escrow.status }];
  }

  const logisticsUser = await User.findByPk(shipment.logisticsProviderId);
  if (!logisticsUser?.payoutRecipientCode) {
    await escrow.update({ status: 'failed', failureReason: 'missing_payout_recipient' });
    return [{ escrowId: escrow.id, status: 'failed', failureReason: 'missing_payout_recipient' }];
  }

  const payout = await Payout.create({
    orderId,
    escrowId: escrow.id,
    sellerId: shipment.logisticsProviderId,
    beneficiaryType: 'logistics',
    provider: 'paystack',
    amountKobo: escrow.netAmountKobo,
    currency: 'NGN',
    status: 'queued'
  });

  await escrow.update({ status: 'release_pending' });
  return [{ escrowId: escrow.id, payoutId: payout.id, amountKobo: escrow.netAmountKobo, status: 'release_pending' }];
}

const createShipment = async (req, res) => {
  try {
    const {
      orderId,
      origin,
      originLat,
      originLng,
      destination,
      destinationLat,
      destinationLng,
      trackingNumber,
      logisticsProviderId,
      logisticsFeeKobo
    } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId_required' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const existing = await Shipment.findOne({ where: { orderId } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Shipment already exists', data: existing });
    }

    const shipment = await Shipment.create({
      orderId,
      origin: origin || null,
      originLat: typeof originLat === 'number' ? originLat : null,
      originLng: typeof originLng === 'number' ? originLng : null,
      destination: destination || null,
      destinationLat: typeof destinationLat === 'number' ? destinationLat : null,
      destinationLng: typeof destinationLng === 'number' ? destinationLng : null,
      trackingNumber: trackingNumber || null,
      logisticsProviderId: logisticsProviderId || null,
      logisticsFeeKobo: typeof logisticsFeeKobo === 'number' ? logisticsFeeKobo : null,
      status: 'assigned'
    });

    return res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    console.error('Create shipment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create shipment' });
  }
};

const acceptDispatch = async (req, res) => {
  try {
    const { orderId } = req.params;
    let shipment = await Shipment.findOne({ where: { orderId } });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.logisticsProviderId && shipment.logisticsProviderId !== req.user.id) {
      return res.status(409).json({ success: false, message: 'Shipment already assigned' });
    }

    shipment = await shipment.update({
      logisticsProviderId: req.user.id,
      status: shipment.status === 'pending' ? 'assigned' : shipment.status
    });

    return res.json({ success: true, data: shipment });
  } catch (error) {
    console.error('Accept dispatch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to accept dispatch' });
  }
};

const getShipmentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shipment = await Shipment.findOne({ where: { orderId } });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }
    if (!(await canAccessShipment(req.user, orderId, shipment))) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    return res.json({ success: true, data: shipment });
  } catch (error) {
    console.error('Get shipment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch shipment' });
  }
};

const updateShipmentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, message: 'status_required' });
    }

    let shipment = await Shipment.findOne({ where: { orderId } });
    if (!shipment) {
      shipment = await Shipment.create({ orderId, status: 'pending' });
    }

    const previousStatus = shipment.status;
    await shipment.update({ status });

    let logisticsPayout = null;
    if (previousStatus !== 'delivered' && status === 'delivered') {
      logisticsPayout = await releaseLogisticsEscrowForOrder(orderId);
    }

    return res.json({ success: true, data: { shipment, logisticsPayout } });
  } catch (error) {
    console.error('Update shipment status error:', error);
    const statusCode = error?.statusCode || 500;
    return res.status(statusCode).json({ success: false, message: error?.message || 'Failed to update shipment status' });
  }
};

async function canAccessShipment(reqUser, orderId, shipment) {
  if (!reqUser) return false;
  if (reqUser.role === 'admin') return true;
  if (reqUser.role === 'logistics' && shipment?.logisticsProviderId === reqUser.id) return true;
  const order = await Order.findByPk(orderId);
  if (!order) return false;
  if (order.buyerId === reqUser.id) return true;
  const sellerEscrow = await Escrow.findOne({ where: { orderId, beneficiaryType: 'seller', sellerId: reqUser.id } });
  return Boolean(sellerEscrow);
}

const postShipmentLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { lat, lng, accuracyMeters, recordedAt } = req.body || {};

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ success: false, message: 'lat_lng_required' });
    }

    const shipment = await Shipment.findOne({ where: { orderId } });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!(req.user.role === 'admin' || (req.user.role === 'logistics' && shipment.logisticsProviderId === req.user.id))) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    const recAt = recordedAt ? new Date(recordedAt) : new Date();
    if (Number.isNaN(recAt.getTime())) {
      return res.status(400).json({ success: false, message: 'recordedAt_invalid' });
    }

    const last = await ShipmentLocation.findOne({
      where: { shipmentId: shipment.id, isValid: true },
      order: [['recordedAt', 'DESC']]
    });

    let isValid = true;
    let invalidReason = null;

    if (last) {
      const dtSeconds = Math.max(0.001, (recAt.getTime() - new Date(last.recordedAt).getTime()) / 1000);
      const distKm = haversineKm(last.lat, last.lng, lat, lng);
      const speedKmh = (distKm / dtSeconds) * 3600;

      if (speedKmh > 160) {
        isValid = false;
        invalidReason = 'speed_too_high';
      }
    }

    const location = await ShipmentLocation.create({
      shipmentId: shipment.id,
      lat,
      lng,
      accuracyMeters: typeof accuracyMeters === 'number' ? accuracyMeters : null,
      recordedAt: recAt,
      receivedAt: new Date(),
      isValid,
      invalidReason
    });

    return res.status(201).json({ success: true, data: location });
  } catch (error) {
    console.error('Post shipment location error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record location' });
  }
};

const getShipmentEta = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shipment = await Shipment.findOne({ where: { orderId } });
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!(await canAccessShipment(req.user, orderId, shipment))) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    if (typeof shipment.destinationLat !== 'number' || typeof shipment.destinationLng !== 'number') {
      return res.status(409).json({ success: false, message: 'destination_coords_missing' });
    }

    const points = await ShipmentLocation.findAll({
      where: { shipmentId: shipment.id, isValid: true },
      order: [['recordedAt', 'DESC']],
      limit: 10
    });

    if (!points.length) {
      return res.json({ success: true, data: { etaSeconds: null, etaTimestamp: null, reason: 'no_location_points' } });
    }

    const latest = points[0];
    const remainingKm = haversineKm(latest.lat, latest.lng, shipment.destinationLat, shipment.destinationLng);

    let avgSpeedKmh = null;
    if (points.length >= 2) {
      let distKm = 0;
      let dtSeconds = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const d = haversineKm(a.lat, a.lng, b.lat, b.lng);
        const dt = (new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()) / 1000;
        if (dt > 0) {
          distKm += d;
          dtSeconds += dt;
        }
      }
      if (dtSeconds > 0.5) {
        avgSpeedKmh = (distKm / dtSeconds) * 3600;
      }
    }

    const speedKmh = avgSpeedKmh && avgSpeedKmh > 1 ? avgSpeedKmh : 30;
    const etaSeconds = Math.round((remainingKm / speedKmh) * 3600);
    const etaTimestamp = new Date(Date.now() + etaSeconds * 1000);

    return res.json({
      success: true,
      data: {
        remainingKm,
        speedKmh,
        etaSeconds,
        etaTimestamp,
        lastLocation: latest
      }
    });
  } catch (error) {
    console.error('Get shipment ETA error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute ETA' });
  }
};

module.exports = {
  createShipment,
  getShipmentByOrderId,
  updateShipmentStatus,
  acceptDispatch,
  releaseEscrowForOrder,
  releaseLogisticsEscrowForOrder,
  postShipmentLocation,
  getShipmentEta
};
