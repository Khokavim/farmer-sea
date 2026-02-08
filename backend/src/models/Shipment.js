const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  logisticsProviderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'en_route', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  logisticsFeeKobo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  originLat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  originLng: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true
  },
  destinationLat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  destinationLng: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Shipment;
