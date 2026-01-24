import React, { useState, useEffect } from 'react';
import './LicenseActivation.css';
import { useLicense } from '../contexts/LicenseContext';

function LicenseActivation({ onActivationSuccess, embedded = false }) {
  const { activateLicense, isActivated } = useLicense();
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const [successMessage, setSuccessMessage] = useState('');

  // If already activated and embedded, don't show form
  useEffect(() => {
    if (isActivated && embedded) {
      setStatus('success');
    }
  }, [isActivated, embedded]);

  const handleActivate = async (e) => {
    e.preventDefault();
    
    if (!licenseKey.trim()) {
      setError('Please enter a license key');
      return;
    }

    // Validate license key format
    const licenseKeyPattern = /^HK-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    if (!licenseKeyPattern.test(licenseKey.trim())) {
      setError('Invalid license key format. Please enter a valid license key (e.g., HK-XXXX-XXXX-XXXX)');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('activating');

    try {
      const result = await activateLicense(licenseKey.trim());

      if (result.success) {
        setStatus('success');
        const tenantName = result.license?.tenantName || 'Your account';
        setSuccessMessage(`License activated successfully! Welcome, ${tenantName}.`);
        
        // Call success callback
        if (onActivationSuccess) {
          setTimeout(() => {
            onActivationSuccess();
          }, 2000);
        }
      } else {
        setStatus('error');
        setError(result.error || 'License activation failed');
      }
    } catch (err) {
      setStatus('error');
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Checking license status...';
      case 'activating':
        return 'Activating license...';
      case 'success':
        return 'License activated successfully!';
      default:
        return '';
    }
  };

  return (
    <div className={`license-activation-container ${embedded ? 'embedded' : ''}`}>
      <div className={`license-activation-box ${embedded ? 'embedded-box' : ''}`}>
        {!embedded && (
          <div className="license-activation-header">
            <h1>🔒 License Activation</h1>
            <p>Please activate your HisaabKitab license to continue</p>
          </div>
        )}

        {status === 'success' && embedded ? (
          <div className="license-success-message">
            <span className="success-icon">✅</span>
            <span>License activated successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleActivate} className="license-activation-form">
            <div className="form-group">
              <label htmlFor="licenseKey">License Key</label>
              <input
                type="text"
                id="licenseKey"
                value={licenseKey}
                onChange={(e) => {
                  setLicenseKey(e.target.value);
                  setError('');
                }}
                placeholder="Enter your license key (e.g., HK-XXXX-XXXX-XXXX)"
                disabled={loading || status === 'checking' || status === 'success'}
                className={error ? 'error' : ''}
                autoFocus={!embedded}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {(status === 'checking' || status === 'activating' || status === 'success') && (
              <div className={`status-message ${status}`}>
                <span className="status-icon">
                  {status === 'checking' || status === 'activating' ? '⏳' : '✅'}
                </span>
                <span>{getStatusMessage()}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || status === 'checking' || status === 'success' || !licenseKey.trim()}
              className="activate-button"
            >
              {loading || status === 'activating' ? 'Activating...' : 'Activate License'}
            </button>
          </form>
        )}

        {!embedded && (
          <div className="license-activation-footer">
            <p className="support-info">
              Need help? Contact HisaabKitab support for assistance.
            </p>
            <p className="internet-required">
              ⚠️ Internet connection is required for license activation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LicenseActivation;


