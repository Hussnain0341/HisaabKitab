const express = require('express');
const router = express.Router();
const db = require('../db');

// Get settings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings ORDER BY id LIMIT 1');
    
    if (result.rows.length === 0) {
      // Create default settings if none exist
      await db.query(
        `INSERT INTO settings (printer_config, language, other_app_settings)
         VALUES (NULL, 'en', '{"shop_name": "My Shop", "shop_address": "", "shop_phone": ""}'::jsonb)
         RETURNING *`
      );
      const newResult = await db.query('SELECT * FROM settings ORDER BY id LIMIT 1');
      return res.json(newResult.rows[0]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching settings:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch settings', 
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { printer_config, language, other_app_settings } = req.body;

    const result = await db.query(
      `UPDATE settings 
       SET printer_config = $1, language = $2, other_app_settings = $3
       WHERE id = (SELECT id FROM settings ORDER BY id LIMIT 1)
       RETURNING *`,
      [
        printer_config || null,
        language || 'en',
        other_app_settings ? JSON.stringify(other_app_settings) : '{}'
      ]
    );

    if (result.rows.length === 0) {
      // Create if doesn't exist
      const newResult = await db.query(
        `INSERT INTO settings (printer_config, language, other_app_settings)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          printer_config || null,
          language || 'en',
          other_app_settings ? JSON.stringify(other_app_settings) : '{}'
        ]
      );
      return res.json(newResult.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings', message: error.message });
  }
});

module.exports = router;

