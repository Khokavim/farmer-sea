const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const ShipmentLocation = sequelize.define('ShipmentLocation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipmentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  accuracyMeters: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recordedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  receivedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  invalidReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = ShipmentLocation;
