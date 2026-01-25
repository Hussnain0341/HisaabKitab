/**
 * Test Backup API Endpoints
 * Tests all backup-related API endpoints
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/backup';

async function testAPIEndpoint(name, method, endpoint, data = null) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    let response;
    
    if (method === 'GET') {
      response = await axios.get(`${API_BASE_URL}${endpoint}`);
    } else if (method === 'POST') {
      response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    } else if (method === 'PUT') {
      response = await axios.put(`${API_BASE_URL}${endpoint}`, data);
    }
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ ${name}: PASS`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2).substring(0, 200));
      return { success: true, data: response.data };
    } else {
      console.log(`❌ ${name}: FAIL - Status ${response.status}`);
      return { success: false, error: `Status ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ ${name}: FAIL`);
    if (error.response) {
      console.log(`   Error: ${error.response.status} - ${error.response.data?.error || error.response.data?.message || error.message}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

async function runAPITests() {
  console.log('🚀 Starting Backup API Endpoint Tests...\n');
  console.log('='.repeat(60));
  
  const results = {
    passed: [],
    failed: [],
  };
  
  // Test 1: Get backup status
  const statusResult = await testAPIEndpoint('Get Backup Status', 'GET', '/status');
  if (statusResult.success) results.passed.push('Get Backup Status');
  else results.failed.push('Get Backup Status');
  
  // Test 2: List backups
  const listResult = await testAPIEndpoint('List Backups', 'GET', '/list');
  if (listResult.success) results.passed.push('List Backups');
  else results.failed.push('List Backups');
  
  // Test 3: Update backup settings
  const updateSettingsResult = await testAPIEndpoint('Update Backup Settings', 'PUT', '/settings', {
    enabled: true,
    mode: 'scheduled',
    scheduledTime: '04:00',
    retentionCount: 7,
  });
  if (updateSettingsResult.success) results.passed.push('Update Backup Settings');
  else results.failed.push('Update Backup Settings');
  
  // Test 4: Create manual backup
  console.log('\n💾 Creating manual backup (this may take a moment)...');
  const createResult = await testAPIEndpoint('Create Manual Backup', 'POST', '/create');
  if (createResult.success) {
    results.passed.push('Create Manual Backup');
    console.log(`   Backup created: ${createResult.data.filename}`);
  } else {
    results.failed.push('Create Manual Backup');
  }
  
  // Test 5: Verify backup was created
  const verifyListResult = await testAPIEndpoint('Verify Backup Created', 'GET', '/list');
  if (verifyListResult.success && verifyListResult.data.backups && verifyListResult.data.backups.length > 0) {
    results.passed.push('Verify Backup Created');
    console.log(`   Total backups: ${verifyListResult.data.backups.length}`);
  } else {
    results.failed.push('Verify Backup Created');
  }
  
  // Test 6: Get updated status
  const updatedStatusResult = await testAPIEndpoint('Get Updated Status', 'GET', '/status');
  if (updatedStatusResult.success) {
    results.passed.push('Get Updated Status');
    if (updatedStatusResult.data.lastBackup && updatedStatusResult.data.lastBackup.exists) {
      console.log(`   Last backup: ${updatedStatusResult.data.lastBackup.filename || 'N/A'}`);
    }
  } else {
    results.failed.push('Get Updated Status');
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 API Test Summary:');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ Passed Tests:');
    results.passed.forEach(test => console.log(`   - ${test}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(test => console.log(`   - ${test}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (results.failed.length === 0) {
    console.log('\n✅ All API tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some API tests failed.');
    process.exit(1);
  }
}

// Check if backend is running
axios.get('http://localhost:5000/api/health')
  .then(() => {
    console.log('✅ Backend server is running\n');
    runAPITests();
  })
  .catch((error) => {
    console.error('❌ Backend server is not running!');
    console.error('   Please start the backend server first:');
    console.error('   cd backend && npm start');
    process.exit(1);
  });

