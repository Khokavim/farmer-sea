const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('direct', 'group', 'support'),
    defaultValue: 'direct'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastMessageAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  unreadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Conversation;
