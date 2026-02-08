const express = require('express');
const router = express.Router();

const {
  createPaystackRecipient,
  executeQueuedPayouts,
  paystackTransferWebhook,
  getPayouts,
  getPayoutById,
  retryPayouts
} = require('../controllers/payoutController');

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/paystack/webhook', paystackTransferWebhook);

router.use(authenticateToken);
router.get('/', getPayouts);
router.get('/:payoutId', getPayoutById);
router.post('/recipients/self', createPaystackRecipient);
router.post('/recipients', authorizeRoles('admin'), createPaystackRecipient);
router.post('/execute', authorizeRoles('admin'), executeQueuedPayouts);
router.post('/retry', authorizeRoles('admin'), retryPayouts);

module.exports = router;
