const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Payout = sequelize.define('Payout', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  escrowId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  beneficiaryType: {
    type: DataTypes.ENUM('seller', 'logistics'),
    allowNull: false,
    defaultValue: 'seller'
  },
  provider: {
    type: DataTypes.ENUM('paystack'),
    allowNull: false,
    defaultValue: 'paystack'
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
  status: {
    type: DataTypes.ENUM('queued', 'sent', 'failed'),
    allowNull: false,
    defaultValue: 'queued'
  },
  retryCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  lastAttemptAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextRetryAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paystackTransferCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rawTransferResponse: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Payout;
