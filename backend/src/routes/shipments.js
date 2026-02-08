const express = require('express');
const router = express.Router();

const {
  createShipment,
  getShipmentByOrderId,
  updateShipmentStatus,
  acceptDispatch,
  postShipmentLocation,
  getShipmentEta
} = require('../controllers/shipmentController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

// For now, only admin can create/update shipments (logistics role can be added later)
router.post('/', authorizeRoles('admin'), createShipment);
router.get('/:orderId', getShipmentByOrderId);
router.put('/:orderId/status', authorizeRoles('admin'), updateShipmentStatus);
router.post('/:orderId/accept', authorizeRoles('logistics', 'admin'), acceptDispatch);

router.post('/:orderId/location', authorizeRoles('admin', 'logistics'), postShipmentLocation);
router.get('/:orderId/eta', getShipmentEta);

module.exports = router;
