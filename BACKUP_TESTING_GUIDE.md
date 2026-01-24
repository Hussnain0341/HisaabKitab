# Backup System Testing Guide

## Prerequisites

1. **Ensure PostgreSQL is running** and accessible
2. **Ensure `pg_dump` and `psql` are installed** and in your PATH
   - On Windows: Usually comes with PostgreSQL installation
   - Verify: Open terminal and run `pg_dump --version`
3. **Start the backend server**: `cd backend && npm start`
4. **Start the frontend**: `cd frontend && npm start`

## Testing Checklist

### ✅ Test 1: Manual Backup Creation

**Steps:**
1. Open the application in browser (http://localhost:3000)
2. Navigate to **Settings** page
3. Scroll to **"Data Safety & Backup"** section
4. Click **"💾 Create Manual Backup"** button
5. Wait for success message

**Expected Results:**
- ✅ Success message appears: "Backup created successfully! File: backup_YYYY_MM_DD.sql"
- ✅ Backup file created in `/backup` directory (or configured location)
- ✅ File size > 0 bytes
- ✅ Last Backup Status shows "✅ Last Backup Successful" with date

**Verify Backup File:**
```bash
# Navigate to backup directory
cd backup

# List backup files
ls -la backup_*.sql

# Check file size (should be > 0)
ls -lh backup_*.sql
```

---

### ✅ Test 2: Enable Automatic Backup (App Start Mode)

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Check **"Enable Automatic Backup"** checkbox
3. Select **"On Application Start"** from Backup Mode dropdown
4. Settings should auto-save

**Expected Results:**
- ✅ Settings saved successfully message appears
- ✅ Checkbox remains checked
- ✅ Mode shows "On Application Start"

**Test App Start Backup:**
1. Stop the backend server (Ctrl+C)
2. Restart backend: `cd backend && npm start`
3. Check console logs for: `[Backup Scheduler] Performing startup backup...`
4. Check backup directory for new backup file

---

### ✅ Test 3: Enable Scheduled Daily Backup

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Ensure **"Enable Automatic Backup"** is checked
3. Select **"Scheduled Daily Backup"** from Backup Mode
4. Set **Scheduled Time** to a time 2-3 minutes from now (e.g., if current time is 14:30, set to 14:32)
5. Wait for settings to save

**Expected Results:**
- ✅ Settings saved successfully
- ✅ Scheduled time picker is visible
- ✅ Console shows: `[Backup Scheduler] Daily backup scheduled for HH:mm`

**Wait for Scheduled Time:**
- Monitor backend console logs
- At scheduled time, you should see: `[Backup Scheduler] Scheduled backup triggered at HH:mm`
- New backup file should be created

**Note:** For faster testing, you can temporarily set time to 1-2 minutes ahead.

---

### ✅ Test 4: Backup Location Configuration

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Click **"Change"** button next to Backup Location
3. Select a different directory (if Electron app)
4. Or manually edit settings in database

**Expected Results:**
- ✅ New backup location is displayed
- ✅ Next backup is created in new location

**For Web Mode:**
- Directory selection may not be available
- Default location: `E:\POS\HisaabKitab\backup\`

---

### ✅ Test 5: Backup Retention Policy

**Steps:**
1. Create multiple backup files manually (or wait for scheduled backups)
2. Go to Settings → Data Safety & Backup
3. Set **Backup Retention** to **"Keep Last 3 Backups"**
4. Create a new backup manually

**Expected Results:**
- ✅ Only last 3 backups remain in directory
- ✅ Older backups are automatically deleted
- ✅ Console logs show: `[Backup Service] Deleted backup: backup_YYYY_MM_DD.sql`

**Verify Retention:**
```bash
# Check backup directory
cd backup
ls -lt backup_*.sql | head -5

# Should show only 3 most recent files
```

---

### ✅ Test 6: Last Backup Status Display

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Check **"Last Backup Status"** section

**Expected Results:**

**If backup exists:**
- ✅ Green box with "✅ Last Backup Successful"
- ✅ Shows backup date and time
- ✅ Shows backup filename
- ✅ Status indicator shows "OK"

**If no backup exists:**
- ✅ Yellow box with "⚠️ No Backup Found"
- ✅ Message: "Create a backup to protect your data"
- ✅ Status indicator shows "Warning"

---

### ✅ Test 7: Restore Functionality

**⚠️ IMPORTANT: This will replace your current database!**

**Preparation:**
1. Create a test backup first
2. Make note of some data (e.g., product count, customer count)
3. Add some test data (create a product, customer, or sale)
4. Create another backup

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Click **"🔄 Restore Last Backup"** button
3. Confirm the warning dialog
4. Wait for restore to complete

**Expected Results:**
- ✅ Confirmation dialog appears with warning message
- ✅ After confirmation, restore process starts
- ✅ Success message: "✅ Database restored successfully!"
- ✅ Application restarts automatically (or reloads page)
- ✅ After restart, test data added before restore should be gone
- ✅ Data from backup should be restored

**Verify Restore:**
- Check that product/customer counts match the backup state
- Verify that test data added before restore is removed

---

### ✅ Test 8: Disable Automatic Backup

**Steps:**
1. Go to Settings → Data Safety & Backup
2. Uncheck **"Enable Automatic Backup"** checkbox
3. Settings should auto-save

**Expected Results:**
- ✅ Settings saved successfully
- ✅ Backup mode and scheduled time options are hidden
- ✅ Console shows: `[Backup Scheduler] Scheduler stopped`
- ✅ No automatic backups occur

---

### ✅ Test 9: Error Handling

**Test Backup Failure (Simulate):**

1. **Stop PostgreSQL temporarily:**
   ```bash
   # Windows (as Administrator)
   net stop postgresql-x64-XX
   ```

2. Try to create manual backup

**Expected Results:**
- ✅ Error message appears: "Failed to create backup"
- ✅ Current data remains safe
- ✅ No partial backup files created

3. **Restart PostgreSQL:**
   ```bash
   net start postgresql-x64-XX
   ```

**Test Restore Failure:**

1. Try to restore with no backups available

**Expected Results:**
- ✅ Restore button is disabled if no backup exists
- ✅ Error message if restore fails: "Failed to restore backup. Your current data is safe."

---

### ✅ Test 10: Transaction Safety

**Test Power Failure Simulation:**

1. Create a sale/invoice with multiple items
2. During the transaction, simulate a crash (stop backend server)
3. Restart backend

**Expected Results:**
- ✅ Database remains consistent
- ✅ No partial sales recorded
- ✅ Stock levels are correct
- ✅ No orphaned records

**Verify:**
- Check `sales` table - should have no incomplete records
- Check `sale_items` table - all items should have valid `sale_id`
- Check `products` table - stock levels should match actual sales

---

### ✅ Test 11: i18next Translations

**Steps:**
1. Go to Settings → Language & Appearance
2. Change language to **"Urdu (اردو)"**
3. Navigate to Data Safety & Backup section

**Expected Results:**
- ✅ All backup UI text is translated to Urdu
- ✅ Buttons, labels, and messages show in Urdu
- ✅ Status messages are translated

**Switch back to English** and verify translations revert.

---

## Quick Test Script

For automated testing, you can use this Node.js script:

```javascript
// test-backup.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000/api';

async function testBackup() {
  try {
    // 1. Get backup status
    console.log('1. Getting backup status...');
    const statusRes = await axios.get(`${API_BASE}/backup/status`);
    console.log('Status:', statusRes.data);

    // 2. Create backup
    console.log('\n2. Creating backup...');
    const createRes = await axios.post(`${API_BASE}/backup/create`);
    console.log('Backup created:', createRes.data);

    // 3. List backups
    console.log('\n3. Listing backups...');
    const listRes = await axios.get(`${API_BASE}/backup/list`);
    console.log('Backups:', listRes.data);

    // 4. Update settings
    console.log('\n4. Updating backup settings...');
    const settingsRes = await axios.put(`${API_BASE}/backup/settings`, {
      enabled: true,
      mode: 'scheduled',
      scheduledTime: '02:00',
      retentionCount: 5
    });
    console.log('Settings updated:', settingsRes.data);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBackup();
```

Run: `node test-backup.js`

---

## Troubleshooting

### Backup Not Creating

**Check:**
1. PostgreSQL is running: `pg_dump --version`
2. Database credentials in `.env` are correct
3. Backup directory is writable
4. Check backend console for errors

### Scheduled Backup Not Running

**Check:**
1. Backend server is running continuously
2. System time is correct
3. Timezone settings
4. Check console logs for scheduler messages

### Restore Not Working

**Check:**
1. Backup file exists and is not corrupted
2. PostgreSQL is running
3. Database connection is active
4. Check file permissions

### Transaction Safety Issues

**Check:**
1. All routes use `db.getClient()` for transactions
2. `BEGIN` and `COMMIT` are properly called
3. `ROLLBACK` is called in catch blocks
4. `client.release()` is called in finally blocks

---

## Success Criteria

✅ All tests pass
✅ Backups are created successfully
✅ Automatic backups work (app start and scheduled)
✅ Retention policy deletes old backups
✅ Restore functionality works correctly
✅ Settings persist across app restarts
✅ Error handling works gracefully
✅ Translations work in both languages
✅ Transaction safety prevents data corruption

---

## Notes

- **Backup files are stored locally** - ensure sufficient disk space
- **Backups are SQL dumps** - can be restored manually using `psql` if needed
- **Scheduled backups use system time** - ensure system clock is accurate
- **Restore requires app restart** - all connections must be closed first
- **Backup directory is created automatically** if it doesn't exist

