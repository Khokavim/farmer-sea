const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'kg'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'out_of_stock'),
    defaultValue: 'active'
  },
  isOrganic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  harvestDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minOrder: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 1
  },
  maxOrder: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Product;
