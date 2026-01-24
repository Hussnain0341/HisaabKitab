const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * Check if license tables exist
 */
router.get('/check', async (req, res) => {
  try {
    // Check if license_info table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'license_info'
      );
    `;
    
    const result = await db.query(checkTableQuery);
    const tablesExist = result.rows[0].exists;

    res.json({
      tablesExist: tablesExist,
      ready: tablesExist
    });
  } catch (error) {
    console.error('Error checking license tables:', error);
    res.status(500).json({
      tablesExist: false,
      ready: false,
      error: error.message
    });
  }
});

/**
 * Run license migration (add missing columns)
 */
router.post('/migrate-license', async (req, res) => {
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../../database/migration_add_missing_columns.sql');
    
    if (!fs.existsSync(migrationPath)) {
      return res.status(404).json({
        success: false,
        error: 'Migration file not found'
      });
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await db.query(migrationSQL);
    
    res.json({
      success: true,
      message: 'License columns migration completed successfully!'
    });
  } catch (error) {
    console.error('Migration error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

/**
 * Run license migration
 */
router.post('/migrate', async (req, res) => {
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../../database/migration_add_license_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await db.query(migrationSQL);
    
    res.json({
      success: true,
      message: 'License system setup completed successfully!'
    });
  } catch (error) {
    console.error('Migration error:', error);
    
    // If tables already exist, that's okay
    if (error.code === '42P07') {
      return res.json({
        success: true,
        message: 'License tables already exist. System is ready!'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

module.exports = router;


