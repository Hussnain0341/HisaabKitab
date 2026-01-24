import axios from 'axios';
import { getDeviceId, getDeviceIdSync, generateDeviceFingerprint } from '../utils/deviceFingerprint';
import { getServerUrl } from '../utils/connectionStatus';

// Use local backend for all license operations (backend proxies to external API)
// This avoids CORS issues - browser can't call external API directly
const API_BASE_URL = getServerUrl();

// Get app version from package.json or environment
const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';

/**
 * License Service
 * Handles all license-related API calls
 */
class LicenseService {
  constructor() {
    // CRITICAL: Device ID is generated CLIENT-SIDE and stored in localStorage
    // This ensures same device ID whether accessed via web or desktop
    // Industry-standard approach: Generate UUID once, store it, reuse it
    this.deviceId = getDeviceIdSync(); // Synchronous - localStorage is fast
    this.deviceFingerprint = generateDeviceFingerprint();
    
    console.log('[LicenseService] Device ID initialized (client-generated):', this.deviceId.substring(0, 16) + '...');
  }

  /**
   * Validate license with server
   */
  async validateLicense(licenseKey) {
    try {
      // Call local backend - it will proxy to external API (avoids CORS)
      // getServerUrl() returns '/api' or 'http://localhost:5000/api'
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const apiUrl = `${baseUrl}/license/validate`;
      
      console.log('[LicenseService] Validating license:', {
        licenseKeyPrefix: licenseKey ? licenseKey.trim().substring(0, 8) + '...' : 'MISSING',
        deviceId: this.deviceId.substring(0, 16) + '...',
        appVersion: APP_VERSION,
        apiUrl: apiUrl
      });

      const requestPayload = {
        licenseKey: licenseKey.trim(),
        deviceId: this.deviceId,
        appVersion: APP_VERSION
      };

      console.log('[LicenseService] Request payload (full):', JSON.stringify({
        licenseKey: requestPayload.licenseKey,
        deviceId: requestPayload.deviceId,
        appVersion: requestPayload.appVersion
      }));

      const response = await axios.post(
        apiUrl,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 20000
        }
      );

      console.log('[LicenseService] Response received:', {
        status: response.status,
        valid: response.data.valid,
        hasLicense: !!response.data.license,
        error: response.data.error || 'N/A',
        reason: response.data.reason || 'N/A'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('[LicenseService] Validation error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        const responseData = error.response.data;
        return {
          success: false,
          error: responseData.error || responseData.reason || 'License validation failed',
          code: responseData.code || 'VALIDATION_ERROR',
          details: responseData,
          requiresInternet: responseData.requiresInternet || false
        };
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.message.includes('Network Error')) {
        return {
          success: false,
          error: 'Cannot connect to license server. Internet connection required for activation.',
          code: 'NETWORK_ERROR',
          requiresInternet: true
        };
      } else {
        return {
          success: false,
          error: error.message || 'Unknown error occurred',
          code: 'UNKNOWN_ERROR'
        };
      }
    }
  }

  /**
   * Get current license status
   */
  async getLicenseStatus() {
    try {
      // Device ID is already initialized in constructor (client-generated, stored in localStorage)
      // No need to wait for backend - device ID is always available synchronously
      
      // Check local backend for stored license status
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const response = await axios.get(
        `${baseUrl}/license/status`,
        {
          headers: {
            'X-Device-ID': this.deviceId
          },
          timeout: 5000
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Failed to get license status',
          data: error.response.data
        };
      } else {
        return {
          success: false,
          error: 'Network error while checking license status',
          code: 'NETWORK_ERROR'
        };
      }
    }
  }

  /**
   * Revalidate license (periodic check)
   */
  async revalidateLicense() {
    try {
      // Revalidate through local backend (which calls external API)
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
      const response = await axios.post(
        `${baseUrl}/license/revalidate`,
        {},
        {
          headers: {
            'X-Device-ID': this.deviceId
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'License revalidation failed',
          code: error.response.data.code || 'REVALIDATION_ERROR',
          requiresActivation: error.response.data.requiresActivation || false
        };
      } else {
        // Network error - allow offline access if we have cached license
        return {
          success: false,
          error: 'Network error during revalidation',
          code: 'NETWORK_ERROR',
          offline: true
        };
      }
    }
  }
}

// Export singleton instance
export default new LicenseService();


