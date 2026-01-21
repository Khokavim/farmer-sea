# FarmSea Backend API

A comprehensive backend API for the FarmSea agricultural e-commerce platform built with Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for agricultural products
- **Order Management**: Complete order lifecycle management
- **Real-time Messaging**: WebSocket-based chat system
- **User Management**: Multi-role user system (Farmer, Supplier, Buyer, Admin)
- **Database**: PostgreSQL with Sequelize ORM
- **Security**: Rate limiting, CORS, Helmet, input validation
- **Real-time Updates**: WebSocket support for live updates

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farmsea/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:8080
   
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=farmsea
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE farmsea;
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Farmer/Supplier only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get product categories
- `GET /api/products/featured` - Get featured products

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Messages
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/conversations/:id/read` - Mark messages as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/unread-count` - Get unread message count

## 🔧 Database Schema

### Users
- id, email, name, password, role, phone, businessName, location, isVerified, profileImage, isActive, lastLogin

### Products
- id, name, description, price, category, subcategory, images, stock, unit, status, isOrganic, harvestDate, expiryDate, location, rating, reviewCount, minOrder, maxOrder, tags, isFeatured, farmerId

### Orders
- id, orderNumber, status, totalAmount, subtotal, tax, shippingCost, discount, paymentMethod, paymentStatus, shippingAddress, billingAddress, notes, estimatedDelivery, actualDelivery, trackingNumber, buyerId

### OrderItems
- id, orderId, productId, quantity, unitPrice, totalPrice, notes

### Conversations
- id, title, type, isActive, lastMessageAt, lastMessage, unreadCount

### Messages
- id, conversationId, senderId, content, messageType, isRead, readAt, attachments, replyTo, isEdited, editedAt

## 🔌 WebSocket Events

### Client to Server
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `order_update` - Update order status
- `product_update` - Update product information
- `update_status` - Update user status

### Server to Client
- `new_message` - New message received
- `user_typing` - User typing indicator
- `order_status_changed` - Order status updated
- `product_updated` - Product information updated
- `user_status_changed` - User status changed
- `user_offline` - User went offline

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different user roles
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Validate all incoming data
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers
- **Password Hashing**: Bcrypt for secure password storage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name farmsea-api
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t farmsea-api .
docker run -p 5000:5000 farmsea-api
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:8080 |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | farmsea |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Database connection monitoring
- Error logging and handling
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@farmersea.com or create an issue in the repository.

