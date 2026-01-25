# ASAR Packaging Configuration

## Overview
ASAR (Atom Shell Archive) is Electron's archive format that packages application code into a single file, making it harder to access source code directly.

## Current Configuration

### package.json
```json
{
  "build": {
    "asar": true,
    "asarUnpack": [
      "backend/node_modules/**/*",
      "database/**/*"
    ]
  }
}
```

### What Gets Packaged
- ✅ **Packaged into ASAR** (protected):
  - `frontend/build/**/*` - React app (compiled)
  - `backend/**/*` - Backend code (except node_modules)
  - `main.js`, `preload.js` - Electron main files
  - `assets/**/*` - Icons and resources

- ✅ **Unpacked** (accessible, needed for runtime):
  - `backend/node_modules/**/*` - Native modules must be unpacked
  - `database/**/*` - Database files need direct file system access

## Benefits

1. **Code Protection**: Source code is archived and harder to access
2. **Performance**: Faster file access (single archive vs many files)
3. **Security**: Makes reverse engineering more difficult
4. **Distribution**: Single archive file is easier to manage

## How It Works

1. **Development**: Code runs normally from file system
2. **Build**: `electron-builder` packages code into `app.asar`
3. **Runtime**: Electron reads from `app.asar` transparently

## Accessing ASAR Files

### From Main Process (Node.js):
```javascript
const { app } = require('electron');
const path = require('path');

// ASAR files are accessed normally
const dbPath = path.join(app.getAppPath(), 'database', 'schema.sql');
```

### From Renderer Process:
- Use IPC to request files from main process
- Or use `electron.remote` (if enabled) - **Not recommended**

## Unpacked Files

Files in `asarUnpack` are extracted to:
```
app.asar.unpacked/
  ├── backend/
  │   └── node_modules/
  └── database/
```

These files are accessible via normal file system APIs.

## Verification

After building, check:
```
dist/win-unpacked/
  ├── app.asar (packaged code)
  └── app.asar.unpacked/ (unpacked files)
```

## Security Notes

⚠️ **ASAR is NOT encryption** - it's just an archive format
- Determined users can still extract and read code
- For stronger protection, use code obfuscation (see `docs/CODE_OBFUSCATION.md`)

## Troubleshooting

### "Cannot find module" errors
- Ensure native modules are in `asarUnpack`
- Some modules require direct file system access

### Database access issues
- Database files must be unpacked
- Use absolute paths, not relative paths

### File path issues
- Use `app.getAppPath()` instead of `__dirname` in some cases
- Test file access in packaged app, not just development

## Next Steps

1. ✅ ASAR packaging is configured
2. 🔄 Consider code obfuscation for additional protection
3. 🔄 Implement code signing for installer verification

---

**Status**: ASAR packaging is enabled and configured! ✅

