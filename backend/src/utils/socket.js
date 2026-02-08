const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getJwtSecret } = require('./jwt');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, getJwtSecret());
      const user = await User.findByPk(decoded.userId);
      
      if (!user || !user.isActive) {
        return next(new Error('Invalid user'));
      }

      socket.userId = user.id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected with socket ${socket.id}`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.user.name} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.user.name} left conversation ${conversationId}`);
    });

    // Handle new messages
    socket.on('send_message', (data) => {
      const { conversationId, message } = data;
      
      // Broadcast message to all users in the conversation
      socket.to(`conversation_${conversationId}`).emit('new_message', {
        conversationId,
        message,
        sender: {
          id: socket.user.id,
          name: socket.user.name,
          profileImage: socket.user.profileImage
        }
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId: socket.userId,
        userName: socket.user.name,
        isTyping: false
      });
    });

    // Handle order updates
    socket.on('order_update', (data) => {
      const { orderId, status, buyerId } = data;
      
      // Notify buyer about order status change
      io.to(`user_${buyerId}`).emit('order_status_changed', {
        orderId,
        status,
        timestamp: new Date()
      });
    });

    // Handle product updates
    socket.on('product_update', (data) => {
      const { productId, updates } = data;
      
      // Broadcast product updates to all connected users
      io.emit('product_updated', {
        productId,
        updates,
        timestamp: new Date()
      });
    });

    // Handle user status updates
    socket.on('update_status', (data) => {
      const { status } = data;
      
      // Broadcast user status to all users in their conversations
      socket.broadcast.emit('user_status_changed', {
        userId: socket.userId,
        status,
        timestamp: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.name} disconnected: ${reason}`);
      
      // Notify other users that this user went offline
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });
  });

  return io;
};

module.exports = { initializeSocket };
