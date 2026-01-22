const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', async (req, res) => {
  try {
    // Check if credit_limit column exists, if not use NULL
    let creditLimitColumn = 'NULL as credit_limit';
    try {
      const columnCheck = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'credit_limit'
      `);
      if (columnCheck.rows.length > 0) {
        creditLimitColumn = 'c.credit_limit';
      }
    } catch (err) {
      // If check fails, use NULL
      creditLimitColumn = 'NULL as credit_limit';
    }

    const result = await db.query(
      `SELECT 
        c.customer_id,
        c.name,
        c.phone,
        c.address,
        c.opening_balance,
        c.current_balance as current_due,
        c.customer_type,
        ${creditLimitColumn},
        c.status,
        c.created_at,
        COALESCE(SUM(CASE WHEN s.payment_type IN ('credit', 'split') THEN s.total_amount - s.paid_amount ELSE 0 END), 0) as total_sales_due,
        COALESCE(SUM(cp.amount), 0) as total_paid,
        MAX(s.date) as last_sale_date,
        MAX(cp.payment_date) as last_payment_date
      FROM customers c
      LEFT JOIN sales s ON c.customer_id = s.customer_id AND s.payment_type IN ('credit', 'split')
      LEFT JOIN customer_payments cp ON c.customer_id = cp.customer_id
      GROUP BY c.customer_id, c.name, c.phone, c.address, c.opening_balance, c.current_balance, c.customer_type, c.status, c.created_at${creditLimitColumn.includes('c.credit_limit') ? ', c.credit_limit' : ''}
      ORDER BY c.current_balance DESC, c.name ASC`
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
    // Check if credit_limit column exists, if not use NULL
    let creditLimitColumn = 'NULL as credit_limit';
    try {
      const columnCheck = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'credit_limit'
      `);
      if (columnCheck.rows.length > 0) {
        creditLimitColumn = 'c.credit_limit';
      }
    } catch (err) {
      // If check fails, use NULL
      creditLimitColumn = 'NULL as credit_limit';
    }

    const result = await db.query(
      `SELECT 
        c.customer_id,
        c.name,
        c.phone,
        c.address,
        c.opening_balance,
        c.current_balance as current_due,
        c.customer_type,
        ${creditLimitColumn},
        c.status,
        c.created_at,
        COALESCE(SUM(CASE WHEN s.payment_type IN ('credit', 'split') THEN s.total_amount - s.paid_amount ELSE 0 END), 0) as total_sales_due,
        COALESCE(SUM(cp.amount), 0) as total_paid
      FROM customers c
      LEFT JOIN sales s ON c.customer_id = s.customer_id AND s.payment_type IN ('credit', 'split')
      LEFT JOIN customer_payments cp ON c.customer_id = cp.customer_id
      WHERE c.customer_id = $1
      GROUP BY c.customer_id, c.name, c.phone, c.address, c.opening_balance, c.current_balance, c.customer_type, c.status, c.created_at${creditLimitColumn.includes('c.credit_limit') ? ', c.credit_limit' : ''}`,
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

// Get customer ledger (Money History)
router.get('/:id/ledger', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get customer info
    const customerResult = await db.query(
      'SELECT customer_id, name, opening_balance, current_balance, created_at FROM customers WHERE customer_id = $1',
      [id]
    );
    
    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const customer = customerResult.rows[0];
    const openingBalance = parseFloat(customer.opening_balance) || 0;
    
    // Get sales (credit/split only)
    const salesResult = await db.query(
      `SELECT 
        sale_id,
        invoice_number,
        date,
        total_amount,
        paid_amount,
        payment_type,
        (total_amount - paid_amount) as due_amount
      FROM sales
      WHERE customer_id = $1 AND payment_type IN ('credit', 'split')
      ORDER BY date ASC, sale_id ASC`,
      [id]
    );
    
    // Get payments
    const paymentsResult = await db.query(
      `SELECT 
        payment_id,
        payment_date as date,
        amount,
        payment_method,
        notes
      FROM customer_payments
      WHERE customer_id = $1
      ORDER BY payment_date ASC, payment_id ASC`,
      [id]
    );
    
    // Combine and sort all transactions
    const transactions = [];
    let runningBalance = openingBalance;
    
    // Add opening balance entry
    if (openingBalance !== 0) {
      transactions.push({
        date: customer.created_at || new Date(),
        type: 'opening',
        description: 'Previous Due',
        amount: openingBalance,
        running_balance: runningBalance,
        invoice_number: null,
        payment_method: null
      });
    }
    
    // Add sales
    salesResult.rows.forEach(sale => {
      const dueAmount = parseFloat(sale.due_amount) || 0;
      if (dueAmount > 0) {
        runningBalance += dueAmount;
        transactions.push({
          date: sale.date,
          type: 'sale',
          description: `Sale - Invoice #${sale.invoice_number}`,
          amount: dueAmount,
          running_balance: runningBalance,
          invoice_number: sale.invoice_number,
          sale_id: sale.sale_id,
          payment_method: null
        });
      }
    });
    
    // Add payments
    paymentsResult.rows.forEach(payment => {
      const amount = parseFloat(payment.amount) || 0;
      runningBalance -= amount;
      transactions.push({
        date: payment.date,
        type: 'payment',
        description: 'Payment Received',
        amount: -amount,
        running_balance: runningBalance,
        invoice_number: null,
        payment_id: payment.payment_id,
        payment_method: payment.payment_method
      });
    });
    
    // Sort by date
    transactions.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      // If same date, payments come after sales
      if (a.type === 'payment' && b.type === 'sale') return 1;
      if (a.type === 'sale' && b.type === 'payment') return -1;
      return 0;
    });
    
    res.json({
      customer: {
        customer_id: customer.customer_id,
        name: customer.name,
        opening_balance: openingBalance,
        current_due: parseFloat(customer.current_balance) || 0
      },
      transactions
    });
  } catch (error) {
    console.error('Error fetching customer ledger:', error);
    res.status(500).json({ error: 'Failed to fetch customer ledger', message: error.message });
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
    const { name, phone, address, opening_balance, customer_type, credit_limit, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const openingBal = parseFloat(opening_balance) || 0;
    const customerStatus = status || 'active';
    const customerType = customer_type || 'cash';
    const creditLimit = credit_limit ? parseFloat(credit_limit) : null;

    const result = await db.query(
      `INSERT INTO customers (name, phone, address, opening_balance, current_balance, customer_type, credit_limit, status)
       VALUES ($1, $2, $3, $4, $4, $5, $6, $7)
       RETURNING *`,
      [name.trim(), phone.trim(), address || null, openingBal, customerType, creditLimit, customerStatus]
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
    const { name, phone, address, opening_balance, customer_type, credit_limit, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const openingBal = parseFloat(opening_balance) || 0;
    const customerStatus = status || 'active';
    const customerType = customer_type || 'cash';
    const creditLimit = credit_limit ? parseFloat(credit_limit) : null;

    // Check if credit_limit column exists
    let hasCreditLimit = false;
    try {
      const columnCheck = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'credit_limit'
      `);
      hasCreditLimit = columnCheck.rows.length > 0;
    } catch (err) {
      hasCreditLimit = false;
    }

    let result;
    if (hasCreditLimit) {
      result = await db.query(
        `UPDATE customers 
         SET name = $1, phone = $2, address = $3, opening_balance = $4, customer_type = $5, credit_limit = $6, status = $7
         WHERE customer_id = $8
         RETURNING *`,
        [name.trim(), phone.trim(), address || null, openingBal, customerType, creditLimit, customerStatus, id]
      );
    } else {
      result = await db.query(
        `UPDATE customers 
         SET name = $1, phone = $2, address = $3, opening_balance = $4, customer_type = $5, status = $6
         WHERE customer_id = $7
         RETURNING *`,
        [name.trim(), phone.trim(), address || null, openingBal, customerType, customerStatus, id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Recalculate current balance
    await db.query(
      `UPDATE customers 
       SET current_balance = opening_balance + 
           COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split')), 0) -
           COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
       WHERE customer_id = $1`,
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

