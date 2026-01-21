# FarmSea - Agricultural E-commerce Platform

A full-stack e-commerce platform for agricultural products, connecting farmers, suppliers, and buyers.

## Project Structure

This project is organized into two main directories:

- **`frontend/`** - React + TypeScript frontend application
- **`backend/`** - Node.js + Express backend API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Installation

#### Quick Start (Root Level)

From the root directory, you can install all dependencies and run both frontend and backend:

```sh
# Install all dependencies (root, frontend, and backend)
npm run install:all

# Start frontend (from root)
npm start
# or
npm run start:frontend

# Start backend (from root)
npm run start:backend

# Run both frontend and backend simultaneously
npm run dev:all
```

#### Individual Setup

**Frontend Setup:**

```sh
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# or
npm run dev
```

The frontend will run on `http://localhost:8080`

**Backend Setup:**

```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp env.example .env

# Start development server
npm run dev
# or
npm start
```

The backend API will run on `http://localhost:5000`

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library (Radix UI)
- **React Router** - Client-side routing
- **TanStack React Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM
- **PostgreSQL/SQLite** - Database
- **Socket.io** - Real-time WebSocket communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

- User authentication and authorization (Buyer, Farmer, Supplier, Admin)
- Product marketplace with filtering and search
- Shopping cart and checkout
- Order management
- Real-time messaging between users
- Dashboard for different user roles
- Payment integration

## Development

### Running Both Frontend and Backend

**Option 1: Using root-level scripts (Recommended)**
```sh
# From root directory - runs both simultaneously
npm run dev:all
```

**Option 2: Using separate terminals**

**Terminal 1 - Frontend:**
```sh
npm run start:frontend
# or
cd frontend && npm start
```

**Terminal 2 - Backend:**
```sh
npm run start:backend
# or
cd backend && npm run dev
```

## Deployment

See `docs/DEPLOYMENT.md` and `docs/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## License

MIT
