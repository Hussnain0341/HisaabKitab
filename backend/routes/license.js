const express = require('express');
const router = express.Router();
const axios = require('axios');
const licenseStorage = require('../utils/licenseStorage');
const deviceFingerprint = require('../utils/deviceFingerprint');
const { clearLicenseCache, clearAllLicenseCache } = require('../middleware/licenseMiddleware');
const db = require('../db');

// Get license server URL from environment
// API Endpoint: https://api.zentryasolutions.com/api/license/validate
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'https://api.zentryasolutions.com';
const LICENSE_API_KEY = process.env.LICENSE_API_KEY || '';

// Exact API endpoint URL
const LICENSE_VALIDATE_URL = `${LICENSE_SERVER_URL}/api/license/validate`;

// Verify URL is correct
if (LICENSE_VALIDATE_URL !== 'https://api.zentryasolutions.com/api/license/validate') {
  console.warn('[License Route] WARNING: License URL does not match expected:', LICENSE_VALIDATE_URL);
  console.warn('[License Route] Expected: https://api.zentryasolutions.com/api/license/validate');
}

console.log('[License Route] License routes loaded');
console.log('[License Route] License server URL:', LICENSE_SERVER_URL);
console.log('[License Route] License validate URL:', LICENSE_VALIDATE_URL);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  console.log('[License] TEST endpoint called');
  res.json({ 
    message: 'License route is working',
    timestamp: new Date().toISOString()
  });
});

/**
 * Validate license with external server
 */
router.post('/validate', async (req, res) => {
  // CRITICAL: This log should appear IMMEDIATELY when endpoint is called
  console.log('\n');
  console.log('========================================');
  console.log('[License] ===== VALIDATION REQUEST RECEIVED =====');
  console.log('[License] Timestamp:', new Date().toISOString());
  console.log('========================================\n');
  
  try {
    console.log('[License] Request body received:', JSON.stringify({
      licenseKey: req.body.licenseKey ? req.body.licenseKey.substring(0, 8) + '...' : 'MISSING',
      deviceId: req.body.deviceId ? req.body.deviceId.substring(0, 8) + '...' : 'MISSING',
      appVersion: req.body.appVersion || 'MISSING'
    }, null, 2));

    const { licenseKey, deviceId, appVersion } = req.body;

    if (!licenseKey || !licenseKey.trim()) {
      console.error('[License] ERROR: License key is missing');
      return res.status(400).json({
        valid: false,
        error: 'License key is required',
        code: 'MISSING_LICENSE_KEY'
      });
    }

    // Use deviceId from request, or generate one (matching test script logic)
    let deviceIdToUse = deviceId;
    if (!deviceIdToUse) {
      // Generate device ID exactly like test script
      const os = require('os');
      const crypto = require('crypto');
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
      deviceIdToUse = fingerprint.substring(0, 16);
    }
    
    const fingerprint = deviceFingerprint.generateDeviceFingerprint();
    const version = appVersion || process.env.APP_VERSION || '1.0.0';

    console.log('[License] Processing validation:', {
      licenseKeyPrefix: licenseKey.trim().substring(0, 8) + '...',
      deviceId: deviceIdToUse.substring(0, 16) + '...',
      deviceIdFull: deviceIdToUse, // Log full deviceId for debugging
      appVersion: version,
      deviceIdType: typeof deviceIdToUse,
      licenseKeyType: typeof licenseKey,
      deviceIdFromRequest: !!deviceId
    });

    // Call external license validation API - EXACTLY like test script
    let validationResponse;
    try {
      // Match test script exactly - no String() conversion, just trim licenseKey
      const requestPayload = {
        licenseKey: licenseKey.trim(),
        deviceId: deviceIdToUse,
        appVersion: version
      };
      
      console.log('[License] Calling external API:', {
        url: LICENSE_VALIDATE_URL,
        payload: {
          licenseKey: requestPayload.licenseKey,
          deviceId: requestPayload.deviceId,
          appVersion: requestPayload.appVersion
        }
      });

      // Call API EXACTLY like test script
      const response = await axios.post(
        LICENSE_VALIDATE_URL,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      validationResponse = response.data;
      
      console.log('[License] External API Response:', {
        valid: validationResponse.valid,
        hasLicenseId: !!validationResponse.licenseId,
        reason: validationResponse.reason || 'N/A',
        tenantName: validationResponse.tenantName || 'N/A'
      });
    } catch (apiError) {
      console.error('[License] External API Error:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.response?.status,
        responseData: apiError.response?.data
      });

      // Handle API errors
      if (apiError.response) {
        const status = apiError.response.status;
        const data = apiError.response.data;

        return res.status(200).json({
          valid: false,
          error: data.reason || data.message || 'License validation failed',
          reason: data.reason || data.message || 'License validation failed',
          code: data.code || 'VALIDATION_ERROR',
          details: data
        });
      } else if (apiError.code === 'ECONNREFUSED' || apiError.code === 'ETIMEDOUT' || apiError.code === 'ENOTFOUND') {
        // Network error
        return res.status(200).json({
          valid: false,
          error: 'Cannot connect to license server. Internet connection required for activation.',
          reason: 'Cannot connect to license server. Internet connection required for activation.',
          code: 'NETWORK_ERROR',
          requiresInternet: true
        });
      } else {
        throw apiError;
      }
    }

    // Process validation response
    if (!validationResponse.valid) {
      const errorMessage = validationResponse.reason || validationResponse.error || 'License is invalid';
      const errorCode = validationResponse.code || 'INVALID_LICENSE';
      
      console.error('[License] Validation FAILED:', {
        reason: errorMessage,
        code: errorCode
      });

      return res.status(200).json({
        valid: false,
        error: errorMessage,
        reason: errorMessage,
        code: errorCode,
        details: validationResponse
      });
    }

    // License is valid - store it
    console.log('[License] License is VALID, storing...');
    
    const licenseData = {
      licenseId: validationResponse.licenseId,
      tenantId: validationResponse.tenantName || validationResponse.tenantId,
      licenseKey: licenseKey.trim(), // No String() conversion - match test script
      deviceId: deviceIdToUse, // Use as-is - match test script
      deviceFingerprint: fingerprint,
      expiresAt: validationResponse.expiryDate ? new Date(validationResponse.expiryDate).toISOString() : null,
      features: validationResponse.features || {},
      maxUsers: validationResponse.maxUsers || 1,
      maxDevices: validationResponse.maxDevices || 1,
      appVersion: version
    };

    // CRITICAL: Handle write failures gracefully
    try {
      await licenseStorage.storeLicense(licenseData);
      console.log('[License] License stored successfully');
      
      // CRITICAL: Clear cache so middleware picks up new license immediately
      clearLicenseCache(deviceIdToUse);
      
      // Also clear all cache to ensure consistency
      clearAllLicenseCache();
      clearStatusCache(deviceIdToUse);
    } catch (storeError) {
      // CRITICAL: If write fails, don't mark activation as complete
      console.error('[License] Failed to store license:', storeError);
      return res.status(500).json({
        valid: false,
        error: 'Activation could not be saved. Please retry.',
        reason: storeError.message || 'Database write failed. Please check database connection and retry activation.',
        code: 'STORAGE_ERROR',
        requiresRetry: true
      });
    }

    res.json({
      valid: true,
      license: {
        licenseId: licenseData.licenseId,
        tenantId: licenseData.tenantId,
        tenantName: validationResponse.tenantName,
        expiresAt: licenseData.expiresAt,
        expiryDate: validationResponse.expiryDate,
        features: licenseData.features,
        maxUsers: licenseData.maxUsers,
        maxDevices: licenseData.maxDevices
      }
    });
  } catch (error) {
    console.error('[License] UNEXPECTED ERROR:', error);
    console.error('[License] Error stack:', error.stack);
    
    res.status(500).json({
      valid: false,
      error: 'Internal server error during license validation',
      reason: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Cache for status endpoint to prevent excessive calls
const statusCache = new Map();
const STATUS_CACHE_TTL = 5000; // 5 seconds - cache status for 5 seconds

// Function to clear status cache
function clearStatusCache(deviceId = null) {
  if (deviceId) {
    statusCache.delete(deviceId);
  } else {
    statusCache.clear();
  }
}

/**
 * Get current license status
 * CRITICAL: Loads LOCAL license first (source of truth)
 * CRITICAL: If device ID changed (cache cleared), tries to find license by other means
 * Server validation is optional and advisory only
 * CRITICAL: Cached to prevent excessive calls
 */
router.get('/status', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || deviceFingerprint.getDeviceId();
    
    // Check cache first
    const cacheKey = deviceId;
    const cached = statusCache.get(cacheKey);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < STATUS_CACHE_TTL) {
      // Return cached result
      return res.json(cached.data);
    }
    
    // Only log if not using cache (reduce console spam)
    // console.log('[License] Status check - device ID:', deviceId.substring(0, 16) + '...');
    
    // STEP 1: Load LOCAL license (source of truth)
    let license = await licenseStorage.getLicense(deviceId);
    
    // STEP 2: If no license found for this device ID, try to find any active license
    // This handles the case where browser cache was cleared and device ID changed
    if (!license) {
      console.log('[License] No license found for device ID, checking for any active licenses...');
      
      try {
        // Check if there's only one active license in the database
        // If so, it's likely for this installation (single-user system)
        const allLicensesResult = await db.query(
          `SELECT * FROM license_info 
           WHERE is_active = true 
           AND (status IS NULL OR status != 'revoked')
           ORDER BY updated_at DESC, activated_at DESC
           LIMIT 1`
        );
        
        if (allLicensesResult.rows.length > 0) {
          const foundLicense = allLicensesResult.rows[0];
          console.log('[License] Found active license with different device ID, updating device_id...');
          console.log('[License] Old device_id:', foundLicense.device_id?.substring(0, 16) + '...');
          console.log('[License] New device_id:', deviceId.substring(0, 16) + '...');
          
          // Update the device_id to match the current one
          await db.query(
            'UPDATE license_info SET device_id = $1 WHERE id = $2',
            [deviceId, foundLicense.id]
          );
          
          // Clear cache
          clearLicenseCache(foundLicense.device_id);
          clearLicenseCache(deviceId);
          clearStatusCache(foundLicense.device_id);
          clearStatusCache(deviceId);
          
          // Now get the license with the updated device_id
          license = await licenseStorage.getLicense(deviceId);
          console.log('[License] License device_id updated successfully');
        }
      } catch (recoveryError) {
        console.error('[License] Error recovering license after device ID change:', recoveryError);
        // Continue with null license - will return unactivated state
      }
    }
    
    if (!license) {
      // console.log('[License] No license found - returning unactivated state');
      const responseData = {
        activated: false,
        valid: false,
        state: 'UNACTIVATED',
        message: 'No license found. Please activate your license.'
      };
      
      // Cache the response
      statusCache.set(cacheKey, {
        data: responseData,
        timestamp: now
      });
      
      return res.json(responseData);
    }

    // STEP 3: Check LOCAL validity (never trust server blindly)
    const isValid = await licenseStorage.isLicenseValid(deviceId);
    const expiresAt = license.expires_at ? new Date(license.expires_at) : null;
    const isExpired = expiresAt && expiresAt < new Date();

    // Determine license state from LOCAL data
    let state = 'UNACTIVATED';
    if (isValid && license.is_active) {
      state = 'ACTIVATED'; // Lifetime activation
    } else if (license.is_active === false) {
      state = 'REVOKED';
    } else if (isExpired) {
      state = 'UNACTIVATED'; // Expired locally
    }

    // Only log if not using cache (reduce console spam)
    // console.log('[License] License status:', {
    //   state,
    //   isValid,
    //   isActive: license.is_active,
    //   isExpired
    // });

    // Prepare response data
    const responseData = {
      activated: isValid && license.is_active,
      valid: isValid,
      expired: isExpired,
      state: state,
      license: {
        licenseId: license.license_id,
        tenantId: license.tenant_id,
        expiresAt: license.expires_at,
        features: license.features,
        maxUsers: license.max_users,
        lastValidated: license.last_validated_at
      }
    };

    // Cache the response
    statusCache.set(cacheKey, {
      data: responseData,
      timestamp: now
    });

    // Return LOCAL status (server validation happens separately, non-blocking)
    res.json(responseData);
  } catch (error) {
    console.error('[License] Error getting license status:', error);
    console.error('[License] Error stack:', error.stack);
    // Fail-safe: Return unactivated state, never crash
    res.json({
      activated: false,
      valid: false,
      state: 'UNACTIVATED',
      error: 'Error checking license status'
    });
  }
});

/**
 * Revalidate license (ADVISORY ONLY - Non-blocking, Frequency Limited)
 * CRITICAL: Server validation is advisory - never blocks or downgrades local license
 * CRITICAL: Max once per 24 hours to avoid rate limiting
 * CRITICAL: Two-step confirmation required for downgrades
 */
router.post('/revalidate', async (req, res) => {
  try {
    const deviceId = (req.headers && req.headers['x-device-id']) || deviceFingerprint.getDeviceId();
    
    console.log('[License] Revalidation check - device ID:', deviceId.substring(0, 16) + '...');
    
    // STEP 1: Load LOCAL license first (source of truth)
    let license = await licenseStorage.getLicense(deviceId);
    
    // STEP 2: If no license found for this device ID, try to find any active license
    // This handles the case where browser cache was cleared and device ID changed
    if (!license) {
      console.log('[License] No license found for device ID during revalidation, checking for any active licenses...');
      
      try {
        // Check if there's only one active license in the database
        const allLicensesResult = await db.query(
          `SELECT * FROM license_info 
           WHERE is_active = true 
           AND (status IS NULL OR status != 'revoked')
           ORDER BY updated_at DESC, activated_at DESC
           LIMIT 1`
        );
        
        if (allLicensesResult.rows.length > 0) {
          const foundLicense = allLicensesResult.rows[0];
          console.log('[License] Found active license with different device ID during revalidation, updating device_id...');
          
          // Update the device_id to match the current one
          await db.query(
            'UPDATE license_info SET device_id = $1 WHERE id = $2',
            [deviceId, foundLicense.id]
          );
          
          // Clear cache
          clearLicenseCache(foundLicense.device_id);
          clearLicenseCache(deviceId);
          
          // Now get the license with the updated device_id
          license = await licenseStorage.getLicense(deviceId);
          console.log('[License] License device_id updated successfully during revalidation');
        }
      } catch (recoveryError) {
        console.error('[License] Error recovering license during revalidation:', recoveryError);
      }
    }

    if (!license) {
      return res.json({
        valid: false,
        error: 'No license found',
        requiresActivation: true,
        state: 'UNACTIVATED'
      });
    }

    // STEP 2: Check LOCAL validity first
    const localValid = await licenseStorage.isLicenseValid(deviceId);
    
    // STEP 3: Check if server validation is needed (frequency limit)
    const shouldValidate = await licenseStorage.shouldValidateWithServer(deviceId);
    if (!shouldValidate) {
      // Skip server validation - too soon since last check
      return res.json({
        valid: localValid,
        state: localValid ? 'ACTIVATED' : 'UNACTIVATED',
        skipped: true,
        message: 'Server validation skipped (checked recently)'
      });
    }

    // STEP 4: Attempt server validation (advisory only, with strict timeout)
    let serverResponse = null;
    try {
      const licenseKey = license.license_key;
      if (!licenseKey) {
        throw new Error('License key not available');
      }

      const requestPayload = {
        licenseKey: licenseKey.trim(),
        deviceId: license.device_id || deviceId,
        appVersion: license.app_version || process.env.APP_VERSION || '1.0.0'
      };

      // Call server with strict timeout (3 seconds)
      const response = await axios.post(
        LICENSE_VALIDATE_URL,
        requestPayload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 3000 // Strict 3-second timeout
        }
      );

      serverResponse = response.data;
      
      // Update last verified timestamp on successful server call
      await licenseStorage.updateLastVerified(deviceId);
    } catch (serverError) {
      // Server error - ignore it, trust local license
      console.log('[License] Server validation failed (non-critical):', serverError.message);
      // Continue with local license
    }

    // STEP 5: Process server response (advisory only, two-step downgrade)
    if (serverResponse && serverResponse.valid) {
      // Server confirms valid - update last verified timestamp only
      await licenseStorage.updateLastValidation(deviceId);
      
      // Optionally update from server response (advisory)
      if (serverResponse.status) {
        await licenseStorage.updateLicenseStatusFromServer(deviceId, {
          status: serverResponse.status,
          expiry_date: serverResponse.expiryDate || serverResponse.expiresAt
        });
      }
    } else if (serverResponse && !serverResponse.valid) {
      // Server says invalid - use two-step downgrade protection
      const serverStatus = serverResponse.status || (serverResponse.reason || '').toLowerCase();
      
      if (serverStatus.includes('revoked') || serverResponse.code === 'REVOKED_LICENSE') {
        // CRITICAL: Revocation is applied immediately (no two-step delay)
        const applied = await licenseStorage.updateLicenseStatusFromServer(deviceId, { status: 'revoked' });
        if (applied) {
          // Revocation applied immediately - re-check validity
          const updatedValid = await licenseStorage.isLicenseValid(deviceId);
          
          // CRITICAL: Clear cache so middleware picks up revoked status immediately
          clearLicenseCache(deviceId);
          clearAllLicenseCache();
          
          return res.json({
            valid: false,
            state: 'REVOKED',
            error: 'License has been revoked by server',
            requiresActivation: true,
            serverConfirmed: true
          });
        }
      } else if (serverStatus.includes('expired') || serverResponse.code === 'EXPIRED_LICENSE') {
        // Use two-step downgrade
        const applied = await licenseStorage.updateLicenseStatusFromServer(deviceId, {
          status: 'expired',
          expiry_date: serverResponse.expiryDate || serverResponse.expiresAt
        });
        if (applied) {
          // Re-check local validity after update
          const updatedValid = await licenseStorage.isLicenseValid(deviceId);
          
          // CRITICAL: Clear cache so middleware picks up expired status immediately
          clearLicenseCache(deviceId);
          clearAllLicenseCache();
          
          return res.json({
            valid: updatedValid,
            state: updatedValid ? 'ACTIVATED' : 'UNACTIVATED',
            expired: !updatedValid
          });
        } else {
          // First notice - keep active, pending confirmation
          return res.json({
            valid: localValid,
            state: localValid ? 'ACTIVATED' : 'UNACTIVATED',
            pending: 'expired',
            message: 'Expiry notice received, pending confirmation'
          });
        }
      }
      // Otherwise, ignore server - trust local
    }

    // STEP 6: Re-check LOCAL validity after potential server updates
    // CRITICAL: Server updates may have changed license state, so re-check
    const finalValid = await licenseStorage.isLicenseValid(deviceId);
    const finalLicense = await licenseStorage.getLicense(deviceId);
    
    // Determine final state based on updated license
    let finalState = 'UNACTIVATED';
    if (finalValid && finalLicense && finalLicense.is_active) {
      finalState = 'ACTIVATED';
    } else if (finalLicense) {
      // Check status field
      if (finalLicense.status && finalLicense.status.toLowerCase() === 'revoked') {
        finalState = 'REVOKED';
      } else if (finalLicense.is_active === false) {
        finalState = 'REVOKED';
      } else if (finalLicense.expires_at && new Date(finalLicense.expires_at) < new Date()) {
        finalState = 'UNACTIVATED'; // Expired
      }
    }

    // CRITICAL: Clear cache if license was revoked/expired
    if (finalState === 'REVOKED' || (!finalValid && finalState === 'UNACTIVATED')) {
      clearLicenseCache(deviceId);
      clearAllLicenseCache();
    }

    return res.json({
      valid: finalValid,
      state: finalState,
      offline: !serverResponse, // Indicate if server was unreachable
      license: finalLicense ? {
        licenseId: finalLicense.license_id,
        tenantId: finalLicense.tenant_id,
        expiresAt: finalLicense.expires_at
      } : null
    });
  } catch (error) {
    console.error('[License] Revalidation error:', error);
    // Fail-safe: Return local status, never crash
    try {
      const deviceId = (req.headers && req.headers['x-device-id']) || deviceFingerprint.getDeviceId();
      const license = await licenseStorage.getLicense(deviceId);
      const localValid = license ? await licenseStorage.isLicenseValid(deviceId) : false;
      
      return res.json({
        valid: localValid,
        state: localValid ? 'ACTIVATED' : 'UNACTIVATED',
        offline: true,
        error: 'Revalidation check failed, using local license'
      });
    } catch (fallbackError) {
      return res.json({
        valid: false,
        state: 'UNACTIVATED',
        error: 'Unable to check license status'
      });
    }
  }
});

/**
 * Get device ID endpoint (for Electron/desktop consistency)
 * Returns the backend-generated device ID to ensure consistency
 */
router.get('/device-id', (req, res) => {
  try {
    const deviceId = deviceFingerprint.getDeviceId();
    const fingerprint = deviceFingerprint.generateDeviceFingerprint();
    
    res.json({
      deviceId: deviceId,
      deviceFingerprint: fingerprint,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[License] Error generating device ID:', error);
    res.status(500).json({
      error: 'Failed to generate device ID',
      code: 'DEVICE_ID_ERROR'
    });
  }
});

module.exports = router;


