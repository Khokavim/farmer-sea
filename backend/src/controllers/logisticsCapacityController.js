const { LogisticsCapacity } = require('../models');

const createCapacity = async (req, res) => {
  try {
    const { route, vehicleTypes, capacity, capacityUnit, coldChain, notes } = req.body || {};
    if (!route || !capacity) {
      return res.status(400).json({ success: false, message: 'route_and_capacity_required' });
    }

    const capacityRecord = await LogisticsCapacity.create({
      userId: req.user.id,
      route,
      vehicleTypes: vehicleTypes || null,
      capacity,
      capacityUnit: capacityUnit || null,
      coldChain: Boolean(coldChain),
      notes: notes || null
    });

    return res.status(201).json({ success: true, data: capacityRecord });
  } catch (error) {
    console.error('Create capacity error:', error);
    return res.status(500).json({ success: false, message: 'capacity_create_failed' });
  }
};

const getMyCapacity = async (req, res) => {
  try {
    const capacities = await LogisticsCapacity.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: capacities });
  } catch (error) {
    console.error('Get capacity error:', error);
    return res.status(500).json({ success: false, message: 'capacity_fetch_failed' });
  }
};

module.exports = {
  createCapacity,
  getMyCapacity
};
