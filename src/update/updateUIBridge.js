/**
 * Update UI Bridge - IPC communication between main process and renderer
 * 
 * Handles communication between UpdateManager (main) and UpdateNotification (renderer)
 */

const { ipcMain } = require('electron');

class UpdateUIBridge {
  constructor(updateManager) {
    this.updateManager = updateManager;
    this.setupIPC();
  }

  setupIPC() {
    // Handle manual update check request from renderer
    ipcMain.handle('update-check-manual', async () => {
      try {
        const result = await this.updateManager.checkForUpdates();
        return { success: true, ...result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Handle "Update Now" button click
    ipcMain.handle('update-install-now', async (event, updateInfo) => {
      try {
        await this.updateManager.downloadAndInstall(updateInfo);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Handle "Skip/Later" button click
    ipcMain.handle('update-skip', async (event, version) => {
      try {
        await this.updateManager.skipUpdate(version);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Get current app version
    ipcMain.handle('get-app-version', async () => {
      return this.updateManager.currentVersion;
    });

    // Get update status
    ipcMain.handle('get-update-status', async () => {
      return this.updateManager.getStatus();
    });
  }
}

module.exports = UpdateUIBridge;

