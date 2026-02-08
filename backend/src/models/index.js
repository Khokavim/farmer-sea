const { sequelize } = require('../config/database-sqlite');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Escrow = require('./Escrow');
const Payout = require('./Payout');
const Shipment = require('./Shipment');
const ShipmentLocation = require('./ShipmentLocation');
const LogisticsCapacity = require('./LogisticsCapacity');
const Message = require('./Message');
const Conversation = require('./Conversation');
const OnboardingDraft = require('./OnboardingDraft');

// Define associations
User.hasMany(Product, { foreignKey: 'farmerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'farmerId', as: 'farmer' });

User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Payments + escrow
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.hasMany(Escrow, { foreignKey: 'orderId', as: 'escrows' });
Escrow.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
User.hasMany(Escrow, { foreignKey: 'sellerId', as: 'escrows' });
Escrow.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

Order.hasMany(Payout, { foreignKey: 'orderId', as: 'payouts' });
Payout.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Escrow.hasMany(Payout, { foreignKey: 'escrowId', as: 'payouts' });
Payout.belongsTo(Escrow, { foreignKey: 'escrowId', as: 'escrow' });
User.hasMany(Payout, { foreignKey: 'sellerId', as: 'payouts' });
Payout.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Shipments
Order.hasOne(Shipment, { foreignKey: 'orderId', as: 'shipment' });
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

User.hasMany(Shipment, { foreignKey: 'logisticsProviderId', as: 'assignedShipments' });
Shipment.belongsTo(User, { foreignKey: 'logisticsProviderId', as: 'logisticsProvider' });

User.hasMany(LogisticsCapacity, { foreignKey: 'userId', as: 'capacityListings' });
LogisticsCapacity.belongsTo(User, { foreignKey: 'userId', as: 'logisticsProvider' });

Shipment.hasMany(ShipmentLocation, { foreignKey: 'shipmentId', as: 'locations' });
ShipmentLocation.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

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
    const shouldAlter = process.env.DB_SYNC_ALTER === 'true';
    await sequelize.sync(shouldAlter ? { alter: true } : undefined);
    console.log(`✅ Database synchronized successfully${shouldAlter ? ' (altered)' : ''}.`);
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
  Payment,
  Escrow,
  Payout,
  Shipment,
  ShipmentLocation,
  LogisticsCapacity,
  Message,
  Conversation,
  OnboardingDraft,
  syncDatabase,
  testConnection: require('../config/database-sqlite').testConnection
};
