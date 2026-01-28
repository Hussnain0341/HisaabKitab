const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

const DB_NAME = process.env.DB_NAME || 'hisaabkitab';
const IS_AUTO = process.argv.includes('--auto') || process.env.HK_AUTO_SETUP === '1';

async function setupDatabase() {
  console.log('🚀 Starting HisaabKitab Database Setup...\n');

  // Step 1: Connect to PostgreSQL as superuser to create database
  const adminClient = new Client({
    ...DB_CONFIG,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL server');

    // Check if database exists
    const dbCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (dbCheck.rows.length > 0) {
      console.log(`⚠️  Database '${DB_NAME}' already exists`);
      if (!IS_AUTO) {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const answer = await new Promise(resolve => {
          readline.question('Do you want to drop and recreate it? (yes/no): ', resolve);
        });
        readline.close();

        if (answer.toLowerCase() === 'yes') {
          await adminClient.query(`DROP DATABASE ${DB_NAME}`);
          console.log(`✅ Dropped existing database '${DB_NAME}'`);
          // Create it again
          await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
          console.log(`✅ Created database '${DB_NAME}'`);
        } else {
          console.log('⏭️  Skipping database creation');
          await adminClient.end();
          // Still run schema script to ensure tables exist
        }
      } else {
        console.log('⏭️  Auto-setup: database already exists, will verify schema');
        await adminClient.end();
        // Continue to schema setup - CREATE TABLE IF NOT EXISTS will handle existing tables
      }
    } else {
      // Create database (only if it doesn't exist)
      await adminClient.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Created database '${DB_NAME}'`);
      await adminClient.end();
    }

    // Step 2: Connect to new database and run init script
    const dbClient = new Client({
      ...DB_CONFIG,
      database: DB_NAME
    });

    await dbClient.connect();
    console.log(`✅ Connected to database '${DB_NAME}'`);

    // Read and execute the complete schema script
    // This single file contains ALL tables, columns, indexes, triggers and default settings
    // All CREATE statements use IF NOT EXISTS, so it's safe to run multiple times
    const initSqlPath = path.join(__dirname, 'complete_schema.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    console.log('📝 Running initialization script...');
    console.log('   (This will create all tables, columns, indexes, triggers, and default data)');
    await dbClient.query(initSql);
    console.log('✅ Database schema initialized successfully');

    await dbClient.end();
    console.log('\n🎉 Database setup completed successfully!');
    if (!IS_AUTO) {
      console.log(`\nYou can now start the application with: npm run dev\n`);
    } else {
      console.log('\nDatabase is ready for use.\n');
    }

  } catch (error) {
    console.error('\n❌ Error during database setup:');
    console.error(error.message);
    console.error('\nPlease ensure:');
    console.error('1. PostgreSQL is installed and running');
    console.error('2. Database credentials in backend/.env are correct');
    console.error('3. You have permission to create databases');
    process.exit(1);
  }
}

setupDatabase();









