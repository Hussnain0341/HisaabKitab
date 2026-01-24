import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Billing from './components/Billing';
import Suppliers from './components/Suppliers';
import SupplierPayments from './components/SupplierPayments';
import Customers from './components/Customers';
import Categories from './components/Categories';
import Purchases from './components/Purchases';
import Expenses from './components/Expenses';
import RateList from './components/RateList';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import ConnectionStatus from './components/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary';
import LicenseBanner from './components/LicenseBanner';
import DatabaseSetup from './components/DatabaseSetup';
import { LicenseProvider, useLicense } from './contexts/LicenseContext';
import { settingsAPI } from './services/api';

// Inner component that uses location (must be inside Router)
function AppContentWithRouter() {
  const location = useLocation();
  return <AppContent location={location} />;
}

// Inner App component that uses license context
function AppContent({ location }) {
  const { i18n } = useTranslation();
  const { licenseState, canPerformOperations, checkLicenseStatus, isOperationsDisabled, loading: licenseLoading } = useLicense();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDatabaseSetup, setShowDatabaseSetup] = useState(false);
  const [dbSetupChecked, setDbSetupChecked] = useState(false);
  
  // Check if we're on Settings page
  const isSettingsPage = location?.pathname === '/settings';

  // Load language from settings on app startup
  useEffect(() => {
    const loadLanguageFromSettings = async () => {
      try {
        const response = await settingsAPI.get();
        const data = response.data;
        if (data && data.language) {
          i18n.changeLanguage(data.language);
        }
      } catch (err) {
        console.error('Error loading language from settings:', err);
        // Fallback to default language
        i18n.changeLanguage('en');
      }
    };
    
    loadLanguageFromSettings();
  }, [i18n]);

  // Check database setup on mount
  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  // CRITICAL FIX: Only set read-only mode AFTER license check completes
  // Don't disable buttons while license is still loading
  useEffect(() => {
    // CRITICAL: Wait for license check to complete before disabling
    // If licenseLoading is true, don't disable buttons yet (they might be activated)
    if (licenseLoading) {
      // While loading, keep buttons enabled (optimistic approach)
      setReadOnlyMode(false);
      return;
    }
    
    // Only disable after license check completes
    // CRITICAL: Use isOperationsDisabled directly from LicenseContext
    // This ensures readOnlyMode matches the actual license state
    setReadOnlyMode(isOperationsDisabled);
  }, [isOperationsDisabled, licenseLoading]);

  // CRITICAL: Add global class to app root when operations are disabled
  // This allows CSS to globally disable all buttons
  // Also add event listeners to prevent clicks on disabled buttons (backup)
  useEffect(() => {
    // CRITICAL: Don't disable buttons while license is still loading
    // Wait for license check to complete first
    if (licenseLoading) {
      // Remove disabling while loading
      const appElement = document.querySelector('.app');
      if (appElement) {
        appElement.classList.remove('operations-disabled');
        // Re-enable any previously disabled buttons
        const allButtons = appElement.querySelectorAll('button[data-license-disabled="true"]');
        allButtons.forEach(button => {
          button.disabled = false;
          button.removeAttribute('data-license-disabled');
        });
      }
      console.log('[App] License check in progress - keeping buttons enabled');
      return;
    }
    
    // Use requestAnimationFrame to ensure DOM is ready
    const setupDisabling = () => {
      const appElement = document.querySelector('.app');
      if (!appElement) {
        console.warn('[App] .app element not found, retrying...');
        // Retry after a short delay
        setTimeout(setupDisabling, 100);
        return;
      }
      
      console.log('[App] License check complete. isOperationsDisabled:', isOperationsDisabled, 'licenseState:', licenseState, 'licenseLoading:', licenseLoading);
      
      // CRITICAL: Directly disable all buttons via JavaScript
      const disableAllButtons = () => {
        // CRITICAL: If we're on Settings page, DON'T disable anything and re-enable any previously disabled buttons
        if (isSettingsPage) {
          const allButtons = appElement.querySelectorAll('button[data-license-disabled="true"]');
          allButtons.forEach(button => {
            button.disabled = false;
            button.removeAttribute('data-license-disabled');
          });
          console.log('[App] Settings page detected - all buttons enabled');
          return;
        }
        
        const allButtons = appElement.querySelectorAll('button');
        let disabledCount = 0;
        let skippedCount = 0;
        allButtons.forEach(button => {
          // Skip navigation and allowed buttons
          if (button.classList.contains('menu-item') || 
              button.classList.contains('license-banner-link') ||
              button.classList.contains('tab') ||
              button.hasAttribute('data-allow-disabled') ||
              button.hasAttribute('data-navigation')) {
            skippedCount++;
            return;
          }
          
          // CRITICAL: Skip ALL buttons and inputs in Settings page (multiple checks)
          const settingsContainer = button.closest('.content-container');
          if (settingsContainer) {
            // Multiple ways to detect Settings page
            const hasSettingsTitle = settingsContainer.querySelector('.page-title')?.textContent === 'Settings' ||
                                     settingsContainer.querySelector('h1')?.textContent === 'Settings';
            const hasLicenseSection = settingsContainer.querySelector('.license-activation-section') !== null;
            const hasSettingsActions = settingsContainer.querySelector('.settings-actions') !== null;
            const hasSettingsForm = settingsContainer.querySelector('.settings-form') !== null;
            
            if (hasSettingsTitle || hasLicenseSection || hasSettingsActions || hasSettingsForm) {
              skippedCount++;
              // Also re-enable if it was disabled
              if (button.hasAttribute('data-license-disabled')) {
                button.disabled = false;
                button.removeAttribute('data-license-disabled');
              }
              return;
            }
          }
          
          // Skip license activation form elements
          const licenseForm = button.closest('.license-activation-form');
          if (licenseForm) {
            skippedCount++;
            if (button.hasAttribute('data-license-disabled')) {
              button.disabled = false;
              button.removeAttribute('data-license-disabled');
            }
            return;
          }
          
          // Skip settings form elements
          const settingsForm = button.closest('.settings-form');
          if (settingsForm) {
            skippedCount++;
            if (button.hasAttribute('data-license-disabled')) {
              button.disabled = false;
              button.removeAttribute('data-license-disabled');
            }
            return;
          }
          
          // Skip settings-actions container
          const settingsActions = button.closest('.settings-actions');
          if (settingsActions) {
            skippedCount++;
            if (button.hasAttribute('data-license-disabled')) {
              button.disabled = false;
              button.removeAttribute('data-license-disabled');
            }
            return;
          }
          
          // Disable the button
          if (!button.disabled) {
            button.disabled = true;
            button.setAttribute('data-license-disabled', 'true');
            disabledCount++;
          }
        });
        if (disabledCount > 0) {
          console.log(`[App] Disabled ${disabledCount} buttons, skipped ${skippedCount} navigation/Settings buttons`);
        }
      };
      
      if (isOperationsDisabled && !isSettingsPage) {
        appElement.classList.add('operations-disabled');
        console.log('[App] ✅ Operations DISABLED - license not activated. Class added to .app element');
        
        // Disable buttons immediately and repeatedly to catch dynamically added ones
        disableAllButtons();
        
        // Disable buttons multiple times to catch all render cycles
        const timeouts = [
          setTimeout(disableAllButtons, 50),
          setTimeout(disableAllButtons, 200),
          setTimeout(disableAllButtons, 500),
          setTimeout(disableAllButtons, 1000)
        ];
        
        // CRITICAL: Add click event listener to prevent button clicks (backup to CSS)
        const handleButtonClick = (e) => {
          const target = e.target;
          // Check if it's a button or inside a button
          const button = target.closest('button');
          if (button && 
              !button.classList.contains('menu-item') && 
              !button.classList.contains('license-banner-link') &&
              !button.classList.contains('tab') &&
              !button.hasAttribute('data-allow-disabled') &&
              !button.hasAttribute('data-navigation')) {
            
            // CRITICAL: Allow all clicks in Settings page
            const settingsContainer = button.closest('.content-container');
            if (settingsContainer) {
              // Double-check: make sure it's actually the Settings page
              const isSettingsPage = settingsContainer.querySelector('.page-title')?.textContent === 'Settings' ||
                                     settingsContainer.querySelector('h1')?.textContent === 'Settings' ||
                                     settingsContainer.querySelector('.license-activation-section') !== null ||
                                     settingsContainer.querySelector('.settings-actions') !== null;
              if (isSettingsPage) {
                return; // Allow click
              }
            }
            
            // Allow clicks in license activation form
            const licenseForm = button.closest('.license-activation-form');
            if (licenseForm) {
              return; // Allow click
            }
            
            // Allow clicks in settings form
            const settingsForm = button.closest('.settings-form');
            if (settingsForm) {
              return; // Allow click
            }
            
            // Allow clicks in settings-actions
            const settingsActions = button.closest('.settings-actions');
            if (settingsActions) {
              return; // Allow click
            }
            
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const buttonText = button.textContent?.trim() || button.className || 'Unknown button';
            console.log('[App] 🚫 Button click BLOCKED - license not activated:', buttonText);
            alert('⚠️ Please activate the software to use this feature.\n\nGo to Settings → License Activation to activate your license.');
            return false;
          }
        };
        
        // Add event listener with capture phase to catch all clicks
        appElement.addEventListener('click', handleButtonClick, true);
        
        // Use MutationObserver to catch dynamically added buttons
        const observer = new MutationObserver((mutations) => {
          disableAllButtons();
        });
        
        observer.observe(appElement, {
          childList: true,
          subtree: true,
          attributes: false
        });
        
        // Also periodically check for new buttons (safety net)
        const intervalId = setInterval(disableAllButtons, 2000);
        
        return () => {
          timeouts.forEach(clearTimeout);
          clearInterval(intervalId);
          appElement.removeEventListener('click', handleButtonClick, true);
          observer.disconnect();
          
          // Re-enable buttons when operations are enabled
          const allButtons = appElement.querySelectorAll('button[data-license-disabled="true"]');
          allButtons.forEach(button => {
            button.disabled = false;
            button.removeAttribute('data-license-disabled');
          });
        };
      } else {
        // CRITICAL: License IS activated OR we're on Settings page - ENABLE everything
        console.log('[App] ✅ License ACTIVATED or Settings page - ENABLING all operations');
        console.log('[App] License state:', licenseState, 'isOperationsDisabled:', isOperationsDisabled, 'isSettingsPage:', isSettingsPage);
        appElement.classList.remove('operations-disabled');
        console.log('[App] ✅ Operations ENABLED - license activated or Settings page');
        
        // CRITICAL: Re-enable ALL buttons that were disabled
        const allButtons = appElement.querySelectorAll('button[data-license-disabled="true"]');
        allButtons.forEach(button => {
          button.disabled = false;
          button.removeAttribute('data-license-disabled');
        });
        
        if (allButtons.length > 0) {
          console.log(`[App] ✅ Re-enabled ${allButtons.length} buttons`);
        }
        
        // Also ensure all buttons are enabled (not just those with the attribute)
        const allButtonsInApp = appElement.querySelectorAll('button');
        let enabledCount = 0;
        allButtonsInApp.forEach(button => {
          // Skip navigation buttons (they should always be enabled)
          if (button.classList.contains('menu-item') || 
              button.classList.contains('license-banner-link') ||
              button.classList.contains('tab') ||
              button.hasAttribute('data-allow-disabled') ||
              button.hasAttribute('data-navigation')) {
            return;
          }
          
          // Enable all other buttons
          if (button.hasAttribute('data-license-disabled')) {
            button.disabled = false;
            button.removeAttribute('data-license-disabled');
            enabledCount++;
          } else if (button.disabled && !button.hasAttribute('disabled-by-user')) {
            // Only enable if it wasn't explicitly disabled by user code
            button.disabled = false;
            enabledCount++;
          }
        });
        
        if (enabledCount > 0) {
          console.log(`[App] ✅ Enabled ${enabledCount} additional buttons`);
        }
        console.log('[App] ✅ All buttons enabled - license is activated');
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(setupDisabling);
  }, [isOperationsDisabled, licenseState, licenseLoading, isSettingsPage]);

  const checkDatabaseSetup = async () => {
    try {
      const { setupAPI } = await import('./services/api');
      const response = await setupAPI.check();
      
      if (!response.data.tablesExist) {
        setShowDatabaseSetup(true);
      } else {
        setShowDatabaseSetup(false);
        // License check happens automatically in LicenseContext on mount
        // No need to call checkLicenseStatus() here
      }
      setDbSetupChecked(true);
    } catch (error) {
      console.error('Error checking database setup:', error);
      // Assume setup is needed if check fails
      setShowDatabaseSetup(true);
      setDbSetupChecked(true);
    }
  };

  const handleDatabaseSetupComplete = () => {
    setShowDatabaseSetup(false);
    // License check happens automatically in LicenseContext
    // Only manually refresh if needed
    checkLicenseStatus();
  };


  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    // Force re-fetch of data by updating key prop on components
    window.dispatchEvent(new Event('data-refresh'));
  };

  // Show database setup screen if needed
  if (showDatabaseSetup) {
    return (
      <DatabaseSetup onSetupComplete={handleDatabaseSetupComplete} />
    );
  }

  // Show loading screen while checking database setup
  if (!dbSetupChecked) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  // NEVER block startup - always show app
  // Activation is handled in Settings, not on startup

  // Main app - always loads, never blocked
  return (
    <div className="app">
      <LicenseBanner />
      <ConnectionStatus 
        onRefresh={handleRefresh}
        readOnlyMode={readOnlyMode}
        setReadOnlyMode={setReadOnlyMode}
      />
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <main className="main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/inventory" element={<Inventory key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/billing" element={<Billing key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/suppliers" element={<Suppliers key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/supplier-payments" element={<SupplierPayments key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/customers" element={<Customers key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/categories" element={<Categories key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/purchases" element={<Purchases key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/expenses" element={<Expenses key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/rate-list" element={<RateList key={readOnlyMode} />} />
            <Route path="/invoices" element={<Invoices key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/reports" element={<Reports key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="/settings" element={<Settings key={refreshTrigger} readOnly={readOnlyMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}

// Main App component wrapped with LicenseProvider and Router
function App() {
  return (
    <LicenseProvider>
      <Router>
        <AppContentWithRouter />
      </Router>
    </LicenseProvider>
  );
}

export default App;

