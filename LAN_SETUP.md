# LAN Sync / Multi-PC Setup Guide

This guide explains how to set up LAN sync for read-only access from multiple PCs.

## Overview

- **Main PC (Server)**: Runs the full application with database and all write permissions
- **Client PCs**: Connect via LAN for read-only access to view Inventory, Sales, and Reports

## Setup Instructions

### Step 1: Configure Main PC (Server)

1. **Find your IP Address:**
   - Windows: Open Command Prompt and run `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.1.100)
   - Linux/Mac: Run `ifconfig` or `ip addr`

2. **Start the Server:**
   - The server automatically listens on all network interfaces (0.0.0.0)
   - Default port: 5000
   - No additional configuration needed

3. **Firewall Configuration:**
   - Allow incoming connections on port 5000
   - Windows: Add firewall rule for port 5000
   - Linux: `sudo ufw allow 5000`

### Step 2: Configure Client PCs

1. **Start the Application** on client PC

2. **Configure Server Connection:**
   - Look for "Configure LAN Access" in the connection status bar (top of screen)
   - Click it and enter the main PC's IP address:
     ```
     http://192.168.1.100:5000
     ```
   - Replace `192.168.1.100` with your main PC's actual IP
   - Click "Save"

3. **Verify Connection:**
   - The connection status will show "Connected (Client PC)"
   - You'll see "Read-only" badge
   - All edit buttons will be disabled

### Step 3: Using Client PCs

#### Read-Only Mode Features:
- ✅ View Inventory (products, stock levels)
- ✅ View Sales/Invoices
- ✅ View Suppliers
- ✅ Generate Reports
- ✅ Export to CSV
- ❌ Cannot add/edit/delete products
- ❌ Cannot create invoices
- ❌ Cannot modify suppliers
- ❌ Cannot change settings

#### Refresh Data:
- Click the "🔄 Refresh" button in the connection status bar
- Data will be fetched from the server
- Status updates automatically every 30 seconds

#### Connection Status:
- **Connected (Client PC)**: Successfully connected to server
- **Offline**: Cannot reach server (check network/IP)
- **Connected**: Using local database (server mode)

## Troubleshooting

### Connection Failed

1. **Check IP Address:**
   - Verify main PC IP is correct
   - Ensure both PCs are on same network

2. **Check Firewall:**
   - Main PC must allow port 5000
   - Temporarily disable firewall to test

3. **Check Server Status:**
   - Verify server is running on main PC
   - Check server console for errors

4. **Network Issues:**
   - Ping the main PC: `ping 192.168.1.100`
   - Try accessing in browser: `http://192.168.1.100:5000/api/health`

### Disconnect from Remote Server

- Click "Disconnect" in connection status
- Application will reload and use local database

## Security Notes

- Client PCs are **read-only** by design
- No authentication required (local network only)
- Sensitive operations blocked by backend middleware
- All write operations return 403 Forbidden on client PCs

## Architecture

- **Backend**: Express server listens on 0.0.0.0 (all interfaces)
- **Read-Only Mode**: Controlled by `READ_ONLY_MODE` environment variable
- **Frontend**: Detects client mode via server URL
- **API Calls**: Dynamic server URL based on localStorage config

## Environment Variables

For advanced setup, you can use environment variables:

**Main PC (Server):**
```bash
PORT=5000
HOST=0.0.0.0
READ_ONLY_MODE=false
```

**Client PC (Read-Only):**
```bash
READ_ONLY_MODE=true
# Or configure via UI
```

## Manual Configuration

To manually set server URL, edit localStorage:
```javascript
localStorage.setItem('hisaabkitab_server_url', 'http://192.168.1.100:5000/api');
```

To reset to local:
```javascript
localStorage.removeItem('hisaabkitab_server_url');
```

---

**Version:** 1.0.0  
**Status:** Optional Feature - Works alongside single-PC mode









