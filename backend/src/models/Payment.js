const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  provider: {
    type: DataTypes.ENUM('paystack'),
    allowNull: false,
    defaultValue: 'paystack'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('initialized', 'success', 'failed'),
    allowNull: false,
    defaultValue: 'initialized'
  },
  amountKobo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'NGN'
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authorizationUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rawInitializeResponse: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rawVerifyResponse: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rawWebhookEvent: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Payment;
