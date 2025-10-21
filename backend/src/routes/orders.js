const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// All order routes require authentication
router.use(authenticateToken);

router.post('/', validateOrder, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;

