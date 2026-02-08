const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Escrow = sequelize.define('Escrow', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sellerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  grossAmountKobo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  platformFeeKobo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  netAmountKobo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  beneficiaryType: {
    type: DataTypes.ENUM('seller', 'logistics'),
    allowNull: false,
    defaultValue: 'seller'
  },
  status: {
    type: DataTypes.ENUM('held', 'release_pending', 'released', 'failed'),
    allowNull: false,
    defaultValue: 'held'
  },
  releasedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Escrow;
