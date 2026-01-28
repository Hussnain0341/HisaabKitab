const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const UpdateManager = require('./src/update/UpdateManager');
const UpdateUIBridge = require('./src/update/updateUIBridge');
const packageJson = require('./package.json');

let mainWindow;
let backendProcess;

// Special CLI mode: run database setup and exit (used by installer)
if (process.argv.includes('--setup-db-auto')) {
  console.log('[HisaabKitab] Running automatic database setup (installer mode)...');
  process.env.HK_AUTO_SETUP = '1';
  try {
    // This script will connect to PostgreSQL, create DB if missing,
    // and run database/complete_schema.sql, then exit.
    require('./database/setup.js');
  } catch (err) {
    console.error('[HisaabKitab] Automatic database setup failed:', err);
    process.exit(1);
  }
}

// Wait for backend to be ready by polling health endpoint
function waitForBackend(maxRetries = 30, retryDelay = 1000) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    let attempts = 0;

    const checkHealth = () => {
      attempts++;
      // Use 127.0.0.1 explicitly to avoid IPv6 issues
      const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('[Electron] ✅ Backend server is ready');
            resolve(true);
          } else {
            if (attempts < maxRetries) {
              setTimeout(checkHealth, retryDelay);
            } else {
              reject(new Error('Backend health check failed after maximum retries'));
            }
          }
        });
      });

      req.on('error', (err) => {
        if (attempts < maxRetries) {
          console.log(`[Electron] Waiting for backend... (attempt ${attempts}/${maxRetries})`);
          setTimeout(checkHealth, retryDelay);
        } else {
          reject(new Error(`Backend not responding after ${maxRetries} attempts: ${err.message}`));
        }
      });

      req.setTimeout(2000, () => {
        req.destroy();
        if (attempts < maxRetries) {
          setTimeout(checkHealth, retryDelay);
        } else {
          reject(new Error('Backend health check timeout after maximum retries'));
        }
      });
    };

    checkHealth();
  });
}

// Start backend Express server using the actual backend/server.js
// Returns a promise that resolves when backend is ready
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, 'backend', 'server.js');
    const isDev = process.env.NODE_ENV === 'development';
    const http = require('http');
    
    // Check if backend is already running by testing the health endpoint
    // Use 127.0.0.1 explicitly to avoid IPv6 issues
    const healthCheck = http.get('http://127.0.0.1:5000/api/health', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log('[Backend] Backend server is already running on port 5000');
        console.log('[Backend] Using existing backend server (started manually)');
        resolve(true);
      });
    }).on('error', (err) => {
      // Backend not running, start it
      console.log('[Backend] Starting backend server...');
      
      backendProcess = spawn('node', [backendPath], {
        cwd: path.join(__dirname, 'backend'),
        env: { ...process.env, NODE_ENV: isDev ? 'development' : 'production' },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      // Pipe backend output to Electron console
      backendProcess.stdout.on('data', (data) => {
        console.log(`[Backend] ${data.toString().trim()}`);
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data.toString().trim()}`);
      });

      backendProcess.on('error', (error) => {
        console.error('Failed to start backend server:', error);
        console.error('Make sure you have run: npm install in the backend folder');
        console.error('\n💡 TIP: You can also start backend manually: cd backend && node server.js');
        reject(error);
      });

      backendProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
          console.error(`Backend server exited with code ${code}`);
          reject(new Error(`Backend server exited with code ${code}`));
        }
      });

      // Wait for backend to be ready (with retries)
      setTimeout(() => {
        waitForBackend(30, 1000)
          .then(() => resolve(true))
          .catch((err) => {
            console.error('[Electron] ⚠️ Backend not ready, but continuing anyway:', err.message);
            // Still resolve to allow app to start (backend might be slow)
            resolve(false);
          });
      }, 2000); // Give backend 2 seconds to start before checking
    });
    
    // Set timeout for initial health check
    healthCheck.setTimeout(2000, () => {
      healthCheck.destroy();
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      // Enable ASAR support (default in Electron, but explicit for clarity)
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'HisaabKitab',
    show: false
  });

  // Load the app
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // In development, load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from backend Express server
    mainWindow.loadURL('http://localhost:5000');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Initialize update manager after window is ready
    if (!updateManager) {
      initializeUpdateManager(mainWindow);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Printer
ipcMain.handle('get-printers', async () => {
  try {
    // Use Electron's webContents.printToPDF or dialog.showMessageBox for printer selection
    // For now, we'll return system printers using a workaround
    // Note: Electron doesn't have direct printer list API, we'll use webContents.getPrintersAsync() if available
    // Otherwise, we'll use a mock list and let users select from system print dialog
    
    // Return available printers (this is a simplified implementation)
    // In production, you might want to use a native module or system command
    return {
      printers: [
        { name: 'Default Printer', description: 'System default printer' },
        // Additional printers would be detected here
      ],
      defaultPrinter: 'Default Printer'
    };
  } catch (error) {
    console.error('Error getting printers:', error);
    return { printers: [], defaultPrinter: null };
  }
});

ipcMain.handle('print-raw', async (event, printerName, data) => {
  try {
    // For raw printing, we'll use the system print functionality
    // In a production app, you'd use a native module like 'printer' or 'node-printer'
    // For now, we'll open a print window with formatted content
    
    // Create a hidden window for printing
    const printWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    // Convert ESC/POS commands to HTML for printing
    const htmlContent = convertEscPosToHtml(data);
    
    await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
    
    // Wait for content to load, then print
    await new Promise(resolve => setTimeout(resolve, 500));
    
    printWindow.webContents.print({ silent: false, printBackground: false }, (success, errorType) => {
      if (!success) {
        console.error('Print failed:', errorType);
      }
      printWindow.close();
    });

    return { success: true };
  } catch (error) {
    console.error('Error printing:', error);
    return { success: false, error: error.message };
  }
});

// Helper function to convert ESC/POS to HTML
function convertEscPosToHtml(escPosData) {
  // This is a simplified conversion - ESC/POS commands are converted to HTML
  // For thermal printers, you'd typically send raw commands directly
  // But for preview/testing, we convert to HTML
  
  let html = escPosData
    .replace(/\x1B\[@/g, '') // Initialize
    .replace(/\x1B\[a\x01/g, '<div style="text-align: center;">') // Center align
    .replace(/\x1B\[a\x00/g, '</div><div style="text-align: left;">') // Left align
    .replace(/\x1B\[!\x18/g, '<span style="font-size: 2em; font-weight: bold;">') // Double size
    .replace(/\x1B\[!\x00/g, '</span>') // Normal size
    .replace(/\x1B\[!\x08/g, '<strong>') // Bold
    .replace(/\x1DV\x41\x03/g, ''); // Cut paper

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            padding: 20px;
            max-width: 300px;
            margin: 0 auto;
          }
          .header { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
          .line { border-bottom: 1px solid #000; margin: 10px 0; }
        </style>
      </head>
      <body>
        ${html.replace(/\n/g, '<br>')}
      </body>
    </html>
  `;
}

// Store handlers for settings (simple key-value store)
const store = new Map();

ipcMain.handle('set-store-value', async (event, key, value) => {
  store.set(key, value);
  return { success: true };
});

ipcMain.handle('get-store-value', async (event, key) => {
  return store.get(key) || null;
});

// Directory selection handler for backup location
ipcMain.handle('select-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Backup Directory'
    });
    
    if (result.canceled) {
      return null;
    }
    
    return result.filePaths[0] || null;
  } catch (error) {
    console.error('Error selecting directory:', error);
    return null;
  }
});

// ============================================
// CUSTOM UPDATE MANAGER CONFIGURATION
// ============================================

let updateManager = null;
let updateUIBridge = null;

// Initialize update manager after window is created
function initializeUpdateManager(window) {
  try {
    updateManager = new UpdateManager({
      apiBaseUrl: 'https://api.zentryasolutions.com',
      currentVersion: packageJson.version,
      platform: 'windows',
      checkInterval: 24 * 60 * 60 * 1000, // 24 hours
      mainWindow: window,
      onUpdateAvailable: (updateInfo) => {
        console.log(`[UpdateManager] Update available: ${updateInfo.version}`);
      },
      onDownloadProgress: (progress, downloaded, total) => {
        console.log(`[UpdateManager] Download: ${progress.toFixed(1)}%`);
      },
      onUpdateError: (error) => {
        console.error('[UpdateManager] Update error:', error);
      }
    });
    
    // Initialize update manager (starts checking for updates)
    updateManager.initialize().catch(err => {
      console.error('[UpdateManager] Initialization error:', err);
      // Silent failure - POS continues normally
    });
    
    // Setup IPC bridge
    updateUIBridge = new UpdateUIBridge(updateManager);
    
    console.log('[UpdateManager] Initialized successfully');
  } catch (error) {
    console.error('[UpdateManager] Failed to initialize:', error);
    // Never crash app - continue silently
  }
}

app.whenReady().then(async () => {
  try {
    // Start backend server and wait for it to be ready
    console.log('[Electron] Starting backend server...');
    await startBackend();
    console.log('[Electron] Backend server is ready, creating window...');
    
    // Create main window after backend is ready
    createWindow();
    
    // Initialize update manager after window is created
    // Update manager will check for updates automatically (5 second delay)
    if (mainWindow) {
      initializeUpdateManager(mainWindow);
    }

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('[Electron] ❌ Failed to start application:', error);
    // Still create window to show error to user
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
