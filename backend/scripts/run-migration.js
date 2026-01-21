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
    console.log('Running migration: Fix purchases table...');
    
    await client.query('BEGIN');
    
    // Make product_id nullable
    await client.query('ALTER TABLE purchases ALTER COLUMN product_id DROP NOT NULL');
    console.log('✓ Made product_id nullable');
    
    // Make quantity nullable
    await client.query('ALTER TABLE purchases ALTER COLUMN quantity DROP NOT NULL');
    console.log('✓ Made quantity nullable');
    
    // Make purchase_price nullable
    await client.query('ALTER TABLE purchases ALTER COLUMN purchase_price DROP NOT NULL');
    console.log('✓ Made purchase_price nullable');
    
    await client.query('COMMIT');
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42704') {
      console.log('Note: Column might not exist or already nullable');
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

