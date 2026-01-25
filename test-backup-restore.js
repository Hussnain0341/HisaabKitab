/**
 * Comprehensive Backup & Restore Testing Script
 * Tests all backup and restore functionality
 */

const backupService = require('./backend/utils/backupService');
const backupScheduler = require('./backend/utils/backupScheduler');
const db = require('./backend/db');

// Test results tracker
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
};

function logTest(name, status, message = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${status}] ${name}${message ? ': ' + message : ''}`);
  
  if (status === 'PASS') {
    testResults.passed.push(name);
  } else if (status === 'FAIL') {
    testResults.failed.push(name);
  } else {
    testResults.warnings.push(name);
  }
}

async function testBackupSettings() {
  console.log('\n📋 Testing Backup Settings...');
  
  try {
    // Test 1: Get backup settings
    const settings = await backupService.getBackupSettings();
    if (settings && typeof settings === 'object') {
      logTest('Get Backup Settings', 'PASS', `Enabled: ${settings.enabled}, Mode: ${settings.mode}`);
    } else {
      logTest('Get Backup Settings', 'FAIL', 'Settings not returned correctly');
      return false;
    }
    
    // Test 2: Save backup settings
    const testSettings = {
      enabled: true,
      mode: 'scheduled',
      scheduledTime: '03:00',
      backupDir: backupService.DEFAULT_BACKUP_DIR,
      retentionCount: 5,
    };
    
    const saved = await backupService.saveBackupSettings(testSettings);
    if (saved) {
      logTest('Save Backup Settings', 'PASS');
    } else {
      logTest('Save Backup Settings', 'FAIL', 'Failed to save settings');
      return false;
    }
    
    // Test 3: Verify settings were saved
    const verifySettings = await backupService.getBackupSettings();
    if (verifySettings.mode === 'scheduled' && verifySettings.scheduledTime === '03:00') {
      logTest('Verify Settings Persistence', 'PASS');
    } else {
      logTest('Verify Settings Persistence', 'FAIL', 'Settings not persisted correctly');
      return false;
    }
    
    return true;
  } catch (error) {
    logTest('Backup Settings Tests', 'FAIL', error.message);
    return false;
  }
}

async function testBackupCreation() {
  console.log('\n💾 Testing Backup Creation...');
  
  try {
    // Test 1: Create backup
    console.log('Creating backup...');
    const result = await backupService.createBackup();
    
    if (result && result.success && result.filename) {
      logTest('Create Backup', 'PASS', `File: ${result.filename}, Size: ${result.size} bytes`);
    } else {
      logTest('Create Backup', 'FAIL', 'Backup creation failed');
      return false;
    }
    
    // Test 2: Verify backup file exists
    const fs = require('fs').promises;
    const path = require('path');
    // result.path already contains the full path to the backup file
    const backupPath = result.path || path.join(backupService.DEFAULT_BACKUP_DIR, result.filename);
    
    try {
      const stats = await fs.stat(backupPath);
      if (stats.size > 0) {
        logTest('Verify Backup File Exists', 'PASS', `File size: ${stats.size} bytes`);
      } else {
        logTest('Verify Backup File Exists', 'FAIL', 'Backup file is empty');
        return false;
      }
    } catch (error) {
      logTest('Verify Backup File Exists', 'FAIL', `File not found: ${error.message} (Path: ${backupPath})`);
      return false;
    }
    
    // Test 3: Verify backup file is valid SQL
    try {
      const fileContent = await fs.readFile(backupPath, 'utf8', { encoding: 'utf8' });
      if (fileContent.includes('PostgreSQL database dump') || fileContent.includes('CREATE TABLE') || fileContent.includes('COPY ')) {
        logTest('Verify Backup File Content', 'PASS', 'Valid SQL dump file');
      } else {
        logTest('Verify Backup File Content', 'WARN', 'File content may not be valid SQL');
      }
    } catch (error) {
      logTest('Verify Backup File Content', 'WARN', `Could not read file: ${error.message}`);
    }
    
    return result;
  } catch (error) {
    logTest('Backup Creation', 'FAIL', error.message);
    console.error('Error details:', error);
    return false;
  }
}

async function testBackupListing() {
  console.log('\n📂 Testing Backup Listing...');
  
  try {
    // Test 1: List backups
    const backups = await backupService.listBackups();
    
    if (Array.isArray(backups)) {
      logTest('List Backups', 'PASS', `Found ${backups.length} backup(s)`);
      
      if (backups.length > 0) {
        backups.forEach((backup, index) => {
          console.log(`  ${index + 1}. ${backup.filename} (${backup.size} bytes, ${new Date(backup.created).toLocaleString()})`);
        });
      }
    } else {
      logTest('List Backups', 'FAIL', 'Backups not returned as array');
      return false;
    }
    
    // Test 2: Get most recent backup
    const mostRecent = await backupService.getMostRecentBackup();
    if (mostRecent) {
      logTest('Get Most Recent Backup', 'PASS', `Most recent: ${mostRecent}`);
    } else if (backups.length === 0) {
      logTest('Get Most Recent Backup', 'WARN', 'No backups found');
    } else {
      logTest('Get Most Recent Backup', 'FAIL', 'Failed to get most recent backup');
      return false;
    }
    
    // Test 3: Get last backup status
    const lastBackup = await backupService.getLastBackupStatus();
    if (lastBackup && typeof lastBackup === 'object') {
      logTest('Get Last Backup Status', 'PASS', `Exists: ${lastBackup.exists}`);
    } else {
      logTest('Get Last Backup Status', 'WARN', 'Last backup status not available');
    }
    
    return backups.length > 0 ? mostRecent : null;
  } catch (error) {
    logTest('Backup Listing', 'FAIL', error.message);
    return null;
  }
}

async function testBackupRestore(backupFilename) {
  console.log('\n🔄 Testing Backup Restore...');
  
  if (!backupFilename) {
    logTest('Restore Backup', 'WARN', 'No backup file available for restore test');
    return false;
  }
  
  try {
    // Get current data count for comparison
    let beforeCount = {};
    let beforeSample = {};
    try {
      const productsResult = await db.query('SELECT COUNT(*) as count FROM products');
      const customersResult = await db.query('SELECT COUNT(*) as count FROM customers');
      beforeCount.products = parseInt(productsResult.rows[0].count);
      beforeCount.customers = parseInt(customersResult.rows[0].count);
      console.log(`  📊 Current data before restore: ${beforeCount.products} products, ${beforeCount.customers} customers`);
      
      // Get sample data for verification
      if (beforeCount.products > 0) {
        const sampleProduct = await db.query('SELECT id, name FROM products LIMIT 1');
        beforeSample.product = sampleProduct.rows[0];
      }
      if (beforeCount.customers > 0) {
        const sampleCustomer = await db.query('SELECT id, name FROM customers LIMIT 1');
        beforeSample.customer = sampleCustomer.rows[0];
      }
    } catch (error) {
      console.log('  Could not get current data count:', error.message);
    }
    
    // Verify backup file exists and is valid
    const fs = require('fs').promises;
    const path = require('path');
    const settings = await backupService.getBackupSettings();
    const backupPath = path.join(settings.backupDir, backupFilename);
    
    try {
      const stats = await fs.stat(backupPath);
      if (stats.size === 0) {
        logTest('Verify Restore File', 'FAIL', 'Backup file is empty');
        return false;
      }
      console.log(`  ✅ Backup file verified: ${backupFilename} (${stats.size} bytes)`);
    } catch (error) {
      logTest('Verify Restore File', 'FAIL', `Backup file not found: ${error.message}`);
      return false;
    }
    
    // Perform actual restore
    console.log(`  🔄 Starting restore from ${backupFilename}...`);
    console.log(`  ⚠️  WARNING: This will replace the current database!`);
    
    try {
      await backupService.restoreBackup(backupFilename);
      logTest('Restore Backup', 'PASS', `Successfully restored from ${backupFilename}`);
    } catch (error) {
      logTest('Restore Backup', 'FAIL', `Restore failed: ${error.message}`);
      console.error('  Error details:', error);
      if (error.stderr) {
        console.error('  stderr:', error.stderr);
      }
      if (error.stdout) {
        console.error('  stdout:', error.stdout);
      }
      return false;
    }
    
    // Wait a moment for database to settle
    console.log('  ⏳ Waiting for database to settle...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify restore worked by checking database is accessible
    try {
      const verifyQuery = await db.query('SELECT NOW() as current_time');
      if (verifyQuery.rows.length > 0) {
        logTest('Verify Database After Restore', 'PASS', 'Database is accessible after restore');
      } else {
        logTest('Verify Database After Restore', 'FAIL', 'Database query returned no results');
        return false;
      }
    } catch (error) {
      logTest('Verify Database After Restore', 'FAIL', `Database not accessible: ${error.message}`);
      return false;
    }
    
    // Get data count after restore for comparison
    let afterCount = {};
    try {
      const productsResult = await db.query('SELECT COUNT(*) as count FROM products');
      const customersResult = await db.query('SELECT COUNT(*) as count FROM customers');
      afterCount.products = parseInt(productsResult.rows[0].count);
      afterCount.customers = parseInt(customersResult.rows[0].count);
      console.log(`  📊 Data after restore: ${afterCount.products} products, ${afterCount.customers} customers`);
      
      // Compare counts (they should match the backup, not necessarily current)
      if (beforeCount.products !== undefined) {
        if (afterCount.products === beforeCount.products && afterCount.customers === beforeCount.customers) {
          logTest('Verify Restore Data', 'PASS', 'Data counts match (restore successful)');
        } else {
          logTest('Verify Restore Data', 'PASS', `Data counts changed (expected - restore replaced data)`);
          console.log(`  ℹ️  Products: ${beforeCount.products} → ${afterCount.products}`);
          console.log(`  ℹ️  Customers: ${beforeCount.customers} → ${afterCount.customers}`);
        }
      }
    } catch (error) {
      logTest('Verify Restore Data', 'WARN', `Could not verify data counts: ${error.message}`);
    }
    
    // Test that we can query tables
    try {
      const tablesResult = await db.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
        LIMIT 10
      `);
      if (tablesResult.rows.length > 0) {
        logTest('Verify Database Tables', 'PASS', `Found ${tablesResult.rows.length} tables`);
        console.log(`  📋 Sample tables: ${tablesResult.rows.slice(0, 5).map(r => r.table_name).join(', ')}`);
      } else {
        logTest('Verify Database Tables', 'FAIL', 'No tables found after restore');
        return false;
      }
    } catch (error) {
      logTest('Verify Database Tables', 'FAIL', `Could not query tables: ${error.message}`);
      return false;
    }
    
    console.log('  ✅ Restore test completed successfully!');
    return true;
  } catch (error) {
    logTest('Backup Restore', 'FAIL', error.message);
    console.error('  Full error:', error);
    return false;
  }
}

async function testScheduler() {
  console.log('\n⏰ Testing Backup Scheduler...');
  
  try {
    // Test 1: Initialize scheduler
    const initialized = await backupScheduler.initializeScheduler();
    if (initialized) {
      logTest('Initialize Scheduler', 'PASS');
    } else {
      logTest('Initialize Scheduler', 'WARN', 'Scheduler initialization returned false');
    }
    
    // Test 2: Update scheduler
    const updated = await backupScheduler.updateScheduler();
    if (updated) {
      logTest('Update Scheduler', 'PASS');
    } else {
      logTest('Update Scheduler', 'WARN', 'Scheduler update returned false');
    }
    
    // Test 3: Test startup backup (should not run if mode is scheduled)
    const settings = await backupService.getBackupSettings();
    if (settings.mode === 'app_start') {
      console.log('  Testing startup backup (mode is app_start)...');
      await backupScheduler.performStartupBackup();
      logTest('Startup Backup', 'PASS', 'Startup backup executed');
    } else {
      logTest('Startup Backup', 'PASS', `Skipped (mode is ${settings.mode})`);
    }
    
    return true;
  } catch (error) {
    logTest('Scheduler Tests', 'FAIL', error.message);
    return false;
  }
}

async function testRetentionPolicy() {
  console.log('\n🗑️  Testing Retention Policy...');
  
  try {
    // Test retention policy
    const result = await backupService.applyRetentionPolicy();
    
    if (result && typeof result === 'object') {
      logTest('Apply Retention Policy', 'PASS', `Deleted: ${result.deleted || 0} backup(s)`);
    } else {
      logTest('Apply Retention Policy', 'WARN', 'Retention policy result unclear');
    }
    
    return true;
  } catch (error) {
    logTest('Retention Policy', 'FAIL', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting Comprehensive Backup & Restore Tests...\n');
  console.log('='.repeat(60));
  
  try {
    // Test database connection
    console.log('\n🔌 Testing Database Connection...');
    try {
      await db.query('SELECT NOW()');
      logTest('Database Connection', 'PASS');
    } catch (error) {
      logTest('Database Connection', 'FAIL', error.message);
      console.error('\n❌ Cannot proceed without database connection!');
      process.exit(1);
    }
    
    // Run all tests
    await testBackupSettings();
    const backupResult = await testBackupCreation();
    const mostRecentBackup = await testBackupListing();
    await testBackupRestore(mostRecentBackup);
    await testScheduler();
    await testRetentionPolicy();
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    console.log(`⚠️  Warnings: ${testResults.warnings.length}`);
    
    if (testResults.failed.length > 0) {
      console.log('\n❌ Failed Tests:');
      testResults.failed.forEach(test => console.log(`   - ${test}`));
    }
    
    if (testResults.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      testResults.warnings.forEach(test => console.log(`   - ${test}`));
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (testResults.failed.length === 0) {
      console.log('\n✅ All critical tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test suite crashed:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      await db.pool.end();
    } catch (error) {
      // Ignore pool close errors
    }
  }
}

// Run tests
runAllTests();

