const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// Backup database to SQL file
router.post('/create', async (req, res) => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'hisaabkitab',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFileName = `hisaabkitab_backup_${timestamp}.sql`;
    const backupPath = path.join(backupDir, backupFileName);

    // Build pg_dump command
    const pgDumpCmd = `pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f "${backupPath}"`;

    // Set PGPASSWORD environment variable
    process.env.PGPASSWORD = dbConfig.password;

    try {
      // Execute pg_dump
      await execPromise(pgDumpCmd);
      
      // Read the backup file to send to client
      const backupContent = fs.readFileSync(backupPath, 'utf8');

      res.json({
        success: true,
        message: 'Backup created successfully',
        filename: backupFileName,
        size: fs.statSync(backupPath).size,
        data: backupContent, // Send SQL content for download
      });
    } catch (error) {
      console.error('pg_dump error:', error);
      throw new Error('Failed to create backup. Make sure pg_dump is installed and accessible.');
    }
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      message: error.message
    });
  }
});

// List available backups
router.get('/list', async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
        };
      })
      .sort((a, b) => b.created - a.created); // Newest first

    res.json({ backups: files });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ error: 'Failed to list backups', message: error.message });
  }
});

module.exports = router;









