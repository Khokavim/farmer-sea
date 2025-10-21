const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

// All message routes require authentication
router.use(authenticateToken);

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.post('/send', validateMessage, sendMessage);
router.put('/conversations/:conversationId/read', markMessagesAsRead);
router.delete('/:id', deleteMessage);
router.get('/unread-count', getUnreadCount);

module.exports = router;

