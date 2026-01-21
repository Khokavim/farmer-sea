// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '5001';
process.env.FRONTEND_URL = 'http://localhost:8080';
process.env.JWT_SECRET = 'farmsea-super-secret-jwt-key-2024';

// Start the server
require('../backend/src/server.js');
