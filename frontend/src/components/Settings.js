import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI, backupAPI } from '../services/api';
import { useLicense } from '../contexts/LicenseContext';
import LicenseActivation from './LicenseActivation';
import './Settings.css';

const Settings = ({ readOnly = false }) => {
  const { i18n, t } = useTranslation();
  const { licenseState, licenseInfo, isActivated, activateLicense, checkLicenseStatus, revalidateLicense, STATES } = useLicense();
  const [settings, setSettings] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [backupCreating, setBackupCreating] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);
  const [backupSettings, setBackupSettings] = useState({
    enabled: true,
    mode: 'scheduled',
    scheduledTime: '02:00',
    backupDir: '',
    retentionCount: 5,
  });
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchPrinters();
    fetchBackupStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('[Settings] ===== FETCH SETTINGS START =====');
      setLoading(true);
      const response = await settingsAPI.get();
      console.log('[Settings] Fetch response:', response);
      console.log('[Settings] Fetch response data:', response.data);
      
      const data = response.data;
      setSettings(data);
      
      // Parse settings
      if (data.other_app_settings) {
        const otherSettings = typeof data.other_app_settings === 'string' 
          ? JSON.parse(data.other_app_settings) 
          : data.other_app_settings;
        console.log('[Settings] Parsed other_app_settings:', otherSettings);
        setShopName(otherSettings.shop_name || 'My Shop');
        setShopAddress(otherSettings.shop_address || '');
        setShopPhone(otherSettings.shop_phone || '');
        if (otherSettings.theme) {
          setTheme(otherSettings.theme);
        }
      }
      
      if (data.printer_config) {
        const printerConfig = typeof data.printer_config === 'string' 
          ? JSON.parse(data.printer_config) 
          : data.printer_config;
        console.log('[Settings] Parsed printer_config:', printerConfig);
        setSelectedPrinter(printerConfig.printerName || '');
      }
      
      // Set language - this is critical for persistence
      console.log('[Settings] Current language in DB:', data.language);
      console.log('[Settings] Current state language:', language);
      console.log('[Settings] Current i18n language:', i18n.language);
      
      // CRITICAL: Always update from database - it's the source of truth
      // But log what's happening for debugging
      if (data.language) {
        const dbLanguage = data.language;
        
        // Update state if different
        if (dbLanguage !== language) {
          console.log('[Settings] Updating state language from', language, 'to', dbLanguage);
          setLanguage(dbLanguage);
        } else {
          console.log('[Settings] State language already matches DB:', language);
        }
        
        // Update i18n if different
        if (dbLanguage !== i18n.language) {
          console.log('[Settings] Changing i18n language from', i18n.language, 'to', dbLanguage);
          i18n.changeLanguage(dbLanguage);
        } else {
          console.log('[Settings] i18n language already matches DB:', dbLanguage);
        }
      } else {
        // Default to English if not set
        console.log('[Settings] No language in DB, defaulting to English');
        if (language !== 'en') {
          setLanguage('en');
        }
        if (i18n.language !== 'en') {
          i18n.changeLanguage('en');
        }
      }
      console.log('[Settings] Final language state:', {
        stateLanguage: language,
        i18nLanguage: i18n.language,
        dbLanguage: data.language
      });
      console.log('[Settings] ===== FETCH SETTINGS SUCCESS =====');
    } catch (err) {
      console.error('[Settings] ===== FETCH SETTINGS ERROR =====');
      console.error('[Settings] Error:', err);
      console.error('[Settings] Error response:', err.response);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrinters = async () => {
    try {
      if (window.electronAPI && window.electronAPI.getPrinters) {
        const result = await window.electronAPI.getPrinters();
        setPrinters(result.printers || []);
        if (result.defaultPrinter && !selectedPrinter) {
          setSelectedPrinter(result.defaultPrinter);
        }
      } else {
        // Fallback: mock printers list
        setPrinters([
          { name: 'Default Printer', description: 'System default printer' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching printers:', err);
      setPrinters([{ name: 'Default Printer', description: 'System default printer' }]);
    }
  };

  const fetchBackupStatus = async () => {
    try {
      const response = await backupAPI.status();
      if (response.data.success) {
        setBackupStatus(response.data.lastBackup);
        setBackupSettings(response.data.settings);
      }
    } catch (err) {
      console.error('Error fetching backup status:', err);
    }
  };

  const handleBackupSettingsChange = async (changes) => {
    const newSettings = { ...backupSettings, ...changes };
    setBackupSettings(newSettings);
    
    try {
      await backupAPI.updateSettings(newSettings);
      setSuccess(t('backup.settingsSaved'));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving backup settings:', err);
      setError(err.response?.data?.error || t('backup.settingsFailed'));
      // Revert on error
      await fetchBackupStatus();
    }
  };

  const handleRestore = async () => {
    const confirmed = window.confirm(t('backup.restoreConfirm'));
    
    if (!confirmed) {
      return;
    }
    
    try {
      setRestoring(true);
      setError(null);
      
      const response = await backupAPI.restore();
      
      if (response.data.success) {
        alert(t('backup.restoreSuccess'));
        
        // Restart Electron app if available
        if (window.electronAPI && window.electronAPI.restartApp) {
          window.electronAPI.restartApp();
        } else {
          // Fallback: reload page
          window.location.reload();
        }
      }
    } catch (err) {
      console.error('Error restoring backup:', err);
      setError(err.response?.data?.error || t('backup.restoreFailed'));
      setRestoring(false);
    }
  };

  const handleRevalidateLicense = async () => {
    setRevalidating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await revalidateLicense();
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('License status checked successfully. Server status has been updated.');
        // Refresh license status display
        await checkLicenseStatus();
      }
    } catch (err) {
      setError('Failed to check license status. Please try again.');
      console.error('Revalidation error:', err);
    } finally {
      setRevalidating(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      console.log('[Settings] ===== SAVE SETTINGS START =====');
      console.log('[Settings] Current state:', {
        shopName,
        shopAddress,
        shopPhone,
        language,
        theme,
        selectedPrinter
      });

      const printerConfig = selectedPrinter ? {
        printerName: selectedPrinter,
      } : null;

      // Get existing settings to preserve backup_config
      const existingSettings = settings?.other_app_settings || {};
      console.log('[Settings] Existing settings:', existingSettings);
      
      // Parse if it's a string
      let parsedExistingSettings = existingSettings;
      if (typeof existingSettings === 'string') {
        try {
          parsedExistingSettings = JSON.parse(existingSettings);
          console.log('[Settings] Parsed existing settings from string');
        } catch (e) {
          console.error('[Settings] Error parsing existing settings:', e);
          parsedExistingSettings = {};
        }
      }
      const existingBackupConfig = parsedExistingSettings.backup_config || backupSettings;
      console.log('[Settings] Existing backup config:', existingBackupConfig);

      const otherAppSettings = {
        shop_name: shopName,
        shop_address: shopAddress,
        shop_phone: shopPhone,
        theme: theme,
        // Preserve backup_config
        backup_config: existingBackupConfig,
      };

      const payload = {
        printer_config: printerConfig ? JSON.stringify(printerConfig) : null,
        language: language,
        other_app_settings: otherAppSettings,
      };

      console.log('[Settings] Payload to send:', {
        printer_config: payload.printer_config,
        language: payload.language,
        other_app_settings: payload.other_app_settings
      });

      console.log('[Settings] Calling settingsAPI.update...');
      const response = await settingsAPI.update(payload);
      
      console.log('[Settings] Save response received:', response);
      console.log('[Settings] Response data:', response.data);
      console.log('[Settings] Response status:', response.status);
      console.log('[Settings] Response language:', response.data?.language);

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // CRITICAL: Check if language was actually saved
      const savedLanguage = response.data.language;
      console.log('[Settings] Language in response:', savedLanguage);
      console.log('[Settings] Expected language:', language);
      console.log('[Settings] Language match:', savedLanguage === language);
      
      if (savedLanguage !== language) {
        console.error('[Settings] ⚠️ LANGUAGE MISMATCH! Expected:', language, 'Got:', savedLanguage);
        // Don't update i18n if database didn't save correctly
        setError(`Language update failed. Expected: ${language}, Got: ${savedLanguage}. Please try again.`);
        return;
      }

      // CRITICAL: Update language IMMEDIATELY from response, before refreshing
      // This ensures the UI reflects the saved value
      if (savedLanguage && savedLanguage !== i18n.language) {
        console.log('[Settings] Language changed from', i18n.language, 'to', savedLanguage);
        i18n.changeLanguage(savedLanguage);
        console.log('[Settings] i18n language updated to:', i18n.language);
        // Also update state to match saved value
        setLanguage(savedLanguage);
      } else {
        console.log('[Settings] Language unchanged:', savedLanguage);
      }

      // Refresh settings to get updated data - but wait a bit to ensure DB is updated
      console.log('[Settings] Waiting 200ms before refreshing settings to ensure DB is updated...');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('[Settings] Refreshing settings...');
      await fetchSettings();
      console.log('[Settings] Settings refreshed');
      
      // CRITICAL: After refresh, verify language is still correct
      // Use a fresh fetch to get the latest settings (don't rely on state which might be stale)
      const verifyResponse = await settingsAPI.get();
      const verifiedLanguage = verifyResponse.data?.language;
      console.log('[Settings] Language after refresh verification:', verifiedLanguage);
      console.log('[Settings] Expected language (saved):', savedLanguage);
      if (verifiedLanguage && verifiedLanguage !== savedLanguage) {
        console.warn('[Settings] ⚠️ Language changed after refresh! Expected:', savedLanguage, 'Got:', verifiedLanguage);
        // Force update to saved language
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
        console.log('[Settings] Forced language back to saved value:', savedLanguage);
      } else {
        console.log('[Settings] ✅ Language verified correctly:', verifiedLanguage);
      }

      setSuccess(t('settings.settingsSaved'));
      console.log('[Settings] Success message set');
      
      // Also save to Electron store for quick access
      if (window.electronAPI && window.electronAPI.setStoreValue) {
        console.log('[Settings] Saving to Electron store...');
        await window.electronAPI.setStoreValue('printerName', selectedPrinter);
        await window.electronAPI.setStoreValue('shopName', shopName);
        await window.electronAPI.setStoreValue('language', language);
        console.log('[Settings] Electron store updated');
      }

      console.log('[Settings] ===== SAVE SETTINGS SUCCESS =====');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('[Settings] ===== SAVE SETTINGS ERROR =====');
      console.error('[Settings] Error object:', err);
      console.error('[Settings] Error message:', err.message);
      console.error('[Settings] Error stack:', err.stack);
      console.error('[Settings] Error response:', err.response);
      console.error('[Settings] Error response data:', err.response?.data);
      console.error('[Settings] Error response status:', err.response?.status);
      console.error('[Settings] ===== END ERROR =====');
      
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || t('settings.settingsFailed');
      setError(errorMessage);
    } finally {
      setSaving(false);
      console.log('[Settings] Save operation completed, saving state set to false');
    }
  };

  const handleTestPrint = async () => {
    try {
      if (!selectedPrinter) {
        alert('Please select a printer first');
        return;
      }

      // Generate test print content
      const ESC = '\x1B';
      const GS = '\x1D';
      let commands = '';

      commands += ESC + '@'; // Initialize
      commands += ESC + 'a' + '\x01'; // Center align
      commands += ESC + '!' + '\x18'; // Double height and width
      commands += 'HISAABKITAB\n';
      commands += ESC + '!' + '\x00'; // Normal size
      commands += 'POS & Inventory\n';
      commands += '----------------\n\n';
      commands += ESC + 'a' + '\x00'; // Left align
      commands += 'TEST PRINT\n';
      commands += `Date: ${new Date().toLocaleString()}\n`;
      commands += `Shop: ${shopName || 'My Shop'}\n\n`;
      commands += 'This is a test print.\n';
      commands += 'If you can read this, your printer is configured correctly!\n\n';
      commands += ESC + 'a' + '\x01'; // Center align
      commands += 'Thank you!\n\n\n';
      commands += GS + 'V' + '\x41' + '\x03'; // Cut paper

      if (window.electronAPI && window.electronAPI.printRaw) {
        const result = await window.electronAPI.printRaw(selectedPrinter, commands);
        if (result.success) {
          alert('Test print sent successfully!');
        } else {
          alert('Print failed: ' + (result.error || 'Unknown error'));
        }
      } else {
        alert('Printer API not available. Opening print dialog...');
        // Fallback to browser print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head><title>Test Print</title></head>
              <body style="font-family: monospace; padding: 20px;">
                <h2>HISAABKITAB</h2>
                <p>POS & Inventory</p>
                <hr>
                <p><strong>TEST PRINT</strong></p>
                <p>Date: ${new Date().toLocaleString()}</p>
                <p>Shop: ${shopName || 'My Shop'}</p>
                <p>This is a test print.</p>
                <p>If you can read this, your printer is configured correctly!</p>
                <hr>
                <p>Thank you!</p>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (err) {
      console.error('Error in test print:', err);
      alert('Test print failed: ' + err.message);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupCreating(true);
      setError(null);
      
      const response = await backupAPI.create();
      
      if (response.data.success) {
        // Create download link
        const blob = new Blob([response.data.data], { type: 'application/sql' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setSuccess(`Backup created successfully! File: ${response.data.filename}`);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      setError(err.response?.data?.error || 'Failed to create backup');
    } finally {
      setBackupCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading">{t('common.loading')} {t('settings.title').toLowerCase()}...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* License Activation Section */}
      <div className="card">
        <div className="card-header">
          <h2>🔒 {t('settings.licenseActivation')}</h2>
        </div>
        <div className="settings-form">
          {isActivated ? (
            <div className="license-status-activated">
              <div className="license-status-icon">✅</div>
              <div className="license-status-content">
                <h3>{t('settings.softwareActivated')}</h3>
                <p>{t('settings.licenseActive')}</p>
                {licenseInfo && (
                  <div className="license-info">
                    {licenseInfo.tenantId && (
                      <p><strong>{t('settings.tenant')}:</strong> {licenseInfo.tenantId}</p>
                    )}
                    {licenseInfo.licenseId && (
                      <p><strong>{t('settings.licenseId')}:</strong> {licenseInfo.licenseId}</p>
                    )}
                  </div>
                )}
                <div style={{ marginTop: '15px' }}>
                  <button
                    type="button"
                    onClick={handleRevalidateLicense}
                    disabled={revalidating}
                    className="btn btn-secondary"
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    {revalidating ? t('settings.checking') : t('settings.checkLicenseStatus')}
                  </button>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    {t('settings.checkLicenseDesc')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="license-activation-section">
              <div className="license-status-unactivated">
                <div className="license-status-icon">⚠️</div>
                <div className="license-status-content">
                  <h3>{t('settings.softwareNotActivated')}</h3>
                  <p>{t('settings.pleaseActivate')}</p>
                </div>
              </div>
              <div className="license-activation-form-wrapper">
                <LicenseActivation 
                  onActivationSuccess={async () => {
                    await checkLicenseStatus();
                  }}
                  embedded={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shop Settings */}
      <div className="card">
        <div className="card-header">
          <h2>{t('settings.shopInformation')}</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">{t('settings.shopName')}</label>
            <input
              type="text"
              className="form-input"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder={t('settings.enterShopName')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('settings.shopAddress')}</label>
            <textarea
              className="form-input"
              rows="3"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              placeholder={t('settings.enterShopAddress')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('settings.shopPhone')}</label>
            <input
              type="text"
              className="form-input"
              value={shopPhone}
              onChange={(e) => setShopPhone(e.target.value)}
              placeholder={t('settings.enterShopPhone')}
            />
          </div>
        </div>
      </div>

      {/* Language & Theme */}
      <div className="card">
        <div className="card-header">
          <h2>{t('settings.languageAppearance')}</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">{t('settings.language')}</label>
            <select
              className="form-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={readOnly}
            >
              <option value="en">English</option>
              <option value="ur">Urdu (اردو)</option>
            </select>
            <small className="form-help">
              {t('settings.selectLanguage')}
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">{t('settings.theme')}</label>
            <select
              className="form-input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={readOnly}
            >
              <option value="light">Light Mode</option>
            </select>
            <small className="form-help">
              {t('settings.appTheme')}
            </small>
          </div>
        </div>
      </div>

      {/* Printer Configuration */}
      {!readOnly && (
        <div className="card">
          <div className="card-header">
            <h2>{t('settings.printerConfiguration')}</h2>
          </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">{t('settings.selectPrinter')}</label>
            <select
              className="form-input"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option value="">-- {t('settings.selectPrinter')} --</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer.name}>
                  {printer.name} {printer.description ? `- ${printer.description}` : ''}
                </option>
              ))}
            </select>
            <small className="form-help">
              {t('settings.selectThermalPrinter')}
            </small>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={handleTestPrint}
              disabled={!selectedPrinter}
            >
              {t('settings.testPrint')}
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Data Safety & Backup */}
      {!readOnly && (
        <div className="card">
          <div className="card-header">
            <h2>💾 {t('backup.title')}</h2>
          </div>
          <div className="settings-form">
            {/* Enable Auto Backup */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={backupSettings.enabled}
                  onChange={(e) => handleBackupSettingsChange({ enabled: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                {t('backup.enableAutoBackup')}
              </label>
              <small className="form-help">
                {t('backup.enableAutoBackupDesc')}
              </small>
            </div>

            {backupSettings.enabled && (
              <>
                {/* Backup Mode */}
                <div className="form-group">
                  <label className="form-label">{t('backup.backupMode')}</label>
                  <select
                    className="form-input"
                    value={backupSettings.mode}
                    onChange={(e) => handleBackupSettingsChange({ mode: e.target.value })}
                  >
                    <option value="app_start">{t('backup.modeAppStart')}</option>
                    <option value="scheduled">{t('backup.modeScheduled')}</option>
                  </select>
                  <small className="form-help">
                    {t('backup.backupModeDesc')}
                  </small>
                </div>

                {/* Scheduled Time (only if mode is scheduled) */}
                {backupSettings.mode === 'scheduled' && (
                  <div className="form-group">
                    <label className="form-label">{t('backup.scheduledTime')}</label>
                    <input
                      type="time"
                      className="form-input"
                      value={backupSettings.scheduledTime}
                      onChange={(e) => handleBackupSettingsChange({ scheduledTime: e.target.value })}
                      style={{ maxWidth: '200px' }}
                    />
                    <small className="form-help">
                      {t('backup.scheduledTimeDesc')}
                    </small>
                  </div>
                )}

                {/* Backup Location */}
                <div className="form-group">
                  <label className="form-label">{t('backup.backupLocation')}</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={backupSettings.backupDir || 'Not configured'}
                      readOnly
                      style={{ flex: 1 }}
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={async () => {
                        if (window.electronAPI && window.electronAPI.selectDirectory) {
                          try {
                            const dir = await window.electronAPI.selectDirectory();
                            if (dir) {
                              await handleBackupSettingsChange({ backupDir: dir });
                            }
                          } catch (err) {
                            setError('Failed to select directory');
                          }
                        } else {
                          setError('Directory selection not available in web mode');
                        }
                      }}
                    >
                      {t('backup.change')}
                    </button>
                  </div>
                  <small className="form-help">
                    {t('backup.backupLocationDesc')}
                  </small>
                </div>

                {/* Retention Count */}
                <div className="form-group">
                  <label className="form-label">{t('backup.retention')}</label>
                  <select
                    className="form-input"
                    value={backupSettings.retentionCount}
                    onChange={(e) => handleBackupSettingsChange({ retentionCount: parseInt(e.target.value) })}
                    style={{ maxWidth: '200px' }}
                  >
                    <option value="3">{t('backup.retention3')}</option>
                    <option value="5">{t('backup.retention5')}</option>
                    <option value="7">{t('backup.retention7')}</option>
                    <option value="10">{t('backup.retention10')}</option>
                  </select>
                  <small className="form-help">
                    {t('backup.retentionDesc')}
                  </small>
                </div>
              </>
            )}

            {/* Last Backup Status */}
            <div className="form-group">
              <label className="form-label">{t('backup.lastBackupStatus')}</label>
              {backupStatus && backupStatus.exists ? (
                <div style={{ padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0369a1' }}>✅ {t('backup.lastBackupSuccess')}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {t('backup.lastBackupDate')}: {backupStatus.date ? new Date(backupStatus.date).toLocaleString() : 'Unknown'}
                      </div>
                      {backupStatus.filename && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {t('backup.lastBackupFile')}: {backupStatus.filename}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                      {t('backup.statusOk')}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fcd34d' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#92400e' }}>⚠️ {t('backup.noBackupFound')}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {t('backup.noBackupDesc')}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>
                      {t('backup.statusWarning')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Backup Button */}
            <div className="form-group">
              <button
                className="btn btn-secondary"
                onClick={async () => {
                  try {
                    setBackupCreating(true);
                    setError(null);
                    const response = await backupAPI.create();
                    if (response.data.success) {
                      setSuccess(t('backup.backupCreated', { filename: response.data.filename }));
                      setTimeout(() => setSuccess(null), 5000);
                      await fetchBackupStatus();
                    }
                  } catch (err) {
                    console.error('Error creating backup:', err);
                    setError(err.response?.data?.error || t('backup.backupFailed'));
                  } finally {
                    setBackupCreating(false);
                  }
                }}
                disabled={backupCreating}
              >
                {backupCreating ? t('backup.creating') : `💾 ${t('backup.createManual')}`}
              </button>
              <small className="form-help">
                {t('backup.createManualDesc')}
              </small>
            </div>

            {/* Restore Button */}
            <div className="form-group">
              <button
                className="btn btn-danger"
                onClick={handleRestore}
                disabled={restoring || !backupStatus?.exists}
                style={{ background: '#dc2626', color: 'white' }}
              >
                {restoring ? t('backup.restoring') : `🔄 ${t('backup.restore')}`}
              </button>
              <small className="form-help" style={{ color: '#dc2626' }}>
                {t('backup.restoreDesc')}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {!readOnly && (
        <div className="settings-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('settings.saving') : t('settings.saveSettings')}
          </button>
        </div>
      )}
      {readOnly && (
        <div className="settings-actions">
          <div className="read-only-notice">{t('settings.readOnlyNotice')}</div>
        </div>
      )}
    </div>
  );
};

export default Settings;
