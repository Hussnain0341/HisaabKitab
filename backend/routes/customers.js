const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        customer_id,
        name,
        phone,
        address,
        opening_balance,
        current_balance,
        customer_type,
        status,
        created_at
      FROM customers
      ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers', message: error.message });
  }
});

// Get single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT 
        customer_id,
        name,
        phone,
        address,
        opening_balance,
        current_balance,
        status,
        created_at
      FROM customers
      WHERE customer_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer', message: error.message });
  }
});

// Get customer with sales and payments history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [customerResult, salesResult, paymentsResult] = await Promise.all([
      db.query('SELECT * FROM customers WHERE customer_id = $1', [id]),
      db.query(
        `SELECT 
          sale_id,
          invoice_number,
          date,
          total_amount,
          paid_amount,
          payment_type,
          (total_amount - paid_amount) as balance
        FROM sales
        WHERE customer_id = $1
        ORDER BY date DESC`,
        [id]
      ),
      db.query(
        `SELECT 
          payment_id,
          payment_date,
          amount,
          payment_method,
          notes
        FROM customer_payments
        WHERE customer_id = $1
        ORDER BY payment_date DESC`,
        [id]
      )
    ]);
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({
      customer: customerResult.rows[0],
      sales: salesResult.rows,
      payments: paymentsResult.rows
    });
  } catch (error) {
    console.error('Error fetching customer history:', error);
    res.status(500).json({ error: 'Failed to fetch customer history', message: error.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, opening_balance, customer_type, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    const openingBal = parseFloat(opening_balance) || 0;
    const customerStatus = status || 'active';
    const customerType = customer_type || 'walk-in';

    const result = await db.query(
      `INSERT INTO customers (name, phone, address, opening_balance, current_balance, customer_type, status)
       VALUES ($1, $2, $3, $4, $4, $5, $6)
       RETURNING *`,
      [name.trim(), phone || null, address || null, openingBal, customerType, customerStatus]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer', message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, opening_balance, customer_type, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    const openingBal = parseFloat(opening_balance) || 0;
    const customerStatus = status || 'active';
    const customerType = customer_type || 'walk-in';

    // Recalculate current_balance based on opening_balance + credit sales - payments
    const result = await db.query(
      `UPDATE customers 
       SET name = $1, phone = $2, address = $3, opening_balance = $4, customer_type = $5, status = $6
       WHERE customer_id = $7
       RETURNING *`,
      [name.trim(), phone || null, address || null, openingBal, customerType, customerStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Trigger balance recalculation by updating a related record
    await db.query(
      `UPDATE customers SET current_balance = current_balance WHERE customer_id = $1`,
      [id]
    );

    // Fetch updated customer with recalculated balance
    const updatedResult = await db.query(
      'SELECT * FROM customers WHERE customer_id = $1',
      [id]
    );

    res.json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer', message: error.message });
  }
});

// Delete customer (only if no sales or payments exist)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [salesCheck, paymentsCheck] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM sales WHERE customer_id = $1', [id]),
      db.query('SELECT COUNT(*) as count FROM customer_payments WHERE customer_id = $1', [id])
    ]);

    const salesCount = parseInt(salesCheck.rows[0].count);
    const paymentsCount = parseInt(paymentsCheck.rows[0].count);

    if (salesCount > 0 || paymentsCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete customer: has ${salesCount} sale(s) and ${paymentsCount} payment(s)` 
      });
    }

    const result = await db.query(
      'DELETE FROM customers WHERE customer_id = $1 RETURNING customer_id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully', customer_id: id });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer', message: error.message });
  }
});

module.exports = router;

