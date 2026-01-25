# Code Signing Setup Guide

## Overview
This guide explains how to set up code signing for the HisaabKitab Windows installer.

## Why Code Signing?
Code signing provides:
- **Security**: Users can verify the installer is authentic and hasn't been tampered with
- **Trust**: Windows shows "Verified Publisher" instead of "Unknown Publisher"
- **User Experience**: Reduces security warnings during installation

## Prerequisites

### 1. Obtain a Code Signing Certificate

You have two options:

#### Option A: Commercial Certificate (Recommended for Production)
- Purchase from trusted Certificate Authorities:
  - **DigiCert** - https://www.digicert.com/code-signing/
  - **Sectigo** - https://sectigo.com/ssl-certificates-tls/code-signing
  - **GlobalSign** - https://www.globalsign.com/en/code-signing-certificate
- Cost: ~$200-500/year
- Provides highest trust level

#### Option B: Self-Signed Certificate (Testing Only)
- Can be created for testing, but Windows will show warnings
- Not recommended for distribution

### 2. Install Windows SDK

Download and install Windows SDK:
- https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
- Make sure to install "Windows SDK Signing Tools"

## Setup Instructions

### Step 1: Prepare Certificate File

1. Export your certificate as a `.pfx` file (if you have a `.p12`, rename it to `.pfx`)
2. Place it in a secure location (e.g., `certificates/hisaabkitab.pfx`)
3. **Important**: Never commit certificate files to Git!

### Step 2: Set Environment Variables

#### Windows (PowerShell):
```powershell
$env:CERT_FILE = "E:\Certificates\hisaabkitab.pfx"
$env:CERT_PASSWORD = "YourCertificatePassword"
```

#### Windows (Command Prompt):
```cmd
set CERT_FILE=E:\Certificates\hisaabkitab.pfx
set CERT_PASSWORD=YourCertificatePassword
```

#### For Permanent Setup (Windows):
1. Open System Properties → Environment Variables
2. Add `CERT_FILE` and `CERT_PASSWORD` as system/user variables

### Step 3: Build and Sign

```bash
npm run build
```

The build process will automatically:
1. Package the app into ASAR
2. Create the installer
3. Sign the installer (if certificate is configured)

**Note**: If certificate is not configured, the build will complete successfully without signing. The installer will work but may show "Unknown Publisher" warning.

### Step 4: Verify Signature

After building, verify the signature:

```powershell
signtool verify /pa dist\HisaabKitab-Setup.exe
```

You should see:
```
Successfully verified: dist\HisaabKitab-Setup.exe
```

## Configuration Files

### package.json
The build configuration includes:
- `asar: true` - Packages code into ASAR archive
- `sign: "scripts/sign.js"` - Custom signing script (runs after installer creation)
- `publisherName: "HisaabKitab"` - Publisher name for installer

**Note**: Certificate file and password are NOT in package.json - they come from environment variables for security.

### scripts/sign.js
Custom signing script that:
- Checks for certificate file (gracefully skips if not found)
- Uses Windows SDK's `signtool.exe`
- Signs the installer with SHA-256
- Adds timestamp for long-term validity
- Verifies signature after signing
- **Does not fail the build** if signing fails (allows unsigned builds for testing)

## Troubleshooting

### "signtool.exe not found"
- Install Windows SDK
- Add SDK bin directory to PATH
- Or update `sign.js` with correct SDK path

### "Certificate file not found"
- Check `CERT_FILE` environment variable
- Verify file path is correct
- Ensure file exists and is readable

### "Invalid certificate password"
- Verify `CERT_PASSWORD` is correct
- Check for special characters (may need quotes in some shells)

### "Timestamp server unreachable"
- The script uses DigiCert's timestamp server
- If it fails, the installer will still be signed but may expire with the certificate
- Alternative timestamp servers:
  - `http://timestamp.comodoca.com`
  - `http://timestamp.verisign.com/scripts/timstamp.dll`

## Security Best Practices

1. **Never commit certificates to Git**
   - Add `*.pfx`, `*.p12`, `*.cer` to `.gitignore`
   - Store certificates securely (password manager, encrypted drive)

2. **Use environment variables**
   - Don't hardcode passwords
   - Use CI/CD secrets for automated builds

3. **Protect certificate files**
   - Limit access to certificate files
   - Use strong passwords
   - Consider hardware security modules (HSM) for production

4. **Rotate certificates**
   - Renew before expiration
   - Keep old certificates for verifying old installers

## Testing Without Certificate

To build without signing (for testing):
1. Don't set `CERT_FILE` environment variable
2. Or comment out signing in `package.json`
3. Build will complete but installer won't be signed

## Next Steps

1. Obtain a code signing certificate
2. Set up environment variables
3. Test the build process
4. Verify the signed installer
5. Distribute the signed installer

---

**Note**: Code signing is optional but highly recommended for production releases.

