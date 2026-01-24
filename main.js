const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Start backend Express server using the actual backend/server.js
// Note: In development, you may want to start backend manually to avoid conflicts
function startBackend() {
  const backendPath = path.join(__dirname, 'backend', 'server.js');
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check if backend is already running by testing the health endpoint
  const http = require('http');
  const healthCheck = http.get('http://localhost:5000/api/health', (res) => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log('[Backend] Backend server is already running on port 5000');
      console.log('[Backend] Using existing backend server (started manually)');
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
    });

    backendProcess.on('exit', (code) => {
      if (code !== null && code !== 0) {
        console.error(`Backend server exited with code ${code}`);
      }
    });
  });
  
  // Set timeout for health check
  healthCheck.setTimeout(1000, () => {
    healthCheck.destroy();
    // Timeout means backend not running, but we'll let spawn handle it
    console.log('[Backend] Health check timeout - backend may not be running yet');
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
      webSecurity: true
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

app.whenReady().then(() => {
  // Start backend server
  startBackend();
  
  // Create main window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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
