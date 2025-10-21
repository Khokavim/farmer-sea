const { sequelize } = require('../config/database-sqlite');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Message = require('./Message');
const Conversation = require('./Conversation');

// Define associations
User.hasMany(Product, { foreignKey: 'farmerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'farmerId', as: 'farmer' });

User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Message associations
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Many-to-many relationship for conversation participants
User.belongsToMany(Conversation, { 
  through: 'ConversationParticipants', 
  foreignKey: 'userId',
  as: 'conversations'
});
Conversation.belongsToMany(User, { 
  through: 'ConversationParticipants', 
  foreignKey: 'conversationId',
  as: 'participants'
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Message,
  Conversation,
  syncDatabase,
  testConnection: require('../config/database-sqlite').testConnection
};
