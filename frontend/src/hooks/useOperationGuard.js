import { useCallback } from 'react';
import { useLicense } from '../contexts/LicenseContext';

/**
 * Hook to check if operations are allowed and show appropriate messages
 * Returns a function that can be called before performing operations
 */
export const useOperationGuard = () => {
  const { canPerformOperations, licenseState, STATES } = useLicense();

  const checkOperation = useCallback((operationName = 'this operation') => {
    if (!canPerformOperations()) {
      let message = 'Please activate software to use this feature.';
      
      switch (licenseState) {
        case STATES.REVOKED:
          message = 'License has been revoked. Please activate a new license from Settings.';
          break;
        case STATES.TRIAL:
          message = 'Trial expired. Please activate your license from Settings.';
          break;
        case STATES.UNACTIVATED:
        default:
          message = 'Software not activated. Please activate from Settings to use this feature.';
          break;
      }

      // Show toast/alert
      if (window.showToast) {
        window.showToast(message, 'warning');
      } else {
        alert(message);
      }

      return false;
    }
    return true;
  }, [canPerformOperations, licenseState, STATES]);

  return {
    canPerformOperations,
    checkOperation,
    isBlocked: !canPerformOperations()
  };
};






