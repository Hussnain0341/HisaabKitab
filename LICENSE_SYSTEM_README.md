# License System Documentation

## Overview

The HisaabKitab POS application includes a comprehensive license activation and enforcement system that ensures the application can only be used with a valid license from the admin panel.

## Architecture

### Components

1. **License Activation UI** (`frontend/src/components/LicenseActivation.js`)
   - Mandatory activation screen shown on first launch
   - Appears when license expires, is revoked, or validation fails
   - No skip button - activation is required

2. **License Service** (`frontend/src/services/licenseService.js`)
   - Handles all license-related API calls
   - Validates license with external server
   - Manages license status checks

3. **Device Fingerprinting** (`frontend/src/utils/deviceFingerprint.js` & `backend/utils/deviceFingerprint.js`)
   - Generates unique device identifier
   - Binds license to specific device
   - Prevents license sharing

4. **License Storage** (`backend/utils/licenseStorage.js`)
   - Encrypted local storage of license data
   - Secure database storage
   - Grace period management (7 days offline)

5. **License Middleware** (`backend/middleware/licenseMiddleware.js`)
   - Protects all API routes
   - Feature enforcement
   - User limit checking

6. **License API** (`backend/routes/license.js`)
   - `/api/license/validate` - Validate license with external server
   - `/api/license/status` - Get current license status
   - `/api/license/revalidate` - Periodic revalidation

## Setup Instructions

### 1. Database Migration

Run the license system migration:

```bash
cd backend
node scripts/run-license-migration.js
```

This creates:
- `license_info` table (stores encrypted license data)
- `license_logs` table (logs license operations)

### 2. Environment Configuration

Update `backend/.env` with license server configuration:

```env
# License Server Configuration
LICENSE_SERVER_URL=https://api.hisaabkitab.com
LICENSE_API_KEY=your_license_api_key_here

# Optional: Custom encryption key (auto-generated if not set)
LICENSE_ENCRYPTION_KEY=your_32_char_hex_key_here

# App Version
APP_VERSION=1.0.0
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install axios

# Frontend dependencies are already included
```

## License Flow

### First Launch
1. App checks for existing license
2. If no license found → Show activation screen
3. User enters license key
4. App calls `/api/license/validate` with:
   - License key
   - Device ID (hashed fingerprint)
   - App version
5. Backend forwards to external license server
6. If valid → Store license (encrypted) → Activate app
7. If invalid → Show error → Block app

### Periodic Revalidation
- On app launch
- Every 24 hours (if online)
- On window focus
- On user login (if implemented)

### Offline Grace Period
- App works offline for 7 days after last successful validation
- After grace period → Block app → Require revalidation

## Feature Enforcement

### Backend Enforcement

Add feature checks to routes:

```javascript
const { checkFeature } = require('../middleware/licenseMiddleware');

// Protect entire route
router.use(checkFeature('reports'));

// Or protect specific endpoint
router.get('/profit', checkFeature('profitLoss'), async (req, res) => {
  // ...
});
```

### Frontend Enforcement

Use `useLicense` hook:

```javascript
import { useLicense } from '../contexts/LicenseContext';

const MyComponent = () => {
  const { isFeatureEnabled } = useLicense();
  
  if (!isFeatureEnabled('reports')) {
    return <div>Feature not available</div>;
  }
  
  // Render feature
};
```

## License Server API Contract

The POS expects the license server to implement:

### POST `/api/license/validate`

**Request:**
```json
{
  "licenseKey": "HK-XXXX-XXXX",
  "deviceId": "hashed-device-id",
  "deviceFingerprint": "full-fingerprint-hash",
  "appVersion": "1.0.0"
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "licenseId": "uuid",
  "tenantId": "uuid",
  "expiresAt": "2026-01-01T00:00:00Z",
  "maxUsers": 5,
  "features": {
    "reports": true,
    "profitLoss": true
  }
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "error": "License expired",
  "code": "EXPIRED_LICENSE"
}
```

**Error Codes:**
- `INVALID_LICENSE` - License key not found
- `EXPIRED_LICENSE` - License has expired
- `REVOKED_LICENSE` - License has been revoked
- `DEVICE_LIMIT_EXCEEDED` - Too many devices activated
- `VERSION_MISMATCH` - App version too old

## Security Features

1. **Device Binding**
   - License tied to device fingerprint
   - Prevents license sharing

2. **Encrypted Storage**
   - License data encrypted in database
   - Encryption key derived from machine

3. **Backend Validation**
   - All API routes protected
   - Frontend checks are not sufficient

4. **Fail Closed**
   - On error → Block app
   - No bypass mechanisms

5. **Tamper Protection**
   - License verified on every request
   - Periodic revalidation

## Testing

### Test Scenarios

1. **First Launch (No License)**
   - App shows activation screen
   - Cannot access main app

2. **Valid License**
   - Activation succeeds
   - App works normally

3. **Expired License**
   - Shows expiry message
   - Blocks app access

4. **Revoked License**
   - Shows revocation message
   - Blocks app access

5. **Offline Mode**
   - Works for 7 days after last validation
   - Blocks after grace period

6. **Device Mismatch**
   - Blocks if license on different device
   - Requires re-activation

7. **Feature Disabled**
   - UI hidden/disabled
   - Backend blocks access

## Troubleshooting

### License Not Activating

1. Check internet connection
2. Verify `LICENSE_SERVER_URL` in `.env`
3. Check license server logs
4. Verify license key format

### App Blocked After Activation

1. Check license expiry date
2. Verify device ID matches
3. Check grace period (7 days offline limit)
4. Review license logs: `SELECT * FROM license_logs ORDER BY created_at DESC LIMIT 10;`

### Feature Not Available

1. Check license features in database:
   ```sql
   SELECT features FROM license_info WHERE is_active = true;
   ```
2. Verify feature name matches exactly
3. Check backend middleware is applied

## License Logs

View license operations:

```sql
SELECT 
  action,
  status,
  message,
  created_at
FROM license_logs
ORDER BY created_at DESC
LIMIT 50;
```

## Support

For license issues:
1. Check license logs in database
2. Verify license server connectivity
3. Contact HisaabKitab support with:
   - License key (first 4 chars only)
   - Device ID
   - Error message
   - License log entries







