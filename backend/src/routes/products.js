const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts
} = require('../controllers/productController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, getAllProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:id', optionalAuth, getProductById);

// Protected routes
router.post('/', authenticateToken, authorizeRoles('farmer', 'supplier'), validateProduct, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;

