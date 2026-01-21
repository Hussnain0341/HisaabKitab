const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hisaabkitab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function ensureGeneralCategory() {
  const client = await pool.connect();
  try {
    console.log('Ensuring "General" Product Group exists...');
    await client.query('BEGIN');
    
    // Check if General category exists
    const checkResult = await client.query(
      "SELECT category_id FROM categories WHERE LOWER(category_name) = 'general'"
    );
    
    if (checkResult.rows.length === 0) {
      // Create General category
      await client.query(
        `INSERT INTO categories (category_name, status) 
         VALUES ('General', 'active')`
      );
      console.log('✓ Created "General" Product Group');
    } else {
      // Ensure it's active
      await client.query(
        `UPDATE categories 
         SET status = 'active'
         WHERE LOWER(category_name) = 'general'`
      );
      console.log('✓ "General" Product Group already exists and is active');
    }
    
    await client.query('COMMIT');
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

ensureGeneralCategory();

