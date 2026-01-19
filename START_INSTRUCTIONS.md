# ✅ How to Start HisaabKitab Correctly

## The Problem
When you run `npm run dev`, it tries to start the backend, but if port 5000 is already in use, it fails.

## Solution: Stop Conflicting Processes First

### Step 1: Stop ALL Node Processes on Port 5000
Run this command FIRST:
```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { 
    $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
    if ($proc) { 
        Stop-Process -Id $proc.Id -Force 
        Write-Host "Stopped process $($proc.Id)"
    }
}
```

### Step 2: Start Everything with One Command
```powershell
cd E:\POS\HisaabKitab
npm run dev
```

This will start:
- ✅ Backend server (port 5000)
- ✅ React dev server (port 3000)
- ✅ Electron window

### Step 3: Wait for All Services
Wait until you see:
- `[0] ✅ Database connection verified`
- `[0] HisaabKitab Backend Server running on http://0.0.0.0:5000`
- `[1] Compiled successfully!`
- `[2] Electron window opens`

## Alternative: Start Manually (If npm run dev has issues)

### Terminal 1: Backend
```powershell
cd E:\POS\HisaabKitab\backend
node server.js
```

### Terminal 2: Frontend
```powershell
cd E:\POS\HisaabKitab\frontend
npm start
```

### Terminal 3: Electron (Optional)
```powershell
cd E:\POS\HisaabKitab
npm start
```

## Quick Fix Script
Save this as `start-clean.ps1`:
```powershell
# Stop all processes on port 5000
Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { 
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Start the app
cd E:\POS\HisaabKitab
npm run dev
```

Then just run: `.\start-clean.ps1`





