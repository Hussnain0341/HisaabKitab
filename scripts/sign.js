/**
 * Post-Build Code Signing Script for Windows Installer
 * 
 * This script signs the installer AFTER electron-builder creates it.
 * Run this manually after building if you have a certificate.
 * 
 * Usage:
 *   npm run build:electron
 *   npm run sign:installer dist\HisaabKitab-Setup.exe
 * 
 * Or use the combined command:
 *   npm run build:signed
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get installer path from command line arguments or find it automatically
let installerPath = process.argv[2];

// If no path provided, try to find the installer automatically
if (!installerPath) {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Look for NSIS installer
  const possibleNames = [
    'HisaabKitab-Setup.exe',
    'hisaabkitab-Setup.exe',
    'HisaabKitab Setup.exe'
  ];
  
  for (const name of possibleNames) {
    const fullPath = path.join(distPath, name);
    if (fs.existsSync(fullPath)) {
      installerPath = fullPath;
      break;
    }
  }
  
  // If still not found, look for any .exe file in dist
  if (!installerPath && fs.existsSync(distPath)) {
    try {
      const files = fs.readdirSync(distPath);
      const exeFile = files.find(f => f.endsWith('.exe') && (f.includes('Setup') || f.includes('Installer')));
      if (exeFile) {
        installerPath = path.join(distPath, exeFile);
      }
    } catch (e) {
      // dist folder might not exist or be readable
    }
  }
}

if (!installerPath || !fs.existsSync(installerPath)) {
  console.warn('⚠️  Installer file not found.');
  console.warn('   Usage: node scripts/sign.js [path-to-installer.exe]');
  console.warn('   Or run: npm run sign:installer dist\\HisaabKitab-Setup.exe');
  process.exit(0);
}

const certFile = process.env.CERT_FILE;
const certPassword = process.env.CERT_PASSWORD;

// Skip signing if certificate is not configured
if (!certFile || !fs.existsSync(certFile)) {
  console.warn('⚠️  Code signing certificate not found. Skipping code signing.');
  console.warn('   To enable code signing:');
  console.warn('   1. Set CERT_FILE environment variable to your .pfx certificate path');
  console.warn('   2. Set CERT_PASSWORD environment variable to your certificate password');
  console.warn('   3. Ensure Windows SDK is installed (for signtool.exe)');
  console.warn('');
  console.warn('   Example:');
  console.warn('   $env:CERT_FILE = "E:\\Certificates\\hisaabkitab.pfx"');
  console.warn('   $env:CERT_PASSWORD = "YourPassword"');
  console.warn('   npm run sign:installer');
  process.exit(0);
}

if (!certPassword) {
  console.warn('⚠️  Certificate password not provided. Skipping code signing.');
  console.warn('   Set CERT_PASSWORD environment variable to enable code signing.');
  process.exit(0);
}

try {
  console.log('🔐 Signing installer:', installerPath);
  console.log('📝 Certificate file:', certFile);
  
  // Find signtool.exe (Windows SDK)
  const signToolPaths = [
    path.join(process.env['ProgramFiles(x86)'] || '', 'Windows Kits', '10', 'bin', '10.0.22621.0', 'x64', 'signtool.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'Windows Kits', '10', 'bin', '10.0.19041.0', 'x64', 'signtool.exe'),
    path.join(process.env['ProgramFiles'] || '', 'Windows Kits', '10', 'bin', '10.0.22621.0', 'x64', 'signtool.exe'),
    path.join(process.env['ProgramFiles'] || '', 'Windows Kits', '10', 'bin', '10.0.19041.0', 'x64', 'signtool.exe'),
    'signtool.exe' // Fallback to PATH
  ];

  let signTool = null;
  for (const toolPath of signToolPaths) {
    if (fs.existsSync(toolPath)) {
      signTool = toolPath;
      break;
    }
  }

  // Try to find signtool in PATH
  if (!signTool) {
    try {
      execSync('where signtool', { stdio: 'ignore' });
      signTool = 'signtool';
    } catch (e) {
      console.error('❌ signtool.exe not found. Please install Windows SDK.');
      console.error('   Download from: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/');
      console.error('   Make sure to install "Windows SDK Signing Tools"');
      process.exit(0); // Exit gracefully, don't fail
    }
  }

  // Sign the installer
  const timestampServers = [
    'http://timestamp.digicert.com',
    'http://timestamp.comodoca.com',
    'http://timestamp.verisign.com/scripts/timstamp.dll'
  ];

  let signed = false;
  for (const timestampServer of timestampServers) {
    try {
      const signCommand = `"${signTool}" sign /f "${certFile}" /p "${certPassword}" /t ${timestampServer} /fd sha256 "${installerPath}"`;
      
      console.log('📝 Executing:', signCommand.replace(certPassword, '***'));
      execSync(signCommand, { stdio: 'inherit' });
      
      signed = true;
      break;
    } catch (error) {
      console.warn(`⚠️  Failed to sign with ${timestampServer}, trying next server...`);
      if (timestampServer === timestampServers[timestampServers.length - 1]) {
        // Last server failed
        throw error;
      }
    }
  }

  if (signed) {
    console.log('✅ Installer signed successfully!');
    
    // Verify signature
    try {
      console.log('🔍 Verifying signature...');
      execSync(`"${signTool}" verify /pa "${installerPath}"`, { stdio: 'inherit' });
      console.log('✅ Signature verified!');
    } catch (error) {
      console.warn('⚠️  Signature verification failed, but installer was signed.');
    }
  }
} catch (error) {
  console.error('❌ Code signing failed:', error.message);
  console.error('   Build will continue without code signing.');
  console.error('   Installer will work but may show "Unknown Publisher" warning.');
  // Don't fail - exit gracefully
  process.exit(0);
}
