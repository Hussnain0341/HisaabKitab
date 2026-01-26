const licenseStorage = require('../utils/licenseStorage');
const deviceFingerprint = require('../utils/deviceFingerprint');

// CRITICAL: Cache license checks to avoid excessive database queries
// Cache expires after 5 minutes or on next request after expiry
const licenseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Throttle license validity checks to prevent excessive queries
const validityCheckCache = new Map();
const VALIDITY_CHECK_THROTTLE_MS = 60000; // 1 minute - only check validity once per minute per device

/**
 * Get cached license or fetch from database
 */
async function getCachedLicense(deviceId) {
  const cacheKey = deviceId;
  const cached = licenseCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.license;
  }
  
  // Fetch fresh license
  const license = await licenseStorage.getLicense(deviceId);
  
  // Cache it
  licenseCache.set(cacheKey, {
    license,
    timestamp: Date.now()
  });
  
  return license;
}

/**
 * Clear license cache for a device (call after activation/deactivation)
 */
function clearLicenseCache(deviceId) {
  licenseCache.delete(deviceId);
  console.log(`[License Middleware] Cache cleared for device: ${deviceId}`);
}

/**
 * Clear all license cache (useful when server reports changes)
 */
function clearAllLicenseCache() {
  licenseCache.clear();
  console.log('[License Middleware] All license cache cleared');
}

/**
 * Middleware to check license validity
 * For one-time activation model: Allow API calls, but attach license info for frontend to handle blocking
 * Only block if license is explicitly revoked (not just unactivated)
 * CRITICAL: Uses caching to avoid excessive database queries
 */
async function checkLicense(req, res, next) {
  // Skip license check for health, license, setup, and auth endpoints
  // CRITICAL: Skip auth endpoints to prevent login loop
  if (
    req.path === '/api/health' || 
    req.path.startsWith('/api/license') || 
    req.path.startsWith('/api/setup') ||
    req.path.startsWith('/api/auth')
  ) {
    return next();
  }

  const deviceId = req.headers['x-device-id'] || deviceFingerprint.getDeviceId();
  
  try {
    // Get license from cache (reduces database queries)
    const license = await getCachedLicense(deviceId);
    
    if (!license) {
      // No license found - allow request but attach info for frontend
      req.license = null;
      req.licenseState = 'UNACTIVATED';
      return next();
    }

    // Check if license is explicitly revoked (is_active = false)
    if (license.is_active === false) {
      req.license = license;
      req.licenseState = 'REVOKED';
      // Still allow request - frontend will handle blocking operations
      return next();
    }

    // Check if license is valid (throttled to prevent excessive queries)
    let isValid = false;
    try {
      // Throttle validity checks - only check once per minute per device
      const validityCacheKey = deviceId;
      const lastValidityCheck = validityCheckCache.get(validityCacheKey);
      const now = Date.now();
      
      if (lastValidityCheck && (now - lastValidityCheck.timestamp) < VALIDITY_CHECK_THROTTLE_MS) {
        // Use cached validity result
        isValid = lastValidityCheck.isValid;
        console.log('[License Middleware] Using cached validity result:', {
          deviceId: deviceId.substring(0, 16) + '...',
          isValid: isValid,
          cached: true
        });
      } else {
        // Check validity (will be cached)
        isValid = await licenseStorage.isLicenseValid(deviceId);
        validityCheckCache.set(validityCacheKey, { isValid, timestamp: now });
        console.log('[License Middleware] License validity check result:', {
          deviceId: deviceId.substring(0, 16) + '...',
          isValid: isValid,
          licenseId: license.license_id?.substring(0, 8) + '...',
          isActive: license.is_active,
          status: license.status
        });
      }
    } catch (validError) {
      console.error('[License Middleware] Error checking validity:', validError.message);
      // If validation check fails, assume invalid but still allow request
      isValid = false;
    }
    
    if (isValid) {
      // License is valid - attach to request
      req.license = license;
      req.licenseState = 'ACTIVATED';
      
      console.log('[License Middleware] ✅ License is ACTIVATED:', {
        deviceId: deviceId.substring(0, 16) + '...',
        licenseId: license.license_id?.substring(0, 8) + '...',
        isActive: license.is_active,
        isValid: isValid,
        state: 'ACTIVATED'
      });
      
      // Update last validation timestamp (throttled - not on every request)
      try {
        const lastValidated = new Date(license.last_validated_at);
        const hoursSinceValidation = (Date.now() - lastValidated.getTime()) / (1000 * 60 * 60);
        if (hoursSinceValidation >= 1) {
          await licenseStorage.updateLastValidation(deviceId);
        }
      } catch (updateError) {
        // Ignore update errors - not critical
        console.error('[License Middleware] Error updating validation:', updateError.message);
      }
    } else {
      // License exists but is invalid/expired - still allow request
      req.license = license;
      req.licenseState = license.expires_at ? 'TRIAL' : 'UNACTIVATED';
      
      console.log('[License Middleware] ⚠️ License is NOT activated:', {
        deviceId: deviceId.substring(0, 16) + '...',
        licenseId: license.license_id?.substring(0, 8) + '...',
        isActive: license.is_active,
        isValid: isValid,
        status: license.status,
        expiresAt: license.expires_at,
        state: req.licenseState
      });
    }
    
    // Always call next() - never block requests
    return next();
  } catch (error) {
    console.error('[License Middleware] Error in license check:', error.message || error);
    
    // If it's a table error, return setup required
    if (error.code === '42P01') {
      return res.status(503).json({
        error: 'Database setup required',
        message: 'License system tables are missing. Please run database setup first.',
        requiresSetup: true,
        code: 'DATABASE_SETUP_REQUIRED'
      });
    }
    
    // For any other error, allow request but mark as unactivated
    req.license = null;
    req.licenseState = 'UNACTIVATED';
    // Always call next() - never block
    return next();
  }
}

/**
 * Middleware to check specific feature
 * Note: This should be used AFTER checkLicense middleware
 */
function checkFeature(featureName) {
  return async (req, res, next) => {
    try {
      // Defensive check - license should be set by checkLicense middleware
      if (!req.license) {
        // If license check was bypassed somehow, fail closed
        return res.status(403).json({
          error: 'License not found',
          message: 'License information not available. Please activate your license.',
          code: 'LICENSE_NOT_FOUND',
          requiresActivation: true
        });
      }

      const features = req.license.features || {};
      
      // Check if feature is enabled (default to false if not specified)
      if (features[featureName] !== true) {
        const deviceId = req.license.device_id || req.headers['x-device-id'] || 'unknown';
        
        await licenseStorage.logLicenseAction(
          null,
          deviceId,
          'feature_blocked',
          'failed',
          `Feature '${featureName}' is not enabled in license`
        );

        return res.status(403).json({
          error: 'Feature not available',
          message: `The feature '${featureName}' is not enabled in your license. Please contact HisaabKitab support to upgrade.`,
          code: 'FEATURE_DISABLED',
          feature: featureName
        });
      }

      next();
    } catch (error) {
      console.error('Feature check error:', error);
      return res.status(500).json({
        error: 'Feature check error',
        message: 'Unable to verify feature availability',
        code: 'FEATURE_CHECK_ERROR'
      });
    }
  };
}

/**
 * Middleware to check user limit
 */
async function checkUserLimit(req, res, next) {
  try {
    if (!req.license) {
      return next(); // Let license check handle this
    }

    // For now, we don't have a user system, so we'll skip this
    // But we'll prepare the structure for when users are added
    // TODO: Implement user count check when user system is added
    
    next();
  } catch (error) {
    console.error('User limit check error:', error);
    return res.status(500).json({
      error: 'User limit check error',
      message: 'Unable to verify user limit',
      code: 'USER_LIMIT_CHECK_ERROR'
    });
  }
}

/**
 * Middleware to enforce read-only mode for write operations
 * NOTE: Frontend button disabling is sufficient - backend does NOT block operations
 * This middleware only logs license state for debugging purposes
 * All operations are allowed through regardless of license state
 */
function checkWriteOperations(req, res, next) {
  // Only check write operations (POST, PUT, DELETE, PATCH)
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next(); // Read operations always allowed
  }

  // Skip for license, setup, and settings endpoints (they handle their own checks or must always be accessible)
  if (
    req.path.startsWith('/api/license') || 
    req.path.startsWith('/api/setup') ||
    req.path.startsWith('/api/settings')
  ) {
    return next();
  }

  // Check license state from checkLicense middleware (for logging only)
  const licenseState = req.licenseState || 'UNACTIVATED';
  
  console.log('[License Middleware] Write operation:', {
    path: req.path,
    method: req.method,
    licenseState: licenseState,
    hasLicense: !!req.license,
    licenseIsActive: req.license?.is_active,
    // NOTE: All operations are allowed - frontend handles disabling
    action: 'ALLOWED'
  });
  
  // CRITICAL: Always allow write operations - frontend button disabling is sufficient
  // No backend blocking - user experience is better this way
  next();
}

module.exports = {
  checkLicense,
  checkFeature,
  checkUserLimit,
  checkWriteOperations,
  clearLicenseCache,
  clearAllLicenseCache
};

