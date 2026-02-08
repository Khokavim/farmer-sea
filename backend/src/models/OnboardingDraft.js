const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const OnboardingDraft = sequelize.define('OnboardingDraft', {
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  lastActiveAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = OnboardingDraft;
