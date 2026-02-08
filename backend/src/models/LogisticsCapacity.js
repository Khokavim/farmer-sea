const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const LogisticsCapacity = sequelize.define('LogisticsCapacity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleTypes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  capacityUnit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  coldChain: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

module.exports = LogisticsCapacity;
