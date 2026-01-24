/**
 * Quick Backend Test - Verify License Route
 * Run this while backend is running: node test-backend-route.js
 */

const axios = require('axios');

async function testRoute() {
  try {
    console.log('Testing /api/license/test endpoint...');
    const response = await axios.get('http://localhost:5000/api/license/test');
    console.log('✅ Route is working:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Route returned error:', error.response.status, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running on port 5000');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
  
  try {
    console.log('\nTesting /api/license/validate endpoint...');
    const response = await axios.post('http://localhost:5000/api/license/validate', {
      licenseKey: 'HK-TEST-TEST-TEST',
      deviceId: 'test-device-123',
      appVersion: '1.0.0'
    });
    console.log('✅ Validate endpoint responded:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Validate endpoint error:', error.response.status, error.response.data);
    } else {
      console.log('❌ Error:', error.message);
    }
  }
}

testRoute();






