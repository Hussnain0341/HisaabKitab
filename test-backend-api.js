/**
 * End-to-End License Validation Test
 * Tests the full flow: Frontend -> Backend -> External API
 */

const axios = require('axios');
const os = require('os');
const crypto = require('crypto');

// Configuration
const BACKEND_URL = 'http://localhost:5000';
const LICENSE_KEY = 'HK-XW7O-WU58-N1DM';

// Generate device ID (same as backend)
function getDeviceId() {
  const components = [
    os.hostname(),
    os.platform(),
    os.arch(),
    os.totalmem().toString(),
    os.cpus().length.toString(),
  ].filter(Boolean);

  const fingerprintString = components.join('|');
  const hash = crypto.createHash('sha256');
  hash.update(fingerprintString);
  const fingerprint = hash.digest('hex');
  return fingerprint.substring(0, 16);
}

async function testBackendAPI() {
  console.log('='.repeat(60));
  console.log('BACKEND API TEST (via localhost:5000)');
  console.log('='.repeat(60));
  
  const deviceId = getDeviceId();
  const appVersion = '1.0.0';
  
  console.log('\n📋 Test Parameters:');
  console.log(`   License Key: ${LICENSE_KEY}`);
  console.log(`   Device ID: ${deviceId}`);
  console.log(`   App Version: ${appVersion}`);
  console.log(`   Backend URL: ${BACKEND_URL}/api/license/validate`);
  
  const requestBody = {
    licenseKey: LICENSE_KEY.trim(),
    deviceId: deviceId,
    appVersion: appVersion
  };
  
  console.log('\n📤 Request Body:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  console.log('\n📡 Sending request to backend...\n');
  
  try {
    const response = await axios.post(`${BACKEND_URL}/api/license/validate`, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 25000
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('\n📦 Response Body:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.valid) {
      console.log('\n✅ SUCCESS: License validation succeeded!');
      if (response.data.license) {
        console.log(`   License ID: ${response.data.license.licenseId}`);
        console.log(`   Tenant Name: ${response.data.license.tenantName || 'N/A'}`);
        console.log(`   Expires At: ${response.data.license.expiresAt || 'N/A'}`);
        console.log(`   Max Devices: ${response.data.license.maxDevices || 'N/A'}`);
        console.log(`   Max Users: ${response.data.license.maxUsers || 'N/A'}`);
      }
    } else {
      console.log('\n❌ FAILED: License validation failed');
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      console.log(`   Reason: ${response.data.reason || 'N/A'}`);
      console.log(`   Code: ${response.data.code || 'N/A'}`);
      if (response.data.details) {
        console.log('   Details:', JSON.stringify(response.data.details, null, 2));
      }
    }
    
  } catch (error) {
    console.log('\n❌ ERROR: Request failed');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Status Text: ${error.response.statusText}`);
      console.log('   Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('   No response received - Is backend running?');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
    } else {
      console.log('   Error:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run the test
testBackendAPI().catch(console.error);






