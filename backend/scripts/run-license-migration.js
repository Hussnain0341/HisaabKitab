const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hisaabkitab',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

async function runMigration() {
  console.log('🚀 Starting License System Migration...\n');

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Read migration file
    const migrationPath = path.join(__dirname, '../../database/migration_add_license_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    console.log('📝 Executing license system migration...');
    await client.query(migrationSQL);
    
    console.log('✅ License system migration completed successfully!');
    console.log('\n📋 Created tables:');
    console.log('   - license_info (stores encrypted license data)');
    console.log('   - license_logs (logs license operations)');
    console.log('\n✨ License system is now ready to use.\n');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42P07') {
      console.error('   Tables may already exist. This is okay if you\'re re-running the migration.');
    } else {
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

runMigration();








