import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { settingsAPI, backupAPI } from '../services/api';
import './Settings.css';

const Settings = ({ readOnly = false }) => {
  const { i18n } = useTranslation();
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

  useEffect(() => {
    fetchSettings();
    fetchPrinters();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      const data = response.data;
      setSettings(data);
      
      // Parse settings
      if (data.other_app_settings) {
        const otherSettings = typeof data.other_app_settings === 'string' 
          ? JSON.parse(data.other_app_settings) 
          : data.other_app_settings;
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
        setSelectedPrinter(printerConfig.printerName || '');
      }
      
      // Set language
      if (data.language) {
        setLanguage(data.language);
        i18n.changeLanguage(data.language);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const printerConfig = selectedPrinter ? {
        printerName: selectedPrinter,
      } : null;

      const otherAppSettings = {
        shop_name: shopName,
        shop_address: shopAddress,
        shop_phone: shopPhone,
        theme: theme,
      };

      await settingsAPI.update({
        printer_config: printerConfig ? JSON.stringify(printerConfig) : null,
        language: language,
        other_app_settings: otherAppSettings,
      });
      
      // Update language if changed
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }

      setSuccess('Settings saved successfully!');
      
      // Also save to Electron store for quick access
      if (window.electronAPI && window.electronAPI.setStoreValue) {
        await window.electronAPI.setStoreValue('printerName', selectedPrinter);
        await window.electronAPI.setStoreValue('shopName', shopName);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
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
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your shop settings and preferences</p>
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

      {/* Shop Settings */}
      <div className="card">
        <div className="card-header">
          <h2>Shop Information</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Shop Name</label>
            <input
              type="text"
              className="form-input"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Enter shop name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shop Address</label>
            <textarea
              className="form-input"
              rows="3"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              placeholder="Enter shop address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shop Phone</label>
            <input
              type="text"
              className="form-input"
              value={shopPhone}
              onChange={(e) => setShopPhone(e.target.value)}
              placeholder="Enter shop phone number"
            />
          </div>
        </div>
      </div>

      {/* Language & Theme */}
      <div className="card">
        <div className="card-header">
          <h2>Language & Appearance</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Language</label>
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
              Select your preferred language
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Theme</label>
            <select
              className="form-input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={readOnly}
            >
              <option value="light">Light Mode</option>
            </select>
            <small className="form-help">
              App theme (Dark mode coming soon)
            </small>
          </div>
        </div>
      </div>

      {/* Printer Configuration */}
      {!readOnly && (
        <div className="card">
          <div className="card-header">
            <h2>Printer Configuration</h2>
          </div>
        <div className="settings-form">
          <div className="form-group">
            <label className="form-label">Select Printer</label>
            <select
              className="form-input"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
            >
              <option value="">-- Select Printer --</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer.name}>
                  {printer.name} {printer.description ? `- ${printer.description}` : ''}
                </option>
              ))}
            </select>
            <small className="form-help">
              Select the thermal printer for invoice printing
            </small>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={handleTestPrint}
              disabled={!selectedPrinter}
            >
              🖨️ Test Print
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Backup & Restore */}
      {!readOnly && (
        <div className="card">
          <div className="card-header">
            <h2>Backup & Restore</h2>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label className="form-label">Database Backup</label>
              <p className="form-description">
                Create a manual backup of your database. This will export all your data to a SQL file.
              </p>
              <button
                className="btn btn-secondary"
                onClick={handleBackup}
                disabled={backupCreating}
              >
                {backupCreating ? 'Creating Backup...' : '💾 Create Backup'}
              </button>
              <small className="form-help">
                Backups are saved locally. Restore functionality coming soon.
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
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      )}
      {readOnly && (
        <div className="settings-actions">
          <div className="read-only-notice">Read-only mode: Settings cannot be modified on client PCs</div>
        </div>
      )}
    </div>
  );
};

export default Settings;
