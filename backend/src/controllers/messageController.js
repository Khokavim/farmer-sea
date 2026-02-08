const { Message, Conversation, User } = require('../models');
const { Op } = require('sequelize');

const createConversation = async (req, res) => {
  try {
    const { participantId, title } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'participantId is required'
      });
    }

    if (participantId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create a conversation with yourself'
      });
    }

    // Check if conversation already exists between these users
    const possibleConversations = await Conversation.findAll({
      where: { type: 'direct', isActive: true },
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'role', 'profileImage', 'isVerified'],
          through: { attributes: [] },
          required: true,
          where: {
            id: { [Op.in]: [req.user.id, participantId] }
          }
        }
      ]
    });

    const existingConversation = possibleConversations.find((conv) =>
      Array.isArray(conv.participants) && conv.participants.length === 2
    );

    if (existingConversation) {
      return res.json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      title: title || `Chat between ${req.user.name} and participant`,
      type: 'direct'
    });

    // Add participants
    await conversation.addParticipants([req.user.id, participantId]);

    const fullConversation = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'role', 'profileImage', 'isVerified'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: fullConversation || conversation
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create conversation',
      error: error.message
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'role', 'profileImage', 'isVerified'],
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'name', 'role', 'profileImage']
            }
          ]
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });

    // Filter conversations where user is a participant
    const userConversations = conversations.filter(conv => 
      conv.participants.some(participant => participant.id === req.user.id)
    );

    res.json({
      success: true,
      data: userConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    const conversation = await Conversation.findByPk(id, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'role', 'profileImage', 'isVerified'],
          through: { attributes: [] }
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.id === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      });
    }

    // Get messages
    const { count, rows: messages } = await Message.findAndCountAll({
      where: { conversationId: id },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'role', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        conversation,
        messages: messages.reverse(), // Show oldest first
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = 'text', attachments = [] } = req.body;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: User,
          as: 'participants',
          through: { attributes: [] }
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      participant => participant.id === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message to this conversation'
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      content,
      messageType,
      attachments
    });

    // Update conversation last message
    await conversation.update({
      lastMessage: content,
      lastMessageAt: new Date()
    });

    // Fetch complete message with sender details
    const completeMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'role', 'profileImage']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: completeMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      participant => participant.id === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update messages in this conversation'
      });
    }

    // Update all unread messages in conversation
    await Message.update(
      { 
        isRead: true, 
        readAt: new Date() 
      },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: req.user.id }, // Not sent by current user
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.senderId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: req.user.id },
          through: { attributes: [] }
        }
      ]
    });

    const conversationIds = conversations.map(conv => conv.id);

    const unreadCount = await Message.count({
      where: {
        conversationId: { [Op.in]: conversationIds },
        senderId: { [Op.ne]: req.user.id },
        isRead: false
      }
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount
};
