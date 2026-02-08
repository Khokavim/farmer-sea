const { Order, OrderItem, Product, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { releaseEscrowForOrder } = require('./shipmentController');

const ORDER_STATUSES = new Set([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]);

const STATUS_RANK = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4
};

function getRank(status) {
  return Object.prototype.hasOwnProperty.call(STATUS_RANK, status) ? STATUS_RANK[status] : null;
}

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `FS${timestamp}${random}`;
};

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must include at least one item'
      });
    }

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];
    let sellerId = null;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      // P0: current fulfillment + escrow logic is order-level; do not allow mixed-seller carts.
      if (!sellerId) {
        sellerId = product.farmerId || null;
      } else if (product.farmerId !== sellerId) {
        return res.status(400).json({
          success: false,
          message: 'Mixed-seller carts are not supported yet. Please place separate orders per farmer.'
        });
      }

      const unitPrice = parseFloat(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice
      });
    }

    // Calculate totals
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 5000 ? 0 : 500; // Free shipping over ₦5000
    const totalAmount = subtotal + tax + shippingCost;

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      buyerId: req.user.id,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes,
      status: 'pending'
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });

      // Update product stock
      const product = await Product.findByPk(item.productId);
      await product.update({
        stock: product.stock - item.quantity
      });
    }

    // Fetch complete order with details
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'unit']
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by user role
    if (req.user.role === 'buyer') {
      whereClause.buyerId = req.user.id;
    } else if (req.user.role === 'farmer' || req.user.role === 'supplier') {
      // For farmers/suppliers, get orders for their products
      whereClause['$items.product.farmerId$'] = req.user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'farmer',
                  attributes: ['id', 'name', 'businessName']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'farmer',
                  attributes: ['id', 'name', 'businessName', 'phone']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    const isAuthorized =
      order.buyerId === req.user.id ||
      req.user.role === 'admin' ||
      ((req.user.role === 'farmer' || req.user.role === 'supplier') &&
        order.items.some(item => item.product.farmerId === req.user.id));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status || typeof status !== 'string' || !ORDER_STATUSES.has(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const isAdmin = req.user.role === 'admin';
    const isBuyer = order.buyerId === req.user.id;
    const isSeller =
      (req.user.role === 'farmer' || req.user.role === 'supplier') &&
      order.items.some(item => item.product.farmerId === req.user.id);

    if (!isAdmin && !isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Prevent updates to terminal states (unless admin)
    if (!isAdmin && ['cancelled', 'delivered'].includes(order.status)) {
      return res.status(409).json({
        success: false,
        message: 'Order cannot be updated at this stage'
      });
    }

    // Role-based status updates:
    // - Buyer: can only confirm delivery (delivered)
    // - Seller (farmer/supplier): can move order forward up to shipped, but not delivered/cancelled
    // - Admin: unrestricted
    if (!isAdmin) {
      if (isBuyer) {
        if (status !== 'delivered') {
          return res.status(403).json({
            success: false,
            message: 'Buyers can only confirm delivery'
          });
        }

        if (order.paymentStatus !== 'paid') {
          return res.status(409).json({
            success: false,
            message: 'Order not paid'
          });
        }

        if (order.status !== 'shipped') {
          return res.status(409).json({
            success: false,
            message: 'Order must be shipped before it can be marked delivered'
          });
        }
      }

      if (isSeller) {
        const allowedSellerStatuses = new Set(['confirmed', 'processing', 'shipped']);
        if (!allowedSellerStatuses.has(status)) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to set this status'
          });
        }

        if (order.paymentStatus !== 'paid') {
          return res.status(409).json({
            success: false,
            message: 'Order must be paid before fulfillment can begin'
          });
        }

        const prevRank = getRank(order.status);
        const nextRank = getRank(status);
        if (prevRank !== null && nextRank !== null && nextRank < prevRank) {
          return res.status(409).json({
            success: false,
            message: 'Cannot move order status backwards'
          });
        }
      }
    }

    const previousStatus = order.status;
    await order.update({ 
      status,
      notes: notes || order.notes
    });

    if (status === 'delivered' && previousStatus !== 'delivered') {
      await releaseEscrowForOrder(order.id);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (order.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      await product.update({
        stock: product.stock + item.quantity
      });
    }

    // Update order status
    await order.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
