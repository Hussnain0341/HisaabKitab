const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// PostgreSQL connection configuration
// For local development, PostgreSQL should be running on localhost
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hisaabkitab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10 seconds for slower PostgreSQL startups
  retryDelayMs: 1000, // Wait 1 second between retries
});

// Test database connection
pool.on('connect', (client) => {
  console.log('✅ Connected to PostgreSQL database');
  // Test query on first connection
  client.query('SELECT NOW()').catch(err => {
    console.error('Database query test failed:', err.message);
  });
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  console.error('Error details:', err.message);
  // Don't exit - let the app continue and show errors
});

// Query helper function with retry logic
// CRITICAL: Reduced logging to prevent console spam
const query = async (text, params, retries = 3) => {
  const start = Date.now();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      // Only log slow queries or errors (reduce console spam)
      if (duration > 1000 || attempt > 1) {
        if (attempt > 1) {
          console.log(`✅ Database query succeeded on attempt ${attempt}`);
        }
        // Only log query text for slow queries or errors
        const queryPreview = text.length > 100 ? text.substring(0, 100) + '...' : text;
        console.log('Executed query', { text: queryPreview, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      if (attempt === retries) {
        console.error('Database query error (final attempt):', error.message);
        throw error;
      }
      // Only log retry warnings for non-trivial errors
      if (error.code !== '57P01' && error.code !== '57P02') { // Skip connection errors in retry logs
        console.warn(`⚠️ Database query failed (attempt ${attempt}/${retries}), retrying...`, error.message);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
};

// Test database connection with retry logic
const testConnection = async (maxRetries = 5, retryDelay = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await pool.query('SELECT NOW() as current_time');
      console.log('✅ Database connection verified');
      return true;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`❌ Database connection failed after ${maxRetries} attempts:`, error.message);
        return false;
      }
      console.warn(`⚠️ Database connection attempt ${attempt}/${maxRetries} failed, retrying in ${retryDelay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return false;
};

// Get client for transactions
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);
  
  // Monkey patch the query method to log the query at the end
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release();
  };
  
  return client;
};

module.exports = {
  query,
  getClient,
  pool,
  testConnection
};

