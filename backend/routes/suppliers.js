const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suppliers (sorted alphabetically by default)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        supplier_id,
        name,
        contact_number,
        total_purchased,
        total_paid,
        balance
      FROM suppliers
      ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch suppliers', 
      message: error.message,
      code: error.code,
      detail: error.detail
    });
  }
});

// Get single supplier by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT 
        supplier_id,
        name,
        contact_number,
        total_purchased,
        total_paid,
        balance
      FROM suppliers
      WHERE supplier_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier', message: error.message });
  }
});

// Create new supplier
router.post('/', async (req, res) => {
  try {
    const { name, contact_number, total_purchased, total_paid } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }

    const purchased = parseFloat(total_purchased) || 0;
    const paid = parseFloat(total_paid) || 0;

    // Validate numeric values
    if (isNaN(purchased) || purchased < 0) {
      return res.status(400).json({ error: 'Total purchased must be 0 or greater' });
    }

    if (isNaN(paid) || paid < 0) {
      return res.status(400).json({ error: 'Total paid must be 0 or greater' });
    }

    // Calculate balance
    const balance = purchased - paid;

    const result = await db.query(
      `INSERT INTO suppliers (name, contact_number, total_purchased, total_paid, balance)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), contact_number || null, purchased, paid, balance]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier', message: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_number, total_purchased, total_paid } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }

    const purchased = parseFloat(total_purchased) || 0;
    const paid = parseFloat(total_paid) || 0;

    // Validate numeric values
    if (isNaN(purchased) || purchased < 0) {
      return res.status(400).json({ error: 'Total purchased must be 0 or greater' });
    }

    if (isNaN(paid) || paid < 0) {
      return res.status(400).json({ error: 'Total paid must be 0 or greater' });
    }

    // Calculate balance
    const balance = purchased - paid;

    const result = await db.query(
      `UPDATE suppliers 
       SET name = $1, contact_number = $2, total_purchased = $3, total_paid = $4, balance = $5
       WHERE supplier_id = $6
       RETURNING *`,
      [name.trim(), contact_number || null, purchased, paid, balance, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier', message: error.message });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if supplier is referenced in products or purchases
    const [productsCheck, purchasesCheck] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM products WHERE supplier_id = $1', [id]),
      db.query('SELECT COUNT(*) as count FROM purchases WHERE supplier_id = $1', [id]),
    ]);

    const productCount = parseInt(productsCheck.rows[0].count);
    const purchaseCount = parseInt(purchasesCheck.rows[0].count);

    if (productCount > 0 || purchaseCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete supplier: it is referenced in ${productCount} product(s) and ${purchaseCount} purchase(s)` 
      });
    }

    const result = await db.query(
      'DELETE FROM suppliers WHERE supplier_id = $1 RETURNING supplier_id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully', supplier_id: id });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier', message: error.message });
  }
});

module.exports = router;
