const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hisaabkitab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Running migration: Add credit_limit column to customers table...');
    
    // Check if column already exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'customers' AND column_name = 'credit_limit'
    `);
    
    if (checkResult.rows.length > 0) {
      console.log('✓ credit_limit column already exists');
      console.log('\n✅ Migration already completed!');
      return;
    }
    
    await client.query('BEGIN');
    
    // Add credit_limit column
    await client.query(`
      ALTER TABLE customers
      ADD COLUMN credit_limit NUMERIC(10, 2) DEFAULT NULL
    `);
    console.log('✓ Added credit_limit column');
    
    // Add comment
    await client.query(`
      COMMENT ON COLUMN customers.credit_limit IS 'Maximum credit limit for credit customers (optional)'
    `);
    console.log('✓ Added column comment');
    
    await client.query('COMMIT');
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42701') {
      console.log('Note: Column might already exist');
    } else if (error.code === '42501') {
      console.log('Note: Insufficient permissions. Please run as database owner.');
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();



