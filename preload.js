const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform and version info
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  
  // Printer API
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printRaw: (printerName, data) => ipcRenderer.invoke('print-raw', printerName, data),
  
  // Settings/storage API (optional, for local storage of printer settings)
  setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
  
  // Directory selection API for backup location
  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  // ============================
  // Update system API (custom)
  // ============================

  // Manual update check (from Settings/hidden menu)
  checkForUpdatesManual: () => ipcRenderer.invoke('update-check-manual'),

  // Trigger install of the currently available update
  installUpdateNow: (updateInfo) => ipcRenderer.invoke('update-install-now', updateInfo),

  // Skip a specific version (optional updates only)
  skipUpdateVersion: (version) => ipcRenderer.invoke('update-skip', version),

  // Get update status/state from main process
  getUpdateStatus: () => ipcRenderer.invoke('get-update-status'),

  // Subscribe to update events from main process
  onUpdateEvent: (channel, listener) => {
    const validChannels = [
      'update-available',
      'update-download-started',
      'update-download-progress',
      'update-installing',
      'update-error',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, listener);
    }
  },

  // Unsubscribe from update events
  removeUpdateListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },
});
