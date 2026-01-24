# License System Integration - API Contract Update

## ✅ Updates Completed

### 1. Backend API Integration (`backend/routes/license.js`)

**Updated to match your API contract:**

- **API URL**: Changed to `https://api.zentryasolutions.com/api/license/validate`
- **Request Payload**: Removed `deviceFingerprint` (not needed in your API)
  ```json
  {
    "licenseKey": "HK-XXXX-XXXX-XXXX",
    "deviceId": "device-id",
    "appVersion": "1.0.0"
  }
  ```

- **Response Mapping**: 
  - `tenantName` → stored as `tenantId` (backward compatible)
  - `expiryDate` → converted to `expiresAt` (ISO format)
  - `maxDevices` → stored in features JSON
  - `reason` → used for error messages

### 2. Frontend License Service (`frontend/src/services/licenseService.js`)

- Removed `deviceFingerprint` from request payload
- Increased timeout to 20 seconds for external API calls
- Better error handling for API responses

### 3. License Activation UI (`frontend/src/components/LicenseActivation.js`)

**Improvements:**

- ✅ **License Key Format Validation**: Validates format `HK-XXXX-XXXX-XXXX`
- ✅ **Better Error Messages**: Uses `reason` from API response
- ✅ **Success Message**: Shows tenant name on successful activation
- ✅ **Auto Redirect**: Automatically redirects to dashboard after 2 seconds
- ✅ **Navigation Integration**: Uses React Router for proper navigation
- ✅ **Loading States**: Clear visual feedback during activation

### 4. License Storage (`backend/utils/licenseStorage.js`)

- Updated to handle `maxDevices` (stored in features JSON)
- Proper date conversion from `expiryDate` to `expiresAt`

## 🔧 Configuration

Update `backend/.env`:

```env
LICENSE_SERVER_URL=https://api.zentryasolutions.com
LICENSE_API_KEY=your_api_key_if_needed
APP_VERSION=1.0.0
```

## 📋 API Contract

### Request to Your API

```bash
POST https://api.zentryasolutions.com/api/license/validate
Content-Type: application/json

{
  "licenseKey": "HK-XXXX-XXXX-XXXX",
  "deviceId": "device-fingerprint-id",
  "appVersion": "1.0.0"
}
```

### Expected Response (Valid)

```json
{
  "valid": true,
  "licenseId": "550e8400-e29b-41d4-a716-446655440000",
  "tenantName": "My Shop",
  "features": {},
  "expiryDate": "2025-12-31",
  "maxUsers": 5,
  "maxDevices": 3
}
```

### Expected Response (Invalid)

```json
{
  "valid": false,
  "reason": "License key not found"
}
```

## 🎨 UI Flow

1. **App Launch** → Checks for existing license
2. **No License** → Shows activation screen
3. **User Enters Key** → Validates format (HK-XXXX-XXXX-XXXX)
4. **Validates with API** → Shows loading state
5. **Success** → Shows success message with tenant name
6. **Auto Redirect** → Redirects to dashboard after 2 seconds
7. **Error** → Shows specific error message from API

## 🧪 Testing

### Test with Your API

1. Get a test license key from: `https://api.zentryasolutions.com/licenses`
2. Launch the app
3. Enter the license key in format: `HK-XXXX-XXXX-XXXX`
4. Should activate and redirect to dashboard

### Test Scenarios

- ✅ Valid license → Activates and redirects
- ✅ Invalid license → Shows error message
- ✅ Expired license → Shows expiry message
- ✅ Network error → Shows connection error
- ✅ Wrong format → Shows format validation error

## 🔄 Redirect Flow

After successful activation:

1. License stored in database (encrypted)
2. Success message shown with tenant name
3. After 2 seconds → `onActivationSuccess()` called
4. License context refreshed
5. App shows dashboard (license check passes)
6. User can now use the POS

## 📝 Notes

- License key format validation is optional (can be removed if needed)
- `maxDevices` is stored but not currently enforced (ready for future use)
- All license data is encrypted in database
- Grace period of 7 days offline still applies
- Periodic revalidation every 24 hours

## 🚀 Ready to Use

The system is now fully integrated with your API. Just:

1. Update `backend/.env` with your API URL
2. Run database migration (if not done): `node backend/scripts/run-license-migration.js`
3. Test with a real license key from your admin panel

The UI will automatically show the activation screen on first launch, and after successful validation, users will be redirected to the POS dashboard.






