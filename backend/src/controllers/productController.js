const { Product, User } = require('../models');
const { Op } = require('sequelize');

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status = 'active'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status };

    // Add filters
    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'businessName', 'location', 'isVerified']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'businessName', 'location', 'isVerified', 'phone']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      farmerId: req.user.id
    };

    const product = await Product.create(productData);

    // Fetch the created product with farmer details
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'businessName', 'location', 'isVerified']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    await product.update(updateData);

    // Fetch updated product with farmer details
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'businessName', 'location', 'isVerified']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.json({
      success: true,
      data: categories.map(cat => cat.category)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        isFeatured: true,
        status: 'active'
      },
      include: [
        {
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'businessName', 'location', 'isVerified']
        }
      ],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts
};

