const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suppliers (sorted by highest payable balance first by default)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        supplier_id,
        name,
        contact_number,
        NULL as address,
        opening_balance,
        COALESCE((
          SELECT SUM(total_amount) 
          FROM purchases 
          WHERE supplier_id = suppliers.supplier_id 
          AND payment_type = 'credit'
        ), 0) as total_credit_purchases,
        COALESCE((
          SELECT SUM(amount) 
          FROM supplier_payments 
          WHERE supplier_id = suppliers.supplier_id
        ), 0) as total_paid,
        (opening_balance + 
         COALESCE((
           SELECT SUM(total_amount) 
           FROM purchases 
           WHERE supplier_id = suppliers.supplier_id 
           AND payment_type = 'credit'
         ), 0) - 
         COALESCE((
           SELECT SUM(amount) 
           FROM supplier_payments 
           WHERE supplier_id = suppliers.supplier_id
         ), 0)
        ) as current_payable_balance,
        status,
        created_at,
        (
          SELECT MAX(date) 
          FROM purchases 
          WHERE supplier_id = suppliers.supplier_id
        ) as last_purchase_date,
        (
          SELECT MAX(payment_date) 
          FROM supplier_payments 
          WHERE supplier_id = suppliers.supplier_id
        ) as last_payment_date
      FROM suppliers
      ORDER BY current_payable_balance DESC, name ASC`
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

// Get single supplier by ID with calculated balance
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT 
        supplier_id,
        name,
        contact_number,
        NULL as address,
        opening_balance,
        COALESCE((
          SELECT SUM(total_amount) 
          FROM purchases 
          WHERE supplier_id = suppliers.supplier_id 
          AND payment_type = 'credit'
        ), 0) as total_credit_purchases,
        COALESCE((
          SELECT SUM(amount) 
          FROM supplier_payments 
          WHERE supplier_id = suppliers.supplier_id
        ), 0) as total_paid,
        (opening_balance + 
         COALESCE((
           SELECT SUM(total_amount) 
           FROM purchases 
           WHERE supplier_id = suppliers.supplier_id 
           AND payment_type = 'credit'
         ), 0) - 
         COALESCE((
           SELECT SUM(amount) 
           FROM supplier_payments 
           WHERE supplier_id = suppliers.supplier_id
         ), 0)
        ) as current_payable_balance,
        status,
        created_at
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
    const { name, contact_number, address, opening_balance } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }

    const openingBal = parseFloat(opening_balance) || 0;

    // Validate numeric values
    if (isNaN(openingBal)) {
      return res.status(400).json({ error: 'Opening balance must be a valid number' });
    }

    // Balance will be auto-calculated by triggers/app logic
    // Note: address column may not exist, so we'll try to insert without it if it fails
    let result;
    try {
      result = await db.query(
        `INSERT INTO suppliers (name, contact_number, address, opening_balance, status)
         VALUES ($1, $2, $3, $4, 'active')
         RETURNING 
           supplier_id,
           name,
           contact_number,
           address,
           opening_balance,
           0 as total_credit_purchases,
           0 as total_paid,
           opening_balance as current_payable_balance,
           status,
           created_at`,
        [name.trim(), contact_number || null, address || null, openingBal]
      );
    } catch (err) {
      if (err.code === '42703' && err.message.includes('address')) {
        // Address column doesn't exist, insert without it
        result = await db.query(
          `INSERT INTO suppliers (name, contact_number, opening_balance, status)
           VALUES ($1, $2, $3, 'active')
           RETURNING 
             supplier_id,
             name,
             contact_number,
             NULL as address,
             opening_balance,
             0 as total_credit_purchases,
             0 as total_paid,
             opening_balance as current_payable_balance,
             status,
             created_at`,
          [name.trim(), contact_number || null, openingBal]
        );
      } else {
        throw err;
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier', message: error.message });
  }
});

// Update supplier (only name, contact, address, opening_balance, status - balance is auto-calculated)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_number, address, opening_balance, status } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Supplier name is required' });
    }

    const openingBal = parseFloat(opening_balance);
    if (isNaN(openingBal)) {
      return res.status(400).json({ error: 'Opening balance must be a valid number' });
    }

    // Check if supplier has purchases or payments - if yes, prevent changing opening_balance
    const [purchasesCheck, paymentsCheck] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM purchases WHERE supplier_id = $1', [id]),
      db.query('SELECT COUNT(*) as count FROM supplier_payments WHERE supplier_id = $1', [id]),
    ]);

    const hasTransactions = parseInt(purchasesCheck.rows[0].count) > 0 || 
                            parseInt(paymentsCheck.rows[0].count) > 0;

    // If supplier has transactions, get current opening_balance and don't allow change
    let finalOpeningBalance = openingBal;
    if (hasTransactions) {
      const currentSupplier = await db.query(
        'SELECT opening_balance FROM suppliers WHERE supplier_id = $1',
        [id]
      );
      if (currentSupplier.rows.length > 0) {
        finalOpeningBalance = parseFloat(currentSupplier.rows[0].opening_balance);
      }
    }

    // Try to update with address, fallback if column doesn't exist
    let result;
    try {
      result = await db.query(
        `UPDATE suppliers 
         SET name = $1, 
             contact_number = $2, 
             address = $3, 
             opening_balance = $4,
             status = COALESCE($5, status)
         WHERE supplier_id = $6
         RETURNING 
           supplier_id,
           name,
           contact_number,
           address,
           opening_balance,
           COALESCE((
             SELECT SUM(total_amount) 
             FROM purchases 
             WHERE supplier_id = suppliers.supplier_id 
             AND payment_type = 'credit'
           ), 0) as total_credit_purchases,
           COALESCE((
             SELECT SUM(amount) 
             FROM supplier_payments 
             WHERE supplier_id = suppliers.supplier_id
           ), 0) as total_paid,
           (opening_balance + 
            COALESCE((
              SELECT SUM(total_amount) 
              FROM purchases 
              WHERE supplier_id = suppliers.supplier_id 
              AND payment_type = 'credit'
            ), 0) - 
            COALESCE((
              SELECT SUM(amount) 
              FROM supplier_payments 
              WHERE supplier_id = suppliers.supplier_id
            ), 0)
           ) as current_payable_balance,
           status,
           created_at`,
        [name.trim(), contact_number || null, address || null, finalOpeningBalance, status || 'active', id]
      );
    } catch (err) {
      if (err.code === '42703' && err.message.includes('address')) {
        // Address column doesn't exist, update without it
        result = await db.query(
          `UPDATE suppliers 
           SET name = $1, 
               contact_number = $2, 
               opening_balance = $3,
               status = COALESCE($4, status)
           WHERE supplier_id = $5
           RETURNING 
             supplier_id,
             name,
             contact_number,
             NULL as address,
             opening_balance,
             COALESCE((
               SELECT SUM(total_amount) 
               FROM purchases 
               WHERE supplier_id = suppliers.supplier_id 
               AND payment_type = 'credit'
             ), 0) as total_credit_purchases,
             COALESCE((
               SELECT SUM(amount) 
               FROM supplier_payments 
               WHERE supplier_id = suppliers.supplier_id
             ), 0) as total_paid,
             (opening_balance + 
              COALESCE((
                SELECT SUM(total_amount) 
                FROM purchases 
                WHERE supplier_id = suppliers.supplier_id 
                AND payment_type = 'credit'
              ), 0) - 
              COALESCE((
                SELECT SUM(amount) 
                FROM supplier_payments 
                WHERE supplier_id = suppliers.supplier_id
              ), 0)
             ) as current_payable_balance,
             status,
             created_at`,
          [name.trim(), contact_number || null, finalOpeningBalance, status || 'active', id]
        );
      } else {
        throw err;
      }
    }

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
    
    // Check if supplier is referenced in products, purchases, or payments
    const [productsCheck, purchasesCheck, paymentsCheck] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM products WHERE supplier_id = $1', [id]),
      db.query('SELECT COUNT(*) as count FROM purchases WHERE supplier_id = $1', [id]),
      db.query('SELECT COUNT(*) as count FROM supplier_payments WHERE supplier_id = $1', [id]),
    ]);

    const productCount = parseInt(productsCheck.rows[0].count);
    const purchaseCount = parseInt(purchasesCheck.rows[0].count);
    const paymentCount = parseInt(paymentsCheck.rows[0].count);

    if (productCount > 0 || purchaseCount > 0 || paymentCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete supplier: it has ${productCount} product(s), ${purchaseCount} purchase(s), and ${paymentCount} payment(s)` 
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

// Get supplier ledger (purchases + payments history)
router.get('/:id/ledger', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get purchases
    const purchasesResult = await db.query(
      `SELECT 
        purchase_id as transaction_id,
        'Purchase' as transaction_type,
        date as transaction_date,
        total_amount as amount,
        payment_type,
        'Credit Purchase' as description,
        NULL as payment_method
      FROM purchases
      WHERE supplier_id = $1
      ORDER BY date DESC, purchase_id DESC`,
      [id]
    );

    // Get payments
    const paymentsResult = await db.query(
      `SELECT 
        payment_id as transaction_id,
        'Payment' as transaction_type,
        payment_date as transaction_date,
        amount,
        NULL as payment_type,
        COALESCE(notes, 'Payment') as description,
        payment_method
      FROM supplier_payments
      WHERE supplier_id = $1
      ORDER BY payment_date DESC, payment_id DESC`,
      [id]
    );

    // Combine and sort by date
    const ledger = [...purchasesResult.rows, ...paymentsResult.rows]
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    // Calculate running balance
    let runningBalance = 0;
    const supplier = await db.query(
      `SELECT opening_balance FROM suppliers WHERE supplier_id = $1`,
      [id]
    );
    
    if (supplier.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    runningBalance = parseFloat(supplier.rows[0].opening_balance) || 0;

    // Add running balance to each transaction (in reverse chronological order)
    const ledgerWithBalance = ledger.map(transaction => {
      if (transaction.transaction_type === 'Purchase' && transaction.payment_type === 'credit') {
        runningBalance += parseFloat(transaction.amount);
      } else if (transaction.transaction_type === 'Payment') {
        runningBalance -= parseFloat(transaction.amount);
      }
      return {
        ...transaction,
        running_balance: runningBalance
      };
    }).reverse(); // Reverse to show oldest first

    res.json({
      supplier_id: parseInt(id),
      opening_balance: parseFloat(supplier.rows[0].opening_balance) || 0,
      current_balance: runningBalance,
      transactions: ledgerWithBalance
    });
  } catch (error) {
    console.error('Error fetching supplier ledger:', error);
    res.status(500).json({ error: 'Failed to fetch supplier ledger', message: error.message });
  }
});

module.exports = router;
