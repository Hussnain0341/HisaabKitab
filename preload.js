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
});
