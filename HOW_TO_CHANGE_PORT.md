# How to Change Backend Port (If Needed)

## Option 1: Using Environment Variable (Recommended)

### Step 1: Update Backend `.env` File
Create/edit `backend/.env`:
```
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hisaabkitab_db
DB_USER=hisaab_user
DB_PASSWORD=password123
```

### Step 2: Update Frontend Proxy
Edit `frontend/package.json`:
```json
{
  "proxy": "http://localhost:5001"
}
```

### Step 3: Update Connection Status (if using LAN)
Edit `frontend/src/utils/connectionStatus.js` - change the default port if needed.

## Option 2: Change Port in Code

### Backend (`backend/server.js`)
Change line 7:
```javascript
const PORT = process.env.PORT || 5001;  // Changed from 5000 to 5001
```

### Frontend Proxy (`frontend/package.json`)
```json
{
  "proxy": "http://localhost:5001"
}
```

### Main.js (if Electron starts backend)
The port is read from environment variable, so `.env` change is enough.

## Current Status
✅ **Port 5000 is working correctly now!** The backend server is running and all API endpoints are responding.

You only need to change the port if you have persistent conflicts with other applications.









