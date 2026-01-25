/**
 * Run Security System Migration
 * Creates users, roles, audit logs, and session tables
 */

const path = require('path');
const fs = require('fs').promises;
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const { Client } = require('pg');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'hisaabkitab',
};

async function runMigration() {
  console.log('🔒 Starting Security System Migration...\n');

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migration_add_security_system.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    // Execute migration
    console.log('📝 Executing migration...');
    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully!\n');

    console.log('📋 Created tables:');
    console.log('   - users (with roles: administrator, cashier)');
    console.log('   - user_sessions (session management)');
    console.log('   - audit_logs (security audit trail)');
    console.log('   - encryption_keys (for sensitive data encryption)');
    console.log('\n📋 Updated tables:');
    console.log('   - sales (added is_finalized, created_by, updated_by)');
    console.log('   - settings (added first_time_setup_complete flag)');
    console.log('\n✅ Security system is ready!');
    console.log('   Run first-time setup to create your administrator account.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

