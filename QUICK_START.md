# Quick Start Guide - HisaabKitab

## ✅ Prerequisites Checklist

Before starting, ensure:
- [x] PostgreSQL is installed and running
- [x] Database `hisaabkitab_db` exists
- [x] Database tables are created (run `init.sql`)
- [x] Backend `.env` file exists in `backend/` folder

---

## 🚀 Starting the Application

### **Terminal 1: Start Backend Server**

```powershell
cd E:\POS\HisaabKitab\backend
node server.js
```

**✅ Success looks like:**
```
Connected to PostgreSQL database
HisaabKitab Backend Server running on http://0.0.0.0:5000
Mode: Full Access (Server PC)
```

**Keep this terminal open!**

---

### **Terminal 2: Start Frontend/Electron**

**Option A: Development Mode (Recommended for testing)**
```powershell
cd E:\POS\HisaabKitab
npm run dev
```

**Option B: Production Mode (After building)**
```powershell
cd E:\POS\HisaabKitab
npm start
```

---

## ✅ Verification Steps

### 1. Check Backend is Running
Open browser and go to: `http://localhost:5000/api/health`

Should return:
```json
{"status":"ok","message":"HisaabKitab API is running","mode":"full-access"}
```

### 2. Check React Dev Server
If using `npm run dev`, React dev server should start on `http://localhost:3000`

### 3. Electron Window
- Should open automatically
- Title bar: "HisaabKitab"
- Sidebar navigation visible
- No connection errors

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to server"

**Check:**
1. Is backend running? Look for "HisaabKitab Backend Server running" in Terminal 1
2. Test backend: `http://localhost:5000/api/health`
3. If using `npm start` (production), ensure React app is built: `cd frontend && npm run build`
4. If using `npm run dev`, ensure React dev server started successfully

### Problem: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### Problem: Database connection errors

**Solution:**
1. Check PostgreSQL is running: `Get-Service postgresql*`
2. Verify `.env` file has correct database credentials
3. Test database: `cd backend && node test-db.js`

---

## 📝 Quick Commands Reference

```powershell
# Start Backend
cd E:\POS\HisaabKitab\backend
node server.js

# Start Frontend (Dev Mode)
cd E:\POS\HisaabKitab
npm run dev

# Build Frontend (Production)
cd E:\POS\HisaabKitab\frontend
npm run build

# Start Electron (Production)
cd E:\POS\HisaabKitab
npm start

# Test Database Connection
cd E:\POS\HisaabKitab\backend
node test-db.js
```

---

## 🎯 Expected Result

When everything is working:
- ✅ No connection error messages
- ✅ Inventory page loads (empty table is normal)
- ✅ All navigation menu items work
- ✅ Can add products, suppliers, create invoices

**If you still see errors, check the browser console (F12) for detailed error messages!**









