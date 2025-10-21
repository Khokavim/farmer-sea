const { User, Product, Order, OrderItem, Conversation, Message } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if users already exist
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('✅ Database already seeded, skipping...');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@farmersea.com',
      password: 'admin123',
      role: 'admin',
      phone: '+2348012345678',
      businessName: 'FarmSea Admin',
      location: 'Lagos, Nigeria',
      isVerified: true
    });

    // Create farmer users
    const farmer1 = await User.create({
      name: 'John Okafor',
      email: 'john@farmersea.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '+2348023456789',
      businessName: 'Okafor Farms',
      location: 'Enugu, Nigeria',
      isVerified: true
    });

    const farmer2 = await User.create({
      name: 'Mary Johnson',
      email: 'mary@farmersea.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '+2348034567890',
      businessName: 'Johnson Organic Farm',
      location: 'Ogun, Nigeria',
      isVerified: true
    });

    // Create supplier user
    const supplier = await User.create({
      name: 'David Adebayo',
      email: 'david@farmersea.com',
      password: 'supplier123',
      role: 'supplier',
      phone: '+2348045678901',
      businessName: 'Adebayo Agro Supply',
      location: 'Kano, Nigeria',
      isVerified: true
    });

    // Create buyer users
    const buyer1 = await User.create({
      name: 'Sarah Williams',
      email: 'sarah@farmersea.com',
      password: 'buyer123',
      role: 'buyer',
      phone: '+2348056789012',
      businessName: 'Williams Restaurant',
      location: 'Lagos, Nigeria',
      isVerified: true
    });

    const buyer2 = await User.create({
      name: 'Michael Brown',
      email: 'michael@farmersea.com',
      password: 'buyer123',
      role: 'buyer',
      phone: '+2348067890123',
      businessName: 'Brown Supermarket',
      location: 'Abuja, Nigeria',
      isVerified: true
    });

    // Create products
    const products = await Product.bulkCreate([
      {
        name: 'Fresh Tomatoes',
        description: 'Organic, locally grown tomatoes perfect for cooking and salads',
        price: 150.00,
        category: 'Vegetables',
        subcategory: 'Tomatoes',
        images: ['https://images.unsplash.com/photo-1546470427-5c1d4b2b8b8b?w=500'],
        stock: 100,
        unit: 'kg',
        farmerId: farmer1.id,
        isOrganic: true,
        tags: ['organic', 'fresh', 'local'],
        isFeatured: true
      },
      {
        name: 'Irish Potatoes',
        description: 'Premium quality Irish potatoes, great for cooking and frying',
        price: 200.00,
        category: 'Vegetables',
        subcategory: 'Potatoes',
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500'],
        stock: 150,
        unit: 'kg',
        farmerId: farmer1.id,
        tags: ['premium', 'fresh', 'cooking'],
        isFeatured: true
      },
      {
        name: 'Green Bell Peppers',
        description: 'Fresh green bell peppers, perfect for stir-fries and salads',
        price: 300.00,
        category: 'Vegetables',
        subcategory: 'Peppers',
        images: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500'],
        stock: 80,
        unit: 'kg',
        farmerId: farmer2.id,
        isOrganic: true,
        tags: ['organic', 'fresh', 'healthy'],
        isFeatured: false
      },
      {
        name: 'Fresh Carrots',
        description: 'Sweet and crunchy carrots, rich in vitamins and minerals',
        price: 250.00,
        category: 'Vegetables',
        subcategory: 'Root Vegetables',
        images: ['https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500'],
        stock: 120,
        unit: 'kg',
        farmerId: farmer2.id,
        isOrganic: true,
        tags: ['organic', 'sweet', 'vitamins'],
        isFeatured: true
      },
      {
        name: 'Fresh Onions',
        description: 'Quality onions perfect for cooking and seasoning',
        price: 180.00,
        category: 'Vegetables',
        subcategory: 'Onions',
        images: ['https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=500'],
        stock: 200,
        unit: 'kg',
        farmerId: farmer1.id,
        tags: ['fresh', 'cooking', 'seasoning'],
        isFeatured: false
      }
    ]);

    // Create conversations
    const conversation1 = await Conversation.create({
      title: 'Chat between John Okafor and Sarah Williams',
      type: 'direct'
    });

    const conversation2 = await Conversation.create({
      title: 'Chat between Mary Johnson and Michael Brown',
      type: 'direct'
    });

    // Add participants to conversations
    await conversation1.addParticipants([farmer1.id, buyer1.id]);
    await conversation2.addParticipants([farmer2.id, buyer2.id]);

    // Create sample messages
    await Message.bulkCreate([
      {
        conversationId: conversation1.id,
        senderId: buyer1.id,
        content: 'Hi John, I\'m interested in your fresh tomatoes. Are they available?',
        messageType: 'text'
      },
      {
        conversationId: conversation1.id,
        senderId: farmer1.id,
        content: 'Hello Sarah! Yes, I have plenty of fresh tomatoes available. How many kg do you need?',
        messageType: 'text'
      },
      {
        conversationId: conversation2.id,
        senderId: buyer2.id,
        content: 'Hi Mary, I\'d like to order some of your organic carrots.',
        messageType: 'text'
      }
    ]);

    // Create sample orders
    const order1 = await Order.create({
      orderNumber: 'FS001234',
      buyerId: buyer1.id,
      subtotal: 300.00,
      tax: 30.00,
      shippingCost: 0,
      totalAmount: 330.00,
      shippingAddress: {
        street: '123 Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        zipCode: '101241',
        country: 'Nigeria'
      },
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    const order2 = await Order.create({
      orderNumber: 'FS001235',
      buyerId: buyer2.id,
      subtotal: 500.00,
      tax: 50.00,
      shippingCost: 0,
      totalAmount: 550.00,
      shippingAddress: {
        street: '456 Wuse 2',
        city: 'Abuja',
        state: 'FCT',
        zipCode: '900211',
        country: 'Nigeria'
      },
      status: 'processing',
      paymentStatus: 'paid'
    });

    // Create order items
    await OrderItem.bulkCreate([
      {
        orderId: order1.id,
        productId: products[0].id,
        quantity: 2,
        unitPrice: 150.00,
        totalPrice: 300.00
      },
      {
        orderId: order2.id,
        productId: products[3].id,
        quantity: 2,
        unitPrice: 250.00,
        totalPrice: 500.00
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log('👥 Created users: Admin, 2 Farmers, 1 Supplier, 2 Buyers');
    console.log('🥬 Created 5 products with various categories');
    console.log('💬 Created sample conversations and messages');
    console.log('📦 Created sample orders with items');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
