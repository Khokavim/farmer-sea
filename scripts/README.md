# Scripts

This folder contains utility scripts for the FarmSea project.

## Available Scripts

### start-backend.js

A convenience script to start the backend server with predefined environment variables.

**Usage:**
```bash
node scripts/start-backend.js
```

**What it does:**
- Sets development environment variables
- Configures port 5001
- Sets frontend URL to http://localhost:8080
- Sets a default JWT secret
- Starts the backend server

**Note:** For production, use the backend's npm scripts instead:
```bash
cd backend
npm start
```

