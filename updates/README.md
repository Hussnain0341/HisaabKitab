# Update Server Structure

This directory structure should be replicated on your update server (VPS, S3, Azure Blob, etc.).

## Server Folder Structure

```
/updates/
  /windows/
    latest.yml
    HisaabKitab-Setup-1.0.0.exe
    HisaabKitab-Setup-1.0.1.exe
    HisaabKitab-Setup-1.0.2.exe
    ...
```

## latest.yml Format

The `latest.yml` file tells electron-updater which version is latest and where to download it.

Example `latest.yml`:
```yaml
version: 1.0.2
releaseDate: '2026-01-26T10:00:00.000Z'
path: HisaabKitab-Setup-1.0.2.exe
sha512: abc123def456... (checksum for verification)
size: 125829120
```

## How to Generate latest.yml

After building your installer with `npm run build:electron`, electron-builder automatically generates `latest.yml` in the `dist` folder.

Simply copy:
1. The installer `.exe` file
2. The `latest.yml` file

To your update server's `/updates/windows/` directory.

## Update Server Setup Options

### Option 1: Static File Server (VPS/Nginx)
- Upload files to `/var/www/updates/windows/`
- Configure Nginx to serve static files
- Set CORS headers if needed

### Option 2: AWS S3
- Create S3 bucket: `hisaabkitab-updates`
- Upload files to `s3://hisaabkitab-updates/windows/`
- Enable public read access
- Use S3 URL: `https://hisaabkitab-updates.s3.amazonaws.com/windows/`

### Option 3: Azure Blob Storage
- Create storage account and container
- Upload files to container
- Enable public access
- Use blob URL: `https://{account}.blob.core.windows.net/{container}/windows/`

## Security

1. **Digital Signing**: All installers must be digitally signed (already configured)
2. **Checksum Verification**: electron-updater verifies SHA512 checksums
3. **HTTPS Only**: Always use HTTPS for update server
4. **Version Validation**: App only accepts newer versions

## Testing Updates

1. Build new version: `npm run build:electron`
2. Upload to test server
3. Update `UPDATE_SERVER_URL` in `.env` for testing
4. Restart app and check for updates

## Rollback Support

To enable rollback:
1. Keep previous stable versions on server
2. If update fails, user can manually download previous version
3. Or implement automatic rollback (future enhancement)

