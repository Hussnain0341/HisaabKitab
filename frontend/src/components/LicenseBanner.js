import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLicense } from '../contexts/LicenseContext';
import './LicenseBanner.css';

/**
 * Persistent notification banner shown when software is not activated
 * Non-blocking, always visible at top of app
 */
function LicenseBanner() {
  const { licenseState, isActivated, STATES } = useLicense();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Only show banner if not activated
  if (isActivated) {
    return null;
  }

  const getBannerMessage = () => {
    switch (licenseState) {
      case STATES.TRIAL:
        return t('license.trialMode');
      case STATES.REVOKED:
        return t('license.revoked');
      case STATES.UNACTIVATED:
      default:
        return t('license.unactivated');
    }
  };

  const handleGoToSettings = () => {
    try {
      navigate('/settings', { replace: false });
    } catch (error) {
      console.error('[LicenseBanner] Navigation error:', error);
      // Fallback: try window location
      window.location.href = '/settings';
    }
  };

  return (
    <div className="license-banner">
      <div className="license-banner-content">
        <span className="license-banner-icon">⚠️</span>
        <span className="license-banner-message">{getBannerMessage()}</span>
        <button 
          type="button"
          onClick={handleGoToSettings} 
          className="license-banner-link"
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'inherit', 
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit',
            fontSize: 'inherit'
          }}
        >
          {t('license.goToSettings')}
        </button>
      </div>
    </div>
  );
}

export default LicenseBanner;

