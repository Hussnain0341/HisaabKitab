/**
 * UpdateManager - Custom Update System for HisaabKitab POS
 * Integrates with https://api.zentryasolutions.com/pos-updates/latest
 * 
 * NEVER touches user data or PostgreSQL business database
 * Isolated module - no dependencies on business logic
 */

const https = require('https');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const updateStorage = require('./updateStorage');

class UpdateManager {
  constructor(config) {
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.zentryasolutions.com';
    this.currentVersion = config.currentVersion; // From package.json
    this.platform = config.platform || 'windows';
    this.checkInterval = config.checkInterval || 24 * 60 * 60 * 1000; // 24 hours
    this.onUpdateAvailable = config.onUpdateAvailable || null;
    this.onDownloadProgress = config.onDownloadProgress || null;
    this.onUpdateError = config.onUpdateError || null;
    this.mainWindow = config.mainWindow || null;
    
    // Update state
    this.isChecking = false;
    this.isDownloading = false;
    this.isInstalling = false;
    this.updateInfo = null;
    this.downloadRetries = 0;
    this.maxRetries = 3;
    
    // Temp directory for downloads
    this.tempDir = path.join(os.tmpdir(), 'HisaabKitab-Updates');
  }

  /**
   * Initialize update manager
   * Call this on app startup
   */
  async initialize() {
    try {
      // Ensure temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true });
      
      // Load stored config
      await updateStorage.ensureConfigFile();
      
      // Check for updates immediately (non-blocking)
      setTimeout(() => {
        this.checkForUpdates().catch(err => {
          console.error('[UpdateManager] Initial check failed:', err);
          // Silent failure - POS continues normally
        });
      }, 5000); // 5 second delay after app start
      
      // Schedule periodic checks (every 24 hours)
      setInterval(() => {
        this.checkForUpdates().catch(err => {
          console.error('[UpdateManager] Periodic check failed:', err);
          // Silent failure - POS continues normally
        });
      }, this.checkInterval);
      
      console.log('[UpdateManager] Initialized - checking for updates every 24 hours');
    } catch (error) {
      console.error('[UpdateManager] Initialization error:', error);
      // Never crash app - continue silently
    }
  }

  /**
   * Check for updates from API
   * Returns: { hasUpdate: boolean, updateInfo?: object, error?: string }
   */
  async checkForUpdates() {
    if (this.isChecking) {
      console.log('[UpdateManager] Update check already in progress');
      return { hasUpdate: false };
    }

    this.isChecking = true;
    
    try {
      const url = `${this.apiBaseUrl}/pos-updates/latest?platform=${this.platform}`;
      console.log(`[UpdateManager] Checking for updates: ${url}`);
      
      const updateInfo = await this.fetchWithRetry(url, {
        timeout: 10000, // 10 second timeout
        maxRetries: 3
      });
      
      if (!updateInfo || updateInfo.error) {
        // 404 or error response - no update available
        console.log('[UpdateManager] No update available');
        this.isChecking = false;
        return { hasUpdate: false };
      }
      
      // Compare versions
      const versionComparison = this.compareVersions(updateInfo.version, this.currentVersion);
      
      if (versionComparison > 0) {
        // Check if user skipped this version
        const config = await updateStorage.getConfig();
        if (config.skippedVersion === updateInfo.version) {
          console.log(`[UpdateManager] Version ${updateInfo.version} was skipped by user`);
          this.isChecking = false;
          return { hasUpdate: false, skipped: true };
        }
        
        // Update available!
        console.log(`[UpdateManager] Update available: ${updateInfo.version} (current: ${this.currentVersion})`);
        this.updateInfo = updateInfo;
        
        // Notify UI
        if (this.onUpdateAvailable) {
          this.onUpdateAvailable(updateInfo);
        }
        
        // Send to renderer process
        if (this.mainWindow) {
          this.mainWindow.webContents.send('update-available', {
            version: updateInfo.version,
            downloadUrl: updateInfo.download_url,
            checksum: updateInfo.checksum,
            mandatory: updateInfo.mandatory || false,
            releaseDate: updateInfo.release_date
          });
        }
        
        // If mandatory, start download automatically
        if (updateInfo.mandatory) {
          console.log('[UpdateManager] Mandatory update - starting download...');
          this.downloadAndInstall(updateInfo).catch(err => {
            console.error('[UpdateManager] Mandatory update failed:', err);
            if (this.onUpdateError) {
              this.onUpdateError(err);
            }
          });
        }
        
        this.isChecking = false;
        return { hasUpdate: true, updateInfo };
      }
      
      // No update needed
      console.log('[UpdateManager] Already on latest version');
      this.isChecking = false;
      return { hasUpdate: false };
      
    } catch (error) {
      console.error('[UpdateManager] Update check failed:', error);
      this.isChecking = false;
      
      // Silent failure - POS continues normally
      return { hasUpdate: false, error: error.message };
    }
  }

  /**
   * Fetch with retry logic and timeout
   */
  async fetchWithRetry(url, options = {}) {
    const timeout = options.timeout || 10000;
    const maxRetries = options.maxRetries || 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await Promise.race([
          this.httpGet(url),
          this.timeoutPromise(timeout)
        ]);
        
        return result;
      } catch (error) {
        lastError = error;
        console.log(`[UpdateManager] Attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * HTTP GET request (Node.js compatible)
   */
  httpGet(url) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'HisaabKitab-POS/1.0'
        }
      };
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 404) {
            // No update available
            resolve({ error: 'No live version available', version: null });
            return;
          }
          
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            return;
          }
          
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Timeout promise helper
   */
  timeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Compare semantic versions
   * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  /**
   * Download update file with progress tracking
   */
  async downloadUpdate(updateInfo, progressCallback) {
    if (this.isDownloading) {
      throw new Error('Download already in progress');
    }

    this.isDownloading = true;
    this.downloadRetries = 0;
    
    try {
      const downloadUrl = updateInfo.download_url;
      console.log(`[UpdateManager] Downloading from: ${downloadUrl}`);
      
      // Send download started event
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-download-started', {
          version: updateInfo.version
        });
      }
      
      const fileBuffer = await this.downloadFileWithProgress(
        downloadUrl,
        (progress, downloaded, total) => {
          if (progressCallback) {
            progressCallback(progress, downloaded, total);
          }
          
          // Send progress to renderer
          if (this.mainWindow) {
            this.mainWindow.webContents.send('update-download-progress', {
              percent: progress,
              downloaded,
              total
            });
          }
        }
      );
      
      this.isDownloading = false;
      return fileBuffer;
      
    } catch (error) {
      this.isDownloading = false;
      
      // Retry download if retries remaining
      if (this.downloadRetries < this.maxRetries) {
        this.downloadRetries++;
        console.log(`[UpdateManager] Retrying download (${this.downloadRetries}/${this.maxRetries})...`);
        await this.sleep(2000);
        return this.downloadUpdate(updateInfo, progressCallback);
      }
      
      throw error;
    }
  }

  /**
   * Download file with progress tracking
   */
  downloadFileWithProgress(url, progressCallback) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 300000, // 5 minute timeout for large files
        headers: {
          'User-Agent': 'HisaabKitab-POS/1.0'
        }
      };
      
      const req = client.request(options, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Download failed: HTTP ${res.statusCode}`));
          return;
        }
        
        const contentLength = parseInt(res.headers['content-length'] || '0');
        const chunks = [];
        let receivedLength = 0;
        
        res.on('data', (chunk) => {
          chunks.push(chunk);
          receivedLength += chunk.length;
          
          if (progressCallback && contentLength > 0) {
            const progress = (receivedLength / contentLength) * 100;
            progressCallback(progress, receivedLength, contentLength);
          }
        });
        
        res.on('end', () => {
          // Combine chunks into single buffer
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Download timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Verify SHA256 checksum
   */
  async verifyChecksum(fileBuffer, expectedChecksum) {
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    const calculatedChecksum = hash.digest('hex').toLowerCase();
    const expected = expectedChecksum.toLowerCase();
    
    if (calculatedChecksum !== expected) {
      throw new Error(`Checksum mismatch! Expected: ${expected}, Got: ${calculatedChecksum}`);
    }
    
    console.log('[UpdateManager] ✅ Checksum verified');
    return true;
  }

  /**
   * Save installer to temp location
   */
  async saveInstaller(fileBuffer, filename) {
    await fs.mkdir(this.tempDir, { recursive: true });
    const filePath = path.join(this.tempDir, filename);
    await fs.writeFile(filePath, fileBuffer);
    console.log(`[UpdateManager] Installer saved to: ${filePath}`);
    return filePath;
  }

  /**
   * Extract filename from URL
   */
  extractFilename(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  /**
   * Install update (Windows silent installer)
   */
  async installUpdate(installerPath) {
    if (this.isInstalling) {
      throw new Error('Installation already in progress');
    }

    this.isInstalling = true;
    
    return new Promise((resolve, reject) => {
      console.log(`[UpdateManager] Installing: ${installerPath}`);
      
      // Silent installation flags: /S = silent, /NCRC = skip CRC check
      const installer = spawn(installerPath, ['/S', '/NCRC'], {
        detached: true,
        stdio: 'ignore'
      });
      
      installer.on('close', (code) => {
        this.isInstalling = false;
        if (code === 0) {
          console.log('[UpdateManager] ✅ Installation successful');
          resolve();
        } else {
          reject(new Error(`Installer exited with code ${code}`));
        }
      });
      
      installer.on('error', (error) => {
        this.isInstalling = false;
        reject(error);
      });
      
      // Unref to allow parent process to exit
      installer.unref();
    });
  }

  /**
   * Complete update flow: Download, Verify, Install
   */
  async downloadAndInstall(updateInfo) {
    try {
      // Step 1: Download
      console.log('[UpdateManager] Step 1: Downloading update...');
      const fileBuffer = await this.downloadUpdate(updateInfo, (progress, downloaded, total) => {
        console.log(`[UpdateManager] Download progress: ${progress.toFixed(1)}%`);
      });
      
      // Step 2: Verify checksum
      console.log('[UpdateManager] Step 2: Verifying checksum...');
      await this.verifyChecksum(fileBuffer, updateInfo.checksum);
      
      // Step 3: Save to temp location
      console.log('[UpdateManager] Step 3: Saving installer...');
      const filename = this.extractFilename(updateInfo.download_url);
      const installerPath = await this.saveInstaller(fileBuffer, filename);
      
      // Step 4: Update config
      await updateStorage.updateLastCheck();
      
      // Step 5: Install (will restart app)
      console.log('[UpdateManager] Step 4: Installing update...');
      await this.installUpdate(installerPath);
      
      // Step 6: Quit app (installer will restart it)
      console.log('[UpdateManager] Quitting app for update installation...');
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-installing', {
          version: updateInfo.version
        });
      }
      
      // Give UI time to show message, then quit
      setTimeout(() => {
        const { app } = require('electron');
        app.quit();
      }, 2000);
      
      return { success: true };
      
    } catch (error) {
      console.error('[UpdateManager] Update installation failed:', error);
      
      // Send error to UI
      if (this.mainWindow) {
        this.mainWindow.webContents.send('update-error', {
          message: error.message
        });
      }
      
      if (this.onUpdateError) {
        this.onUpdateError(error);
      }
      
      throw error;
    }
  }

  /**
   * Skip update (user chose "Later")
   */
  async skipUpdate(version) {
    await updateStorage.setSkippedVersion(version);
    console.log(`[UpdateManager] Version ${version} skipped by user`);
  }

  /**
   * Get current update status
   */
  getStatus() {
    return {
      isChecking: this.isChecking,
      isDownloading: this.isDownloading,
      isInstalling: this.isInstalling,
      currentVersion: this.currentVersion,
      updateInfo: this.updateInfo
    };
  }
}

module.exports = UpdateManager;

