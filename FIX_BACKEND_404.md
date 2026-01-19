# Fix: 404 Errors - Backend Server Not Running Correctly

## Problem
Multiple Node.js processes are using port 5000, causing conflicts. The backend API routes are not accessible.

## Solution

### Step 1: Stop All Node Processes on Port 5000

Open PowerShell and run:
```powershell
# Find processes using port 5000
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object OwningProcess | ForEach-Object {
    $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "Killing process $($proc.Id): $($proc.ProcessName)"
        Stop-Process -Id $proc.Id -Force
    }
}
```

Or manually:
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find all "Node.js" processes
3. End all of them

### Step 2: Start Backend Server Manually (Test)

In a NEW PowerShell window:
```powershell
cd E:\POS\HisaabKitab\backend
node server.js
```

You should see:
```
✅ Database connection verified
HisaabKitab Backend Server running on http://0.0.0.0:5000
Mode: Full Access (Server PC)
```

**Keep this window open!**

### Step 3: Test Backend API

In another PowerShell window, test:
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:5000/api/products" -UseBasicParsing
```

Both should return 200 OK.

### Step 4: Start Frontend and Electron

Once backend is confirmed working, in a separate window:
```powershell
cd E:\POS\HisaabKitab
npm run dev
```

This will:
- Start React dev server (port 3000)
- Start Electron window
- Electron will try to start backend (but since it's already running, it will fail - that's OK, keep the manual backend running)

### Alternative: Fix main.js to Check for Existing Server

The issue is that `main.js` tries to spawn a backend server, but if one is already running, it fails silently or conflicts.

**Solution**: Always start backend manually in a separate terminal, OR modify the workflow to check if backend is already running before spawning.





