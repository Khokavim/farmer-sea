# 🌾 FarmSea - Agricultural E-commerce Platform

<div align="center">

**Connecting Farmers, Suppliers, and Buyers in the Digital Agriculture Marketplace**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Future Projections](#-future-projections)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**FarmSea** is a comprehensive full-stack e-commerce platform designed specifically for the agricultural sector. It facilitates seamless connections between farmers, suppliers, and buyers, enabling efficient trade of agricultural products in a digital marketplace.

### Vision

To revolutionize agricultural commerce by providing a modern, efficient, and user-friendly platform that empowers farmers, suppliers, and buyers to conduct business seamlessly while promoting sustainable farming practices.

### Mission

- **For Farmers**: Provide an easy-to-use platform to showcase and sell products directly to buyers
- **For Suppliers**: Enable efficient distribution and supply chain management
- **For Buyers**: Offer a convenient marketplace to discover and purchase quality agricultural products
- **For the Industry**: Promote transparency, fair trade, and sustainable agricultural practices

### Key Benefits

- 🌱 **Direct Market Access**: Farmers can reach buyers without intermediaries
- 📊 **Transparency**: Clear pricing, product information, and order tracking
- 💬 **Communication**: Built-in messaging system for buyer-seller interaction
- 📱 **Accessibility**: Responsive design works on all devices
- 🔒 **Security**: Enterprise-grade security with JWT authentication
- ⚡ **Performance**: Optimized for speed and scalability

---

## ✨ Features

### 🔐 Authentication & Authorization

- **Multi-role System**: Support for Buyers, Farmers, Suppliers, and Administrators
- **Secure Authentication**: JWT-based token authentication
- **Role-based Access Control**: Different permissions for different user types
- **Profile Management**: Comprehensive user profiles with business information
- **Password Security**: Bcrypt hashing for secure password storage

### 🛒 Product Marketplace

- **Product Catalog**: Browse extensive catalog of agricultural products
- **Advanced Filtering**: Filter by category, price range, location, organic status
- **Search Functionality**: Full-text search across product names and descriptions
- **Product Details**: Rich product information including images, pricing, stock, and specifications
- **Featured Products**: Highlighted products for better visibility
- **Product Management**: CRUD operations for farmers and suppliers

### 🛍️ Shopping & Checkout

- **Shopping Cart**: Add, remove, and manage items in cart
- **Checkout Process**: Streamlined checkout with address management
- **Order Management**: Complete order lifecycle from creation to delivery
- **Order Tracking**: Real-time order status updates
- **Order History**: Comprehensive order history for all users

### 💬 Real-time Messaging

- **Direct Messaging**: One-on-one conversations between users
- **Real-time Updates**: WebSocket-based instant messaging
- **Message History**: Persistent message storage and retrieval
- **Typing Indicators**: Real-time typing status
- **Read Receipts**: Message read status tracking
- **Conversation Management**: Organize conversations by participants

### 📊 Dashboards

- **Farmer Dashboard**: 
  - Product management
  - Order tracking
  - Sales analytics
  - Inventory management

- **Supplier Dashboard**:
  - Supply chain management
  - Order fulfillment
  - Distribution tracking
  - Performance metrics

- **Buyer Dashboard**:
  - Order history
  - Favorite products
  - Saved addresses
  - Purchase analytics

- **Admin Dashboard**:
  - User management
  - Platform analytics
  - Content moderation
  - System configuration

### 🔒 Security Features

- **Rate Limiting**: Prevent API abuse and DDoS attacks
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers for HTTP protection
- **Input Validation**: Comprehensive input validation and sanitization
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection
- **XSS Protection**: Built-in React protections against XSS attacks

### 📱 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode**: Theme switching support (via next-themes)
- **Accessibility**: WCAG-compliant components using Radix UI
- **Performance**: Optimized bundle size and lazy loading
- **SEO Optimized**: Meta tags, structured data, and sitemap support

---

## 🛠️ Technology Stack

### Frontend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI library |
| **Language** | TypeScript | 5.8.3 | Type safety |
| **Build Tool** | Vite | 5.4.19 | Fast build tool and dev server |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| **UI Components** | shadcn/ui (Radix UI) | Latest | Accessible component library |
| **Routing** | React Router DOM | 6.30.1 | Client-side routing |
| **State Management** | TanStack React Query | 5.83.0 | Server state management |
| **Forms** | React Hook Form | 7.61.1 | Form handling |
| **Validation** | Zod | 3.25.76 | Schema validation |
| **Charts** | Recharts | 2.15.4 | Data visualization |
| **Icons** | Lucide React | 0.462.0 | Icon library |
| **Notifications** | Sonner | 1.7.4 | Toast notifications |
| **Date Handling** | date-fns | 3.6.0 | Date utilities |

### Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Framework** | Express | 4.18.2 | Web application framework |
| **Language** | JavaScript (ES6+) | - | Server-side language |
| **ORM** | Sequelize | 6.35.0 | Database ORM |
| **Database** | PostgreSQL | 12+ | Primary database (production) |
| **Database** | SQLite | 5.1.7 | Development database |
| **Authentication** | JWT (jsonwebtoken) | 9.0.2 | Token-based authentication |
| **Password Hashing** | bcryptjs | 2.4.3 | Secure password hashing |
| **Real-time** | Socket.io | 4.7.4 | WebSocket communication |
| **Validation** | express-validator | 7.0.1 | Input validation |
| **Security** | Helmet | 7.1.0 | Security headers |
| **Rate Limiting** | express-rate-limit | 7.1.5 | API rate limiting |
| **File Upload** | Multer | 1.4.5 | File upload handling |
| **Email** | Nodemailer | 6.9.7 | Email notifications |
| **Session Store** | Redis | 4.6.10 | Session storage |
| **Logging** | Morgan | 1.10.0 | HTTP request logger |

### Development Tools

- **TypeScript**: Type checking and IntelliSense
- **ESLint**: Code linting and quality
- **Nodemon**: Auto-restart for backend development
- **Concurrently**: Run multiple scripts simultaneously
- **Jest**: Testing framework
- **Supertest**: HTTP assertion library

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
│   Port: 8080    │
└────────┬────────┘
         │ HTTP/REST API
         │ WebSocket
         ▼
┌─────────────────┐
│   Backend API   │
│   (Express)     │
│   Port: 5000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│PostgreSQL│ │  Redis   │
│(Primary)│ │ (Sessions)│
└────────┘ └──────────┘
```

### Data Flow

1. **Client Request**: Frontend makes HTTP request to backend API
2. **Authentication**: JWT token validated via middleware
3. **Authorization**: Role-based access control checks permissions
4. **Business Logic**: Controllers process requests
5. **Data Access**: Sequelize ORM queries database
6. **Response**: JSON response sent back to frontend
7. **Real-time Updates**: Socket.io broadcasts updates to connected clients

### Security Layers

1. **Network Layer**: HTTPS, CORS, Helmet
2. **Application Layer**: Rate limiting, input validation
3. **Authentication Layer**: JWT tokens, bcrypt passwords
4. **Authorization Layer**: Role-based access control
5. **Data Layer**: SQL injection protection via ORM

---

## 📁 Project Structure

```
farmsea/
├── frontend/                 # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── cart/       # Shopping cart components
│   │   │   ├── messaging/  # Messaging components
│   │   │   ├── payment/    # Payment components
│   │   │   ├── products/   # Product components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── contexts/        # React contexts (state management)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript type definitions
│   ├── dist/               # Production build output
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
├── backend/                 # Backend Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── public/             # Static files
│   ├── database.sqlite    # SQLite database (dev)
│   ├── package.json        # Backend dependencies
│   └── env.example        # Environment variables template
│
├── docs/                    # Documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── DEPLOYMENT_GUIDE.md # Detailed deployment instructions
│   ├── backend-README.md   # Backend API documentation
│   └── README.md           # Documentation index
│
├── scripts/                 # Utility scripts
│   ├── start-backend.js    # Backend startup script
│   └── README.md           # Scripts documentation
│
├── package.json            # Root package.json (convenience scripts)
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/) - *For production*
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Jim-devENG/farmer-sea.git
cd farmer-sea
```

#### 2. Install Dependencies

**Option A: Install All Dependencies (Recommended)**

```bash
npm run install:all
```

This will install dependencies for:
- Root project (convenience scripts)
- Frontend application
- Backend API

**Option B: Install Individually**

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

#### 3. Environment Configuration

**Backend Environment Setup:**

```bash
cd backend
cp env.example .env
```

Edit `backend/.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8080

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farmsea
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Redis Configuration (Optional - for sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Database Setup:**

For **Development** (SQLite):
- No setup needed - SQLite database will be created automatically

For **Production** (PostgreSQL):
```sql
CREATE DATABASE farmsea;
CREATE USER farmsea_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE farmsea TO farmsea_user;
```

#### 4. Start Development Servers

**Option A: Run Both Servers Simultaneously (Recommended)**

```bash
# From root directory
npm run dev:all
```

This starts:
- Frontend on `http://localhost:8080`
- Backend on `http://localhost:5000`

**Option B: Run Servers Separately**

**Terminal 1 - Frontend:**
```bash
npm run start:frontend
# or
cd frontend && npm start
```

**Terminal 2 - Backend:**
```bash
npm run start:backend
# or
cd backend && npm run dev
```

### Verify Installation

1. **Frontend**: Open `http://localhost:8080` in your browser
2. **Backend**: Check `http://localhost:5000/health` - should return JSON status
3. **Database**: Backend will automatically sync database schema on startup

---

## 💻 Development Guide

### Available Scripts

#### Root Level Scripts

```bash
npm start              # Start frontend (default)
npm run start:frontend # Start frontend dev server
npm run start:backend  # Start backend dev server
npm run dev:all        # Run both frontend and backend
npm run build          # Build frontend for production
npm run install:all    # Install all dependencies
```

#### Frontend Scripts

```bash
cd frontend
npm start              # Start dev server (port 8080)
npm run dev            # Same as start
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

#### Backend Scripts

```bash
cd backend
npm start              # Start production server
npm run dev            # Start dev server with nodemon
npm test               # Run tests
```

### Code Style

- **Frontend**: TypeScript with ESLint
- **Backend**: JavaScript with ESLint
- **Formatting**: Prettier (recommended)
- **Naming**: 
  - Components: PascalCase (e.g., `ProductCard.tsx`)
  - Functions: camelCase (e.g., `getProducts()`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit: `git commit -m "Add: description of changes"`
4. Push: `git push origin feature/your-feature-name`
5. Create a Pull Request

### Environment Variables

Never commit `.env` files. Use `.env.example` as a template.

---

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.farmsea.com/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

#### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products (with filters) | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create product | Yes (Farmer/Supplier) |
| PUT | `/api/products/:id` | Update product | Yes (Owner) |
| DELETE | `/api/products/:id` | Delete product | Yes (Owner) |
| GET | `/api/products/categories` | Get categories | No |
| GET | `/api/products/featured` | Get featured products | No |

#### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | Yes (Buyer) |
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Yes (Seller/Admin) |
| PUT | `/api/orders/:id/cancel` | Cancel order | Yes (Buyer) |

#### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/messages/conversations` | Create conversation | Yes |
| GET | `/api/messages/conversations` | Get conversations | Yes |
| GET | `/api/messages/conversations/:id` | Get conversation messages | Yes |
| POST | `/api/messages/send` | Send message | Yes |
| PUT | `/api/messages/conversations/:id/read` | Mark as read | Yes |
| DELETE | `/api/messages/:id` | Delete message | Yes |
| GET | `/api/messages/unread-count` | Get unread count | Yes |

### WebSocket Events

#### Client to Server

- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

#### Server to Client

- `new_message` - New message received
- `user_typing` - User typing indicator
- `order_status_changed` - Order status updated
- `product_updated` - Product information updated

For detailed API documentation, see [docs/backend-README.md](docs/backend-README.md)

---

## 🚀 Deployment

### Frontend Deployment

The frontend is a static site that can be deployed to various platforms:

#### Option 1: Netlify (Recommended)

1. Build the frontend: `cd frontend && npm run build`
2. Drag and drop the `frontend/dist` folder to Netlify
3. Configure environment variables if needed
4. Your app is live!

#### Option 2: Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 3: GitHub Pages

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

### Backend Deployment

#### Option 1: Heroku

```bash
cd backend
heroku create farmsea-api
git push heroku main
```

#### Option 2: DigitalOcean / AWS / Azure

1. Set up a Node.js server
2. Install PostgreSQL
3. Configure environment variables
4. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/server.js --name farmsea-api
pm2 save
pm2 startup
```

#### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

For detailed deployment instructions, see:
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test

# Frontend UI E2E (Playwright)
cd frontend
npm install
npx playwright install
npm run test:e2e
```

### Test Coverage

- Unit tests for controllers and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows (planned)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Write/update tests** if applicable
5. **Ensure code quality**: Run linters and fix issues
6. **Commit your changes**: `git commit -m "Add: amazing feature"`
7. **Push to your branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Ensure all tests pass
- Keep PRs focused and small

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

---

### Technology Roadmap

#### Performance Optimization
- **CDN Integration**: Content delivery network for faster loading
- **Caching Strategy**: Redis caching for improved performance
- **Database Optimization**: Query optimization and indexing
- **Image Optimization**: Automatic image compression and CDN

#### Scalability
- **Microservices Architecture**: Break down into microservices
- **Load Balancing**: Distribute traffic across servers
- **Database Sharding**: Horizontal database scaling
- **Container Orchestration**: Kubernetes deployment

#### Security Enhancements
- **2FA Authentication**: Two-factor authentication
- **Biometric Login**: Fingerprint and face recognition
- **Advanced Fraud Detection**: ML-based fraud detection
- **Security Audits**: Regular security assessments

### Research & Development

#### Emerging Technologies
- **Blockchain Integration**: Transparent supply chain tracking
- **IoT Integration**: Connect with IoT devices for farm monitoring
- **Drone Technology**: Aerial farm monitoring and mapping
- **Satellite Imagery**: Satellite-based crop monitoring

#### AI & Machine Learning
- **Chatbot Support**: AI-powered customer support
- **Predictive Analytics**: ML-based demand forecasting
- **Image Recognition**: Automatic product categorization
- **Natural Language Processing**: Advanced search capabilities

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 FarmSea Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💬 Support

### Getting Help

- **Documentation**: Check the [docs/](docs/) folder for detailed documentation
- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/Jim-devENG/farmer-sea/issues)
- **Discussions**: Join discussions in [GitHub Discussions](https://github.com/Jim-devENG/farmer-sea/discussions)
- **Email**: support@farmsea.com

### Resources

- **API Documentation**: [docs/backend-README.md](docs/backend-README.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Contributing Guide**: See [Contributing](#-contributing) section above

### Community

- **GitHub**: [@Jim-devENG/farmer-sea](https://github.com/Jim-devENG/farmer-sea)
- **Discord**: [Join our Discord](https://discord.gg/farmsea) (coming soon)
- **Twitter**: [@FarmSea](https://twitter.com/farmsea) (coming soon)

---

## 🙏 Acknowledgments

- **Farmers**: For their dedication to sustainable agriculture
- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: Everyone who contributes to this project
- **Users**: For using and providing feedback on FarmSea

---

<div align="center">

**Built with ❤️ by the FarmSea Team**

[⭐ Star us on GitHub](https://github.com/Jim-devENG/farmer-sea) | [📖 Documentation](docs/) | [🐛 Report Bug](https://github.com/Jim-devENG/farmer-sea/issues) | [💡 Request Feature](https://github.com/Jim-devENG/farmer-sea/issues)

</div>
