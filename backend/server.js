const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// License middleware (must be loaded before routes)
const licenseMiddleware = require('./middleware/licenseMiddleware');

// Flag to track if database is ready
let dbReady = false;

// Test database connection on startup with retry logic
(async () => {
  console.log('[Backend] Testing database connection...');
  dbReady = await db.testConnection(5, 2000); // 5 retries, 2 second delay
  
  if (dbReady) {
    // Initialize backup scheduler and perform startup backup
    const backupScheduler = require('./utils/backupScheduler');
    backupScheduler.initializeScheduler().then(() => {
      console.log('[Backup Scheduler] Scheduler initialized');
    }).catch(err => {
      console.error('[Backup Scheduler] Initialization error:', err);
    });
    
    // Perform startup backup if enabled (non-blocking)
    backupScheduler.performStartupBackup().catch(err => {
      console.error('[Backup Scheduler] Startup backup error:', err);
    });
  } else {
    console.error('⚠️ Database connection failed. App will continue but database operations may fail.');
    console.error('Please check your .env file and ensure PostgreSQL is running');
    // CRITICAL: Don't crash - app can still open in read-only mode
  }
})();

// Health check endpoint (no license check)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HisaabKitab API is running',
    mode: readOnlyMode ? 'read-only' : 'full-access',
    timestamp: new Date().toISOString()
  });
});

// License routes (no license check required)
console.log('\n[Server] ========================================');
console.log('[Server] Registering License Routes...');
console.log('[Server] Route: POST /api/license/validate');
console.log('[Server] Route: GET /api/license/status');
console.log('[Server] Route: POST /api/license/revalidate');
console.log('[Server] Route: GET /api/license/test');
console.log('[Server] ========================================\n');
app.use('/api/license', require('./routes/license'));

// Authentication routes (no license check required, but may require auth)
console.log('[Server] Registering Authentication Routes...');
console.log('[Server] Route: POST /api/auth/login');
console.log('[Server] Route: POST /api/auth/logout');
console.log('[Server] Route: GET /api/auth/me');
console.log('[Server] Route: POST /api/auth/forgot-password');
console.log('[Server] Route: POST /api/auth/reset-password');
console.log('[Server] Route: POST /api/auth/change-password');
app.use('/api/auth', require('./routes/auth'));

// First-time setup routes (no license check required)
console.log('[Server] Registering Setup Routes...');
console.log('[Server] Route: GET /api/setup/check');
console.log('[Server] Route: POST /api/setup/create-admin');
console.log('[Server] Route: GET /api/setup-auth/check-first-time');
console.log('[Server] Route: POST /api/setup-auth/create-admin');
app.use('/api/setup', require('./routes/setup'));
app.use('/api/setup-auth', require('./routes/setupAuth'));

// Serve React app static files FIRST (before license check)
// This ensures the React app can load even without a license
// Check if build folder exists, serve it if available (for both dev and production)
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Apply license middleware to API routes only (not static files or React app)
// License check happens after read-only check
app.use((req, res, next) => {
  // Skip license check for:
  // - Health check
  // - License endpoints
  // - Setup endpoints
  // - Auth endpoints (login/logout)
  // - Static files (React app)
  if (
    req.path === '/api/health' || 
    req.path.startsWith('/api/license') || 
    req.path.startsWith('/api/setup') ||
    req.path.startsWith('/api/auth') ||
    req.path.startsWith('/static/') ||
    (!req.path.startsWith('/api/') && req.method === 'GET')
  ) {
    return next();
  }
  
  // Apply license check to all other API routes
  licenseMiddleware.checkLicense(req, res, next);
});

// CRITICAL: Apply write-guard middleware after license check
// This ensures backend also enforces read-only mode (frontend can be bypassed)
app.use((req, res, next) => {
  // Skip write-guard for:
  // - Health check
  // - License endpoints (they handle their own checks)
  // - Setup endpoints
  // - Auth endpoints (login/logout)
  // - Settings endpoints (must always be accessible for license activation and language changes)
  // - Static files
  if (
    req.path === '/api/health' || 
    req.path.startsWith('/api/license') || 
    req.path.startsWith('/api/setup') ||
    req.path.startsWith('/api/auth') ||
    req.path.startsWith('/api/settings') ||
    req.path.startsWith('/static/') ||
    (!req.path.startsWith('/api/') && req.method === 'GET')
  ) {
    return next();
  }
  
  // Apply write-guard to all other API routes
  licenseMiddleware.checkWriteOperations(req, res, next);
});

// API routes (protected by license middleware)
app.use('/api/products', require('./routes/products'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/customer-payments', require('./routes/customer_payments'));
app.use('/api/supplier-payments', require('./routes/supplier-payments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications').router);

// Catch-all route for React app (must be last, after all API routes)
// This serves index.html for any non-API routes (React Router)
const indexHtmlPath = path.join(__dirname, '../frontend/build', 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api/')) {
      res.sendFile(indexHtmlPath);
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
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

// Start server with database readiness check
const startServer = async () => {
  // Wait for database connection (with timeout)
  const maxWaitTime = 10000; // 10 seconds max wait
  const startTime = Date.now();
  
  while (!dbReady && (Date.now() - startTime) < maxWaitTime) {
    console.log('[Backend] Waiting for database connection...');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  if (!dbReady) {
    console.warn('[Backend] ⚠️ Starting server without database connection. Some features may not work.');
  }
  
  app.listen(PORT, HOST, () => {
    console.log(`\n[Backend] ✅ HisaabKitab Backend Server running on http://${HOST}:${PORT}`);
    console.log(`[Backend] Mode: ${readOnlyMode ? 'Read-Only (Client PC)' : 'Full Access (Server PC)'}`);
    console.log(`[Backend] Database: ${dbReady ? '✅ Connected' : '❌ Not Connected'}`);
    if (!readOnlyMode && HOST === '0.0.0.0') {
      console.log(`[Backend] LAN Access: Other PCs can connect using your local IP address`);
      console.log(`[Backend] To find your IP: Run 'ipconfig' on Windows or 'ifconfig' on Linux/Mac\n`);
    }
  });
};

// Start the server
startServer().catch(err => {
  console.error('[Backend] ❌ Failed to start server:', err);
  process.exit(1);
});
