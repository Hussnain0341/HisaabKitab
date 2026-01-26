import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import licenseService from '../services/licenseService';

const LicenseContext = createContext();

// License states
export const LICENSE_STATES = {
  TRIAL: 'TRIAL',
  UNACTIVATED: 'UNACTIVATED',
  ACTIVATED: 'ACTIVATED', // Lifetime activation
  REVOKED: 'REVOKED'
};

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within LicenseProvider');
  }
  return context;
};

export const LicenseProvider = ({ children }) => {
  const [licenseState, setLicenseState] = useState(LICENSE_STATES.UNACTIVATED);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Determine license state from backend response
   * States: TRIAL, UNACTIVATED, ACTIVATED (lifetime), REVOKED
   */
  const determineLicenseState = useCallback((statusData) => {
    console.log('[License Context] Determining license state from:', {
      hasState: !!statusData?.state,
      state: statusData?.state,
      activated: statusData?.activated,
      valid: statusData?.valid,
      revoked: statusData?.revoked,
      code: statusData?.code
    });
    
    if (!statusData) {
      console.log('[License Context] No status data - returning UNACTIVATED');
      return LICENSE_STATES.UNACTIVATED;
    }

    // CRITICAL: Use state from backend if available (highest priority)
    if (statusData.state) {
      const backendState = statusData.state.toUpperCase();
      console.log('[License Context] Using backend state:', backendState);
      
      // Map backend state to frontend state
      if (backendState === 'ACTIVATED') {
        console.log('[License Context] ✅ License state: ACTIVATED');
        return LICENSE_STATES.ACTIVATED;
      } else if (backendState === 'REVOKED') {
        console.log('[License Context] ⚠️ License state: REVOKED');
        return LICENSE_STATES.REVOKED;
      } else if (backendState === 'TRIAL') {
        console.log('[License Context] ⚠️ License state: TRIAL');
        return LICENSE_STATES.TRIAL;
      } else {
        console.log('[License Context] ⚠️ License state: UNACTIVATED (from backend state)');
        return LICENSE_STATES.UNACTIVATED;
      }
    }

    // Fallback: If explicitly revoked
    if (statusData.revoked || statusData.code === 'REVOKED_LICENSE') {
      console.log('[License Context] ⚠️ License revoked (from revoked flag)');
      return LICENSE_STATES.REVOKED;
    }

    // Fallback: If activated and valid - treat as ACTIVATED (lifetime)
    if (statusData.activated && statusData.valid) {
      console.log('[License Context] ✅ License activated and valid - returning ACTIVATED');
      return LICENSE_STATES.ACTIVATED;
    }

    // If activated but invalid/expired
    if (statusData.activated && !statusData.valid) {
      if (statusData.expired) {
        console.log('[License Context] ⚠️ License expired');
        return LICENSE_STATES.UNACTIVATED;
      }
      console.log('[License Context] ⚠️ License revoked or invalid');
      return LICENSE_STATES.REVOKED;
    }

    // Default: unactivated
    console.log('[License Context] ⚠️ Default: UNACTIVATED');
    return LICENSE_STATES.UNACTIVATED;
  }, []);

  /**
   * Revalidate license with server (FORCES SERVER CHECK)
   * CRITICAL: This actually calls the server, unlike checkLicenseStatus which only reads local DB
   * Use this when you need to check if server has revoked/expired the license
   */
  const revalidateLicense = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call backend revalidate endpoint (which calls external server)
      const result = await licenseService.revalidateLicense();
      
      if (result.success && result.data) {
        const state = determineLicenseState(result.data);
        setLicenseState(state);
        setLicenseInfo(result.data.license || null);
        
        // CRITICAL: If server says expired/revoked, respect it
        if (result.data.state === 'REVOKED' || result.data.state === 'UNACTIVATED') {
          console.log('[License] Server reports license is not active - updating local state');
        }
        
        return { state, data: result.data };
      } else {
        // Server error - but if we have local license, keep it (fail-safe)
        // Only update if server explicitly says expired/revoked
        if (result.code === 'REVOKED_LICENSE' || result.code === 'EXPIRED_LICENSE') {
          setLicenseState(LICENSE_STATES.UNACTIVATED);
          setLicenseInfo(null);
        }
        return { state: licenseState, data: null, error: result.error };
      }
    } catch (error) {
      console.error('[License] Revalidation error (non-critical):', error);
      // Fail-safe: Keep current state on error
      return { state: licenseState, data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [determineLicenseState, licenseState]);

  /**
   * Check license status (NON-BLOCKING, FAIL-SAFE)
   * CRITICAL: Loads local license first, server is advisory only
   * Never blocks UI, never crashes, always favors customer
   * CRITICAL: Sets loading state properly to prevent race conditions
   * CRITICAL: Handles device ID changes (cache cleared) gracefully
   * CRITICAL: Prevents concurrent calls to avoid loops
   */
  const checkLicenseStatus = useCallback(async () => {
    // Prevent concurrent calls
    if (checkLicenseStatus.inProgress) {
      console.log('[License Context] License check already in progress, skipping...');
      return { state: licenseState, data: null };
    }
    
    checkLicenseStatus.inProgress = true;
    
    try {
      setLoading(true);
      setError(null);
      
      // console.log('[License Context] Checking license status...');
      
      // Call backend to get LOCAL license status (non-blocking)
      const result = await licenseService.getLicenseStatus();
      
      // Reduce logging to prevent console spam
      // console.log('[License Context] License status result:', {
      //   success: result.success,
      //   hasData: !!result.data,
      //   state: result.data?.state,
      //   activated: result.data?.activated,
      //   valid: result.data?.valid
      // });
      
      if (result.success && result.data) {
        const state = determineLicenseState(result.data);
        setLicenseState(state);
        setLicenseInfo(result.data.license || null);
        
        // Reduce logging to prevent console spam
        // CRITICAL: If ACTIVATED, trust local state forever
        if (state === LICENSE_STATES.ACTIVATED) {
          // console.log('[License Context] ✅ License is ACTIVATED (lifetime) - trusting local state');
        }
        // else {
        //   console.log('[License Context] ⚠️ License state:', state, '- operations will be disabled');
        // }
        
        return { state, data: result.data };
      } else {
        // API error - fail-safe: set to UNACTIVATED (will show activation UI)
        // But don't block app - user can still navigate
        console.warn('[License Context] ⚠️ License check failed or returned no data:', result.error);
        setLicenseState(LICENSE_STATES.UNACTIVATED);
        setLicenseInfo(null);
        return { state: LICENSE_STATES.UNACTIVATED, data: null };
      }
    } catch (error) {
      console.error('[License Context] ❌ Error checking status (non-critical):', error);
      // Fail-safe: Never crash, never block
      // Set to UNACTIVATED but allow app to continue
      setLicenseState(LICENSE_STATES.UNACTIVATED);
      setError(null); // Don't show technical errors to user
      return { state: LICENSE_STATES.UNACTIVATED, data: null };
    } finally {
      // CRITICAL: Always set loading to false, even on error
      // This ensures UI doesn't stay in loading state forever
      setLoading(false);
      checkLicenseStatus.inProgress = false;
      // console.log('[License Context] License check completed, loading set to false');
    }
  }, [determineLicenseState, licenseState]);

  /**
   * Activate license (one-time activation)
   */
  const activateLicense = useCallback(async (licenseKey) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await licenseService.validateLicense(licenseKey);
      
      if (result.success && result.data.valid) {
        // License activated successfully
        const state = LICENSE_STATES.ACTIVATED; // Always lifetime after successful activation
        setLicenseState(state);
        setLicenseInfo(result.data.license || null);
        
        // Store activation token locally (backend handles this)
        console.log('[License] License activated successfully - lifetime activation');
        
        return { success: true, state, license: result.data.license };
      } else {
        // Activation failed
        const errorMsg = result.details?.reason || result.error || 'License activation failed';
        setError(errorMsg);
        return { success: false, error: errorMsg, code: result.code };
      }
    } catch (error) {
      console.error('[License] Activation error:', error);
      const errorMsg = error.message || 'Failed to activate license';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if operations are allowed (only ACTIVATED allows operations)
   */
  const canPerformOperations = useCallback(() => {
    return licenseState === LICENSE_STATES.ACTIVATED;
  }, [licenseState]);

  /**
   * Check if feature is enabled (only for ACTIVATED licenses)
   */
  const isFeatureEnabled = useCallback((featureName) => {
    // User requirement: once a license is ACTIVATED, nothing should be blocked by "feature gating".
    // Treat all features as enabled for any activated license.
    if (licenseState === LICENSE_STATES.ACTIVATED) {
      return true;
    }
    return false;
  }, [licenseState]);

  /**
   * Initial check on mount (NON-BLOCKING, FAIL-SAFE)
   * CRITICAL: Never blocks app startup, never crashes
   * CRITICAL: Only runs ONCE on mount, not on every state change
   * CRITICAL: Sets loading to false quickly to prevent UI blocking
   */
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    // CRITICAL: Set a shorter timeout to prevent long blocking
    // If check takes too long, assume activated (optimistic) to prevent false disabling
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log('[License] Initial check timeout - assuming activated to prevent false disabling');
        setLoading(false);
        // Don't change state on timeout - keep current state
        // This prevents buttons from being disabled if check is slow
      }
    }, 2000); // 2 second max wait (reduced from 5 seconds)

    checkLicenseStatus()
      .then(result => {
        if (isMounted) {
          // Clear timeout since we got a result
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setLoading(false);
          
          // Log the result for debugging
          console.log('[License] Initial check completed:', {
            state: result.state,
            activated: result.state === LICENSE_STATES.ACTIVATED
          });
        }
      })
      .catch(err => {
        console.error('[License] Initial check failed (non-critical):', err);
        // Fail-safe: allow app to load, but set to UNACTIVATED
        if (isMounted) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setLoading(false);
          // Only set to UNACTIVATED if we're sure there's an error
          // Don't disable buttons on network errors
          setLicenseState(LICENSE_STATES.UNACTIVATED);
        }
      });

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // CRITICAL: Empty dependency array - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Periodic revalidation (respects server-side changes)
   * CRITICAL: Only runs if license is ACTIVATED and app is active
   * Checks server every 6 hours to see if license was revoked/expired
   */
  useEffect(() => {
    // Only revalidate if license is ACTIVATED
    if (licenseState !== LICENSE_STATES.ACTIVATED) {
      return; // No periodic checks for unactivated licenses
    }

    // Set up periodic revalidation (every 6 hours)
    const revalidationInterval = setInterval(() => {
      console.log('[License] Periodic revalidation check...');
      revalidateLicense().catch(err => {
        console.error('[License] Periodic revalidation failed (non-critical):', err);
        // Fail-safe: Don't update state on error
      });
    }, 6 * 60 * 60 * 1000); // 6 hours

    // Also revalidate when app comes back into focus (if 6+ hours since last check)
    const handleFocus = () => {
      const lastCheck = localStorage.getItem('lastLicenseRevalidation');
      const now = Date.now();
      const sixHours = 6 * 60 * 60 * 1000;
      
      if (!lastCheck || (now - parseInt(lastCheck)) > sixHours) {
        console.log('[License] App focused - revalidating license...');
        revalidateLicense()
          .then(() => {
            localStorage.setItem('lastLicenseRevalidation', now.toString());
          })
          .catch(err => {
            console.error('[License] Focus revalidation failed (non-critical):', err);
          });
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(revalidationInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [licenseState, revalidateLicense]);

  // NO background revalidation for ACTIVATED licenses
  // Once activated, trust local state forever

  const value = {
    licenseState,
    licenseInfo,
    loading,
    error,
    checkLicenseStatus,
    revalidateLicense,
    activateLicense,
    canPerformOperations,
    isFeatureEnabled,
    // Global disabled state for all CRUD operations
    // CRITICAL: Only disable if license is NOT ACTIVATED
    isOperationsDisabled: licenseState !== LICENSE_STATES.ACTIVATED,
    // State helpers
    isActivated: licenseState === LICENSE_STATES.ACTIVATED,
    isTrial: licenseState === LICENSE_STATES.TRIAL,
    isUnactivated: licenseState === LICENSE_STATES.UNACTIVATED,
    isRevoked: licenseState === LICENSE_STATES.REVOKED,
    // State constants
    STATES: LICENSE_STATES
  };
  
  // CRITICAL: Log operations disabled state whenever it changes
  useEffect(() => {
    console.log('[License Context] Operations disabled state:', {
      licenseState,
      isOperationsDisabled: licenseState !== LICENSE_STATES.ACTIVATED,
      isActivated: licenseState === LICENSE_STATES.ACTIVATED,
      loading
    });
  }, [licenseState, loading]);

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
};
