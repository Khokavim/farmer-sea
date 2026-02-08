const express = require('express');
const router = express.Router();

const {
  initializePaystackPayment,
  verifyPaystackPayment,
  paystackWebhook
} = require('../controllers/paymentController');

const { authenticateToken } = require('../middleware/auth');

// Webhook must be public
router.post('/paystack/webhook', paystackWebhook);

// Authenticated payment operations
router.use(authenticateToken);
router.post('/paystack/initialize', initializePaystackPayment);
router.get('/paystack/verify', verifyPaystackPayment);

module.exports = router;
