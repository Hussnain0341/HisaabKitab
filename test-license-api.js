/**
 * License API Test Script
 * Tests the license validation API directly to identify issues
 */

const axios = require('axios');
const os = require('os');
const crypto = require('crypto');

// Test configuration
const LICENSE_KEY = 'HK-XW7O-WU58-N1DM';
const API_URL = 'https://api.zentryasolutions.com/api/license/validate';

// Generate device ID (same logic as backend)
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

async function testLicenseValidation() {
  console.log('='.repeat(60));
  console.log('LICENSE API TEST');
  console.log('='.repeat(60));
  
  const deviceId = getDeviceId();
  const appVersion = '1.0.0';
  
  console.log('\n📋 Test Parameters:');
  console.log(`   License Key: ${LICENSE_KEY}`);
  console.log(`   Device ID: ${deviceId}`);
  console.log(`   App Version: ${appVersion}`);
  console.log(`   API URL: ${API_URL}`);
  
  const requestBody = {
    licenseKey: LICENSE_KEY.trim(),
    deviceId: deviceId,
    appVersion: appVersion
  };
  
  console.log('\n📤 Request Body:');
  console.log(JSON.stringify(requestBody, null, 2));
  
  console.log('\n📡 Sending request...\n');
  
  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 20000
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📥 Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('\n📦 Response Body:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.valid) {
      console.log('\n✅ SUCCESS: License is valid!');
      console.log(`   License ID: ${response.data.licenseId}`);
      console.log(`   Tenant Name: ${response.data.tenantName}`);
      console.log(`   Expiry Date: ${response.data.expiryDate}`);
      console.log(`   Max Devices: ${response.data.maxDevices}`);
      console.log(`   Max Users: ${response.data.maxUsers}`);
    } else {
      console.log('\n❌ FAILED: License validation failed');
      console.log(`   Reason: ${response.data.reason || response.data.error || 'Unknown error'}`);
      console.log(`   Code: ${response.data.code || 'N/A'}`);
    }
    
  } catch (error) {
    console.log('\n❌ ERROR: Request failed');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Status Text: ${error.response.statusText}`);
      console.log('   Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('   No response received');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
    } else {
      console.log('   Error:', error.message);
    }
    
    console.log('\n🔍 Full Error Details:');
    console.log(error);
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run the test
testLicenseValidation().catch(console.error);






