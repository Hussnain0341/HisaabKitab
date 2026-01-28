/**
 * Update Storage - Local JSON config for update system
 * 
 * NEVER touches PostgreSQL business database
 * Stores only update-related config in local JSON file
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Config file location: %APPDATA%/HisaabKitab/config.json
const CONFIG_DIR = path.join(os.homedir(), 'AppData', 'Local', 'HisaabKitab');
const CONFIG_FILE = path.join(CONFIG_DIR, 'update-config.json');

/**
 * Ensure config file exists with default values
 */
async function ensureConfigFile() {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    
    // Check if file exists
    try {
      await fs.access(CONFIG_FILE);
      // File exists, validate it
      const config = await getConfig();
      return config;
    } catch {
      // File doesn't exist, create default
      // Get version from package.json (relative to project root)
      let appVersion = '1.0.0';
      try {
        const packageJson = require(path.join(__dirname, '../../../package.json'));
        appVersion = packageJson.version || '1.0.0';
      } catch (e) {
        console.warn('[UpdateStorage] Could not read package.json, using default version');
      }
      
      const defaultConfig = {
        version: appVersion,
        lastUpdateCheck: null,
        skippedVersion: null,
        lastUpdateDate: null
      };
      
      await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf8');
      console.log('[UpdateStorage] Created default config file');
      return defaultConfig;
    }
  } catch (error) {
    console.error('[UpdateStorage] Error ensuring config file:', error);
    // Return default config even if file operations fail
    let appVersion = '1.0.0';
    try {
      const packageJson = require(path.join(__dirname, '../../../package.json'));
      appVersion = packageJson.version || '1.0.0';
    } catch (e) {
      // Ignore
    }
    
    return {
      version: appVersion,
      lastUpdateCheck: null,
      skippedVersion: null,
      lastUpdateDate: null
    };
  }
}

/**
 * Get current config
 */
async function getConfig() {
  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf8');
    const config = JSON.parse(content);
    
    // Ensure all required fields exist
    let appVersion = '1.0.0';
    try {
      const packageJson = require(path.join(__dirname, '../../../package.json'));
      appVersion = packageJson.version || '1.0.0';
    } catch (e) {
      // Ignore
    }
    
    return {
      version: config.version || appVersion,
      lastUpdateCheck: config.lastUpdateCheck || null,
      skippedVersion: config.skippedVersion || null,
      lastUpdateDate: config.lastUpdateDate || null
    };
  } catch (error) {
    console.error('[UpdateStorage] Error reading config:', error);
    // Return default config
    return {
      version: require('../../../package.json').version,
      lastUpdateCheck: null,
      skippedVersion: null,
      lastUpdateDate: null
    };
  }
}

/**
 * Update last check timestamp
 */
async function updateLastCheck() {
  try {
    const config = await getConfig();
    config.lastUpdateCheck = new Date().toISOString();
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('[UpdateStorage] Error updating last check:', error);
  }
}

/**
 * Set skipped version
 */
async function setSkippedVersion(version) {
  try {
    const config = await getConfig();
    config.skippedVersion = version;
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('[UpdateStorage] Error setting skipped version:', error);
  }
}

/**
 * Clear skipped version (when new update is available)
 */
async function clearSkippedVersion() {
  try {
    const config = await getConfig();
    config.skippedVersion = null;
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('[UpdateStorage] Error clearing skipped version:', error);
  }
}

/**
 * Update version after successful installation
 */
async function updateVersion(newVersion) {
  try {
    const config = await getConfig();
    config.version = newVersion;
    config.lastUpdateDate = new Date().toISOString();
    config.skippedVersion = null; // Clear skipped version
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('[UpdateStorage] Error updating version:', error);
  }
}

module.exports = {
  ensureConfigFile,
  getConfig,
  updateLastCheck,
  setSkippedVersion,
  clearSkippedVersion,
  updateVersion,
  CONFIG_FILE
};

