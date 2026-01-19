const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces for LAN access

// Middleware - CORS with explicit origin settings
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read-only mode detection middleware
const readOnlyMode = process.env.READ_ONLY_MODE === 'true' || false;

// Middleware to block write operations in read-only mode
const checkReadOnly = (req, res, next) => {
  if (readOnlyMode && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return res.status(403).json({ 
      error: 'Read-only mode: Write operations are not allowed on client PCs',
      readOnly: true
    });
  }
  next();
};

// Apply read-only check to all routes except health check
app.use((req, res, next) => {
  if (req.path !== '/api/health') {
    checkReadOnly(req, res, next);
  } else {
    next();
  }
});

// Database connection
const db = require('./db');

// Test database connection on startup
db.query('SELECT NOW() as current_time')
  .then(() => {
    console.log('✅ Database connection verified');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your .env file and ensure PostgreSQL is running');
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HisaabKitab API is running',
    mode: readOnlyMode ? 'read-only' : 'full-access',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/products', require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/customer-payments', require('./routes/customer_payments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/backup', require('./routes/backup'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, HOST, () => {
  console.log(`HisaabKitab Backend Server running on http://${HOST}:${PORT}`);
  console.log(`Mode: ${readOnlyMode ? 'Read-Only (Client PC)' : 'Full Access (Server PC)'}`);
  if (!readOnlyMode && HOST === '0.0.0.0') {
    console.log(`\nLAN Access: Other PCs can connect using your local IP address`);
    console.log(`To find your IP: Run 'ipconfig' on Windows or 'ifconfig' on Linux/Mac\n`);
  }
});
