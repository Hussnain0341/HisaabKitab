const db = require('../db');
const crypto = require('crypto');
const os = require('os');

// Encryption key (should be stored securely, not in code)
// In production, this should be derived from machine-specific data
// Key must be 32 bytes (64 hex characters) for AES-256
let ENCRYPTION_KEY = process.env.LICENSE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  // Generate key from machine-specific data
  const machineData = os.hostname() + os.platform() + os.arch();
  ENCRYPTION_KEY = crypto.createHash('sha256').update(machineData).digest('hex');
}

// Ensure key is exactly 64 hex characters (32 bytes)
if (ENCRYPTION_KEY.length !== 64) {
  // Pad or truncate to 64 characters
  ENCRYPTION_KEY = (ENCRYPTION_KEY + '0'.repeat(64)).substring(0, 64);
}

const ALGORITHM = 'aes-256-cbc';

// Validation frequency limit (24 hours)
const VALIDATION_FREQUENCY_HOURS = 24;

// License state transitions (allowed transitions)
const ALLOWED_TRANSITIONS = {
  'TRIAL': ['ACTIVATED', 'UNACTIVATED'], // trial → active, trial → expired
  'UNACTIVATED': ['ACTIVATED'], // unactivated → active (manual activation)
  'ACTIVATED': ['UNACTIVATED', 'REVOKED'], // active → expired, active → revoked
  'REVOKED': ['ACTIVATED'], // revoked → active (manual override)
  // Disallowed: revoked → expired, expired → trial, active → trial
};

/**
 * CRITICAL: Auto-fix database inconsistencies
 * This ensures revoked licenses are automatically deactivated
 * Runs automatically on every license check (non-blocking)
 * Handles missing columns gracefully (doesn't try to add them - use migration script)
 */
async function autoFixLicenseInconsistencies(deviceId = null) {
  try {
    // First, check if status column exists
    let hasStatusColumn = false;
    try {
      const columnCheck = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'status'
      `);
      hasStatusColumn = columnCheck.rows.length > 0;
    } catch (checkError) {
      // If we can't check, assume column doesn't exist
      hasStatusColumn = false;
    }
    
    if (!hasStatusColumn) {
      // Status column doesn't exist - can't fix status-based issues
      // User needs to run migration script: database/migration_add_missing_columns.sql
      console.warn('[License Storage] ⚠️ Status column missing. Please run: database/migration_add_missing_columns.sql');
      return; // Skip status-based fixes if column doesn't exist
    }

    // CRITICAL: Auto-fix revoked licenses (set is_active = false where status = 'revoked')
    // This fixes the issue where status = 'revoked' but is_active = true
    if (deviceId) {
      // Fix for specific device
      const fixResult = await db.query(`
        UPDATE license_info 
        SET is_active = false 
        WHERE device_id = $1 AND status = 'revoked' AND is_active = true
      `, [deviceId]);
      
      if (fixResult.rowCount > 0) {
        console.log(`[License Storage] ✅ Auto-fixed ${fixResult.rowCount} revoked license(s) for device ${deviceId.substring(0, 16)}...`);
      }
    } else {
      // Fix for all devices
      const fixResult = await db.query(`
        UPDATE license_info 
        SET is_active = false 
        WHERE status = 'revoked' AND is_active = true
      `);
      
      if (fixResult.rowCount > 0) {
        console.log(`[License Storage] ✅ Auto-fixed ${fixResult.rowCount} revoked license(s) globally`);
      }
    }

    // CRITICAL: Auto-fix licenses with is_active = false but status = NULL (should be 'revoked')
    if (deviceId) {
      const fixInactiveResult = await db.query(`
        UPDATE license_info 
        SET status = 'revoked' 
        WHERE device_id = $1 AND is_active = false AND (status IS NULL OR status = '')
      `, [deviceId]);
      
      if (fixInactiveResult.rowCount > 0) {
        console.log(`[License Storage] ✅ Auto-fixed ${fixInactiveResult.rowCount} inactive license(s) for device ${deviceId.substring(0, 16)}...`);
      }
    } else {
      const fixInactiveResult = await db.query(`
        UPDATE license_info 
        SET status = 'revoked' 
        WHERE is_active = false AND (status IS NULL OR status = '')
      `);
      
      if (fixInactiveResult.rowCount > 0) {
        console.log(`[License Storage] ✅ Auto-fixed ${fixInactiveResult.rowCount} inactive license(s) globally`);
      }
    }
  } catch (error) {
    // Fail-safe: Don't crash on auto-fix errors
    // Only log if it's not a permission/column error (these are expected in some setups)
    if (error.code !== '42501' && error.code !== '42703') {
      console.error('[License Storage] ⚠️ Error in auto-fix (non-critical):', error.message);
    }
  }
}

// Run global auto-fix on module load (non-blocking, once)
autoFixLicenseInconsistencies().catch(err => {
  // Ignore errors on startup - will fix on next license check
});

/**
 * Encrypt sensitive data
 */
function encrypt(text) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

/**
 * Decrypt sensitive data
 */
function decrypt(encryptedText) {
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

/**
 * Check if server validation is needed (frequency limit)
 * CRITICAL: Max once per 24 hours to avoid rate limiting and unnecessary failures
 */
async function shouldValidateWithServer(deviceId) {
  try {
    const license = await getLicense(deviceId);
    if (!license || !license.last_verified_at) {
      return true; // Never validated, allow check
    }

    const lastVerified = new Date(license.last_verified_at);
    const hoursSinceVerification = (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60);
    
    // Only validate if 24+ hours have passed
    return hoursSinceVerification >= VALIDATION_FREQUENCY_HOURS;
  } catch (error) {
    // Fail-safe: allow validation on error
    return true;
  }
}

/**
 * Store license information in database
 * CRITICAL: Ensures only ONE active license exists at any time
 * CRITICAL: Handles write failures gracefully
 */
async function storeLicense(licenseData) {
  try {
    const {
      licenseId,
      tenantId,
      licenseKey,
      deviceId,
      deviceFingerprint,
      expiresAt,
      features,
      maxUsers,
      maxDevices,
      appVersion
    } = licenseData;

    // Encrypt sensitive data
    const encryptedLicenseKey = encrypt(licenseKey);
    const encryptedFingerprint = encrypt(deviceFingerprint);

    // Store maxDevices in features JSON if provided
    const featuresToStore = { ...(features || {}) };
    if (maxDevices !== undefined) {
      featuresToStore.maxDevices = maxDevices;
    }

    // CRITICAL: Deactivate ALL other licenses for this device
    // Only ONE active license can exist at any time
    try {
      await db.query(
        'UPDATE license_info SET is_active = false WHERE device_id = $1',
        [deviceId]
      );
    } catch (deactivateError) {
      console.error('[License Storage] Error deactivating old licenses:', deactivateError);
      // Continue - don't block activation
    }

    // Check if license already exists
    const existing = await db.query(
      'SELECT id FROM license_info WHERE license_key = $1 AND device_id = $2',
      [encryptedLicenseKey, deviceId]
    );

    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (existing.rows.length > 0) {
      // Update existing license - mark as active
      try {
        await db.query(
          `UPDATE license_info 
           SET license_id = $1, tenant_id = $2, device_fingerprint = $3,
               expires_at = $4, last_validated_at = CURRENT_TIMESTAMP,
               is_active = true, features = $5, max_users = $6, max_devices = $7, app_version = $8,
               validation_count = validation_count + 1, updated_at = CURRENT_TIMESTAMP,
               activated_at = CURRENT_TIMESTAMP, last_known_valid_date = $9,
               pending_status = NULL, pending_status_count = 0
           WHERE license_key = $10 AND device_id = $11`,
          [
            licenseId,
            tenantId,
            encryptedFingerprint,
            expiresAt,
            JSON.stringify(featuresToStore),
            maxUsers || 1,
            maxDevices || 1,
            appVersion,
            currentDate,
            encryptedLicenseKey,
            deviceId
          ]
        );
      } catch (updateError) {
        console.error('[License Storage] Error updating license:', updateError);
        throw new Error('Failed to save license activation. Please retry.');
      }
    } else {
      // Insert new license - mark as active
      try {
        await db.query(
          `INSERT INTO license_info 
           (license_id, tenant_id, license_key, device_id, device_fingerprint,
            expires_at, last_validated_at, is_active, features, max_users, max_devices, app_version,
            activated_at, last_known_valid_date)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, true, $7, $8, $9, $10, CURRENT_TIMESTAMP, $11)`,
          [
            licenseId,
            tenantId,
            encryptedLicenseKey,
            deviceId,
            encryptedFingerprint,
            expiresAt,
            JSON.stringify(featuresToStore),
            maxUsers || 1,
            maxDevices || 1,
            appVersion,
            currentDate
          ]
        );
      } catch (insertError) {
        console.error('[License Storage] Error inserting license:', insertError);
        throw new Error('Failed to save license activation. Please retry.');
      }
    }

    // Log activation (non-blocking)
    try {
      await logLicenseAction(licenseKey, deviceId, 'activation', 'success', 'License activated successfully');
    } catch (logError) {
      // Ignore logging errors - don't block activation
      console.error('[License Storage] Error logging activation:', logError);
    }

    return true;
  } catch (error) {
    console.error('[License Storage] Error storing license:', error);
    // Re-throw with user-friendly message
    if (error.message.includes('Failed to save')) {
      throw error;
    }
    throw new Error('Failed to activate license. Please check database connection and retry.');
  }
}

/**
 * Get stored license information
 * CRITICAL: Returns only the MOST RECENT active license (not revoked)
 * CRITICAL: Never crashes on DB errors - returns null instead
 * CRITICAL: Excludes licenses with status = 'revoked'
 * CRITICAL: Auto-fixes inconsistencies on every call
 */
async function getLicense(deviceId) {
  try {
    // CRITICAL: Auto-fix inconsistencies before querying (non-blocking)
    // This ensures revoked licenses are always excluded
    autoFixLicenseInconsistencies(deviceId).catch(() => {
      // Ignore errors - don't block license retrieval
    });

    // Get all active licenses for this device, ordered by most recent
    // CRITICAL: Exclude licenses with status = 'revoked' even if is_active = true
    // Handle case where status column might not exist yet
    let result;
    try {
      result = await db.query(
        `SELECT * FROM license_info 
         WHERE device_id = $1 
         AND is_active = true 
         AND (status IS NULL OR status != 'revoked')
         ORDER BY updated_at DESC, activated_at DESC`,
        [deviceId]
      );
    } catch (queryError) {
      // If status column doesn't exist, fall back to query without status check
      if (queryError.code === '42703') { // Column doesn't exist
        result = await db.query(
          `SELECT * FROM license_info 
           WHERE device_id = $1 
           AND is_active = true 
           ORDER BY updated_at DESC, activated_at DESC`,
          [deviceId]
        );
      } else {
        throw queryError;
      }
    }

    if (result.rows.length === 0) {
      return null;
    }

    // CRITICAL: If multiple active licenses exist, keep only the most recent
    if (result.rows.length > 1) {
      console.warn(`[License] Multiple active licenses found for device ${deviceId}. Keeping most recent, deactivating others.`);
      
      // Keep the first (most recent) one active
      const mostRecent = result.rows[0];
      
      // Deactivate all others (non-blocking)
      try {
        const otherIds = result.rows.slice(1).map(row => row.id);
        if (otherIds.length > 0) {
          await db.query(
            `UPDATE license_info SET is_active = false WHERE id = ANY($1::int[])`,
            [otherIds]
          );
          await logLicenseAction(null, deviceId, 'cleanup', 'info', `Deactivated ${otherIds.length} duplicate active licenses`);
        }
      } catch (cleanupError) {
        // Ignore cleanup errors - don't block license retrieval
        console.error('[License Storage] Error cleaning up duplicates:', cleanupError);
      }
      
      // Return the most recent one
      const license = mostRecent;
      
      // Decrypt sensitive data
      try {
        license.license_key = decrypt(license.license_key);
        license.device_fingerprint = decrypt(license.device_fingerprint);
      } catch (decryptError) {
        console.error('Error decrypting license data:', decryptError);
        // Return license without decrypted fields if decryption fails
      }

      // Parse JSON fields
      if (license.features && typeof license.features === 'string') {
        license.features = JSON.parse(license.features);
      }

      return license;
    }

    // Single active license - process normally
    const license = result.rows[0];
    
    // Decrypt sensitive data
    try {
      license.license_key = decrypt(license.license_key);
      license.device_fingerprint = decrypt(license.device_fingerprint);
    } catch (decryptError) {
      console.error('Error decrypting license data:', decryptError);
      // Return license without decrypted fields if decryption fails
    }

    // Parse JSON fields
    if (license.features && typeof license.features === 'string') {
      license.features = JSON.parse(license.features);
    }

    return license;
  } catch (error) {
    console.error('[License Storage] Error getting license (non-critical):', error);
    // CRITICAL: Never throw - return null instead (allows app to open)
    return null;
  }
}

/**
 * Check if license is valid (LOCAL CHECK ONLY - Source of Truth)
 * CRITICAL: Includes clock tampering protection
 * CRITICAL: Checks status field for revoked/expired
 * CRITICAL: Auto-fixes inconsistencies (revoked licenses)
 * CRITICAL: Never checks grace period for activated licenses
 */
async function isLicenseValid(deviceId) {
  try {
    // CRITICAL: Auto-fix revoked licenses before checking (non-blocking)
    autoFixLicenseInconsistencies(deviceId).catch(() => {
      // Ignore errors - don't block validation
    });

    const license = await getLicense(deviceId);
    
    // No license = invalid
    if (!license) {
      return false;
    }

    // Explicitly revoked = invalid (check both is_active and status)
    if (license.is_active === false) {
      return false;
    }

    // CRITICAL: Check status field - if revoked, license is invalid
    if (license.status && license.status.toLowerCase() === 'revoked') {
      // Status says revoked - deactivate it immediately (should already be fixed, but double-check)
      try {
        await db.query(
          'UPDATE license_info SET is_active = false WHERE device_id = $1',
          [deviceId]
        );
        await logLicenseAction(license.license_key, deviceId, 'revocation_applied', 'info', 'License revoked status detected - deactivating');
      } catch (updateError) {
        console.error('[License Storage] Error deactivating revoked license:', updateError);
      }
      return false;
    }

    // Must be active
    if (!license.is_active) {
      return false;
    }

    // CRITICAL: Clock tampering protection
    // If current date < last_known_valid_date, system clock was rolled back
    if (license.last_known_valid_date) {
      const lastKnownDate = new Date(license.last_known_valid_date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate < lastKnownDate) {
        // Clock rolled back - trust license, don't downgrade
        console.warn('[License] System clock appears rolled back. Trusting license.');
        // Update last_known_valid_date to current (prevent future false positives)
        try {
          await db.query(
            'UPDATE license_info SET last_known_valid_date = CURRENT_DATE WHERE device_id = $1',
            [deviceId]
          );
        } catch (updateError) {
          // Ignore update error - not critical
        }
        return true; // Trust license despite clock rollback
      }
    }

    // For lifetime licenses (no expiry date), always valid if active
    if (!license.expires_at) {
      return true; // Lifetime license - never expires locally
    }

    // Check expiry for time-limited licenses (LOCAL CHECK ONLY)
    if (license.expires_at) {
      const expiresAt = new Date(license.expires_at);
      const now = new Date();
      if (expiresAt < now) {
        return false; // Expired locally
      }
    }

    // If we get here, license is valid locally
    return true;
  } catch (error) {
    console.error('[License Storage] Error checking license validity:', error);
    // Fail-safe: If error occurs, try to get license and trust it if active
    try {
      const license = await getLicense(deviceId);
      return license && license.is_active === true;
    } catch (fallbackError) {
      // Ultimate fail-safe: return false (will trigger activation UI)
      return false;
    }
  }
}

/**
 * Update last validation timestamp
 */
async function updateLastValidation(deviceId) {
  try {
    await db.query(
      'UPDATE license_info SET last_validated_at = CURRENT_TIMESTAMP, validation_count = validation_count + 1 WHERE device_id = $1',
      [deviceId]
    );
    return true;
  } catch (error) {
    console.error('Error updating last validation:', error);
    return false;
  }
}

/**
 * Update last verified timestamp (server verification)
 */
async function updateLastVerified(deviceId) {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    await db.query(
      `UPDATE license_info 
       SET last_verified_at = CURRENT_TIMESTAMP, 
           last_known_valid_date = $1
       WHERE device_id = $2`,
      [currentDate, deviceId]
    );
    return true;
  } catch (error) {
    console.error('Error updating last verified:', error);
    return false;
  }
}

/**
 * Deactivate license (on revocation or expiry)
 */
async function deactivateLicense(deviceId, reason = 'revoked') {
  try {
    await db.query(
      'UPDATE license_info SET is_active = false WHERE device_id = $1',
      [deviceId]
    );
    
    // Log deactivation (non-blocking)
    try {
      await logLicenseAction(null, deviceId, 'deactivation', 'success', `License deactivated: ${reason}`);
    } catch (logError) {
      // Ignore logging errors
    }
    
    return true;
  } catch (error) {
    console.error('Error deactivating license:', error);
    return false;
  }
}

/**
 * Log license action
 * CRITICAL: Never blocks, never throws, caps log size
 */
async function logLicenseAction(licenseKey, deviceId, action, status, message, errorDetails = null) {
  try {
    // Don't log the actual license key, use a hash
    const keyHash = licenseKey ? crypto.createHash('sha256').update(licenseKey).digest('hex').substring(0, 16) : null;
    
    // Insert log entry
    await db.query(
      `INSERT INTO license_logs (license_key, device_id, action, status, message, error_details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [keyHash, deviceId, action, status, message, errorDetails]
    );

    // CRITICAL: Cap log size - keep only last 1000 entries per device
    try {
      await db.query(
        `DELETE FROM license_logs 
         WHERE device_id = $1 
         AND id NOT IN (
           SELECT id FROM license_logs 
           WHERE device_id = $1 
           ORDER BY id DESC 
           LIMIT 1000
         )`,
        [deviceId]
      );
    } catch (cleanupError) {
      // Ignore cleanup errors - not critical
      console.error('[License Storage] Error cleaning up logs:', cleanupError);
    }
  } catch (error) {
    // CRITICAL: Never throw - logging failures shouldn't break the app
    console.error('[License Storage] Error logging license action (non-critical):', error);
  }
}

/**
 * Check if state transition is allowed
 * CRITICAL: Prevents illegal state transitions
 */
function isTransitionAllowed(fromState, toState) {
  if (!fromState || !toState) {
    return false;
  }

  const allowed = ALLOWED_TRANSITIONS[fromState.toUpperCase()];
  if (!allowed) {
    return false;
  }

  return allowed.includes(toState.toUpperCase());
}

/**
 * Update license status from server (ADVISORY ONLY - Two-step downgrade)
 * CRITICAL: Server response is advisory - only update if server explicitly says expired/revoked
 * CRITICAL: Two-step confirmation required to prevent server flapping
 * Never downgrade an active license without explicit server confirmation
 */
async function updateLicenseStatusFromServer(deviceId, serverResponse) {
  try {
    const license = await getLicense(deviceId);
    if (!license) {
      return false; // No license to update
    }

    // Only trust server if it provides explicit status
    if (!serverResponse || !serverResponse.status) {
      // Invalid server response - ignore it, keep local license
      return false;
    }

    const serverStatus = serverResponse.status.toLowerCase();
    const serverExpiryDate = serverResponse.expiry_date ? new Date(serverResponse.expiry_date) : null;
    const currentState = license.is_active ? 'ACTIVATED' : 'REVOKED';

    // CRITICAL: For explicit revocations from server, apply immediately (no two-step delay)
    // Two-step protection is only for expired licenses to prevent false positives
    if (serverStatus === 'revoked') {
      // CRITICAL: Server explicitly says revoked - apply immediately
      // Set both status and is_active immediately
      await db.query(
        'UPDATE license_info SET is_active = false, status = $1, pending_status = NULL, pending_status_count = 0 WHERE device_id = $2',
        ['revoked', deviceId]
      );
      await logLicenseAction(license.license_key, deviceId, 'server_revocation', 'info', 'License revoked by server (immediate application)');
      return true; // Applied immediately
    }

    if (serverStatus === 'expired') {
      // Check if this is first or second expiry notice
      if (license.pending_status === 'expired' && license.pending_status_count >= 1) {
        // Second confirmation - apply expiry
        const localExpiry = license.expires_at ? new Date(license.expires_at) : null;
        
        // If server expiry is in the past, trust server
        if (serverExpiryDate && serverExpiryDate < new Date()) {
          await db.query(
            'UPDATE license_info SET is_active = false, expires_at = $1, pending_status = NULL, pending_status_count = 0 WHERE device_id = $2',
            [serverExpiryDate, deviceId]
          );
          await logLicenseAction(license.license_key, deviceId, 'server_expiry', 'info', 'License expired per server (confirmed)');
          return true;
        }
        
        // If local expiry is still future, prefer local (might be clock mismatch)
        if (localExpiry && localExpiry > new Date()) {
          // Keep local license - might be server clock issue
          await db.query(
            'UPDATE license_info SET pending_status = NULL, pending_status_count = 0 WHERE device_id = $1',
            [deviceId]
          );
          return false;
        }
      } else {
        // First notice - mark as pending, keep active
        await db.query(
          'UPDATE license_info SET pending_status = $1, pending_status_count = pending_status_count + 1 WHERE device_id = $2',
          ['expired', deviceId]
        );
        await logLicenseAction(license.license_key, deviceId, 'server_expiry_pending', 'info', 'License expiry pending confirmation');
        return false; // Not applied yet
      }
    }

    if (serverStatus === 'active') {
      // Server confirms active - clear any pending status and update timestamps
      await db.query(
        `UPDATE license_info 
         SET last_validated_at = CURRENT_TIMESTAMP, 
             last_verified_at = CURRENT_TIMESTAMP,
             pending_status = NULL, 
             pending_status_count = 0,
             last_known_valid_date = CURRENT_DATE
         WHERE device_id = $1`,
        [deviceId]
      );
      
      // Update expiry date if server provides it and it's different
      if (serverExpiryDate && license.expires_at) {
        const localExpiry = new Date(license.expires_at);
        if (serverExpiryDate.getTime() !== localExpiry.getTime()) {
          // Server expiry differs - update it
          await db.query(
            'UPDATE license_info SET expires_at = $1 WHERE device_id = $2',
            [serverExpiryDate, deviceId]
          );
        }
      }
      
      return true;
    }

    // Unknown status or invalid response - ignore server, keep local
    return false;
  } catch (error) {
    console.error('[License Storage] Error updating from server:', error);
    // Fail-safe: Never throw - keep local license
    return false;
  }
}

/**
 * Check device binding consistency
 * CRITICAL: Device mismatch should NOT auto-revoke
 * Should switch to UNACTIVATED mode and allow reactivation
 */
async function checkDeviceBinding(deviceId, storedDeviceId) {
  // Allow some tolerance - exact match or null stored device
  if (!storedDeviceId || storedDeviceId === deviceId) {
    return true; // Match or no stored device
  }

  // Device mismatch - log but don't auto-revoke
  console.warn(`[License] Device ID mismatch: stored=${storedDeviceId}, current=${deviceId}`);
  await logLicenseAction(null, deviceId, 'device_mismatch', 'warning', 'Device ID changed - reactivation may be required');
  
  // Return false to trigger UNACTIVATED mode, but don't revoke
  return false;
}

module.exports = {
  storeLicense,
  getLicense,
  isLicenseValid,
  updateLastValidation,
  updateLastVerified,
  updateLicenseStatusFromServer,
  deactivateLicense,
  logLicenseAction,
  shouldValidateWithServer,
  isTransitionAllowed,
  checkDeviceBinding,
  encrypt,
  decrypt
};
