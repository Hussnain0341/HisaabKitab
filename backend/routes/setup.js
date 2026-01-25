const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

/**
 * Check if first-time setup is needed (checks for users)
 */
router.get('/check', async (req, res) => {
  try {
    // First check if users table exists
    const checkUsersTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    
    const tableResult = await db.query(checkUsersTableQuery);
    const usersTableExists = tableResult.rows[0].exists;

    if (!usersTableExists) {
      // Users table doesn't exist - setup is needed
      return res.json({
        needsSetup: true,
        userCount: 0,
        setupComplete: false,
        tablesExist: false
      });
    }

    // Check if any users exist
    const userResult = await db.query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userResult.rows[0].count, 10);

    // Check if first-time setup is marked as complete in settings
    let setupComplete = false;
    try {
      const settingsResult = await db.query(`
        SELECT other_app_settings FROM settings ORDER BY id LIMIT 1
      `);
      
      if (settingsResult.rows.length > 0) {
        const settings = settingsResult.rows[0].other_app_settings || {};
        if (typeof settings === 'string') {
          settings = JSON.parse(settings);
        }
        setupComplete = settings.firstTimeSetupComplete === true;
      }
    } catch (err) {
      // Settings table might not exist yet, that's okay
      console.log('[Setup] Settings check skipped:', err.message);
    }

    // Check if license_info table exists (for backward compatibility)
    const checkLicenseTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'license_info'
      );
    `;
    
    const licenseResult = await db.query(checkLicenseTableQuery);
    const tablesExist = licenseResult.rows[0].exists;

    res.json({
      needsSetup: userCount === 0 || !setupComplete,
      userCount,
      setupComplete,
      tablesExist
    });
  } catch (error) {
    console.error('[Setup Route] Check error:', error);
    // If error, assume setup is needed
    res.json({
      needsSetup: true,
      userCount: 0,
      setupComplete: false,
      tablesExist: false,
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
 * Run license migration (legacy endpoint - use /migrate-license instead)
 */
router.post('/migrate', async (req, res) => {
  try {
    // Check if the old migration file exists
    const oldMigrationPath = path.join(__dirname, '../../database/migration_add_license_system.sql');
    
    if (!fs.existsSync(oldMigrationPath)) {
      // File doesn't exist - license system is already set up
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
      
      if (tablesExist) {
        return res.json({
          success: true,
          message: 'License tables already exist. System is ready!'
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'Migration file not found. Please use /migrate-license endpoint instead.'
        });
      }
    }
    
    // If file exists, read and execute it
    const migrationSQL = fs.readFileSync(oldMigrationPath, 'utf8');
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


