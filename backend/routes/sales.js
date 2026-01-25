const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');
const { logAuditEvent } = require('../utils/auditLogger');
const notificationsModule = require('./notifications');
const createNotification = notificationsModule.createNotification || (async () => {
  // Fallback if createNotification is not available
  console.warn('[Sales] createNotification helper not available');
});

// All sales routes require authentication
router.use(requireAuth);

// Generate next invoice number
async function generateInvoiceNumber() {
  try {
    const result = await db.query(
      `SELECT invoice_number FROM sales 
       WHERE invoice_number LIKE 'INV-%' 
       ORDER BY sale_id DESC LIMIT 1`
    );

    if (result.rows.length === 0) {
      return 'INV-0001';
    }

    const lastInvoice = result.rows[0].invoice_number;
    const match = lastInvoice.match(/INV-(\d+)/);
    
    if (match) {
      const lastNumber = parseInt(match[1]);
      const nextNumber = lastNumber + 1;
      return `INV-${String(nextNumber).padStart(4, '0')}`;
    }

    // Fallback if format doesn't match
    return `INV-${Date.now()}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    return `INV-${Date.now()}`;
  }
}

// Get all sales
router.get('/', async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = `
      SELECT 
        sale_id,
        invoice_number,
        date,
        customer_name,
        total_amount,
        paid_amount,
        payment_type,
        total_profit,
        is_finalized,
        finalized_at,
        created_by
      FROM sales
    `;
    const params = [];
    
    if (search) {
      query += ` WHERE 
        invoice_number ILIKE $1 OR 
        customer_name ILIKE $1 OR 
        CAST(date AS TEXT) ILIKE $1
      `;
      params.push(`%${search}%`);
    }
    
    query += ` ORDER BY sale_id DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));
    
    const result = await db.query(query, params);
    // Map payment_type to payment_mode for frontend consistency
    const salesWithPaymentMode = result.rows.map(sale => ({
      ...sale,
      payment_mode: sale.payment_type || 'cash'
    }));
    
    res.json(salesWithPaymentMode);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales', message: error.message });
  }
});

// Get single sale with items
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [saleResult, itemsResult] = await Promise.all([
      db.query(
        `SELECT 
          sale_id,
          invoice_number,
          date,
          customer_name,
          customer_id,
          subtotal,
          discount,
          tax,
          total_amount,
          paid_amount,
          payment_type,
          total_profit,
          is_finalized,
          finalized_at,
          created_by,
          updated_by
        FROM sales
        WHERE sale_id = $1`,
        [id]
      ),
      db.query(
        `SELECT 
          si.sale_item_id,
          si.sale_id,
          si.product_id,
          si.quantity,
          si.selling_price,
          si.purchase_price,
          si.profit,
          p.name as product_name,
          p.item_name_english,
          p.sku
        FROM sale_items si
        JOIN products p ON si.product_id = p.product_id
        WHERE si.sale_id = $1`,
        [id]
      )
    ]);

    if (saleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const sale = saleResult.rows[0];
    // Map payment_type to payment_mode for frontend consistency
    sale.payment_mode = sale.payment_type || 'cash';
    
    // Use item_name_english if available, otherwise use product_name
    const items = itemsResult.rows.map(item => ({
      ...item,
      product_name: item.item_name_english || item.product_name || 'N/A',
      name: item.item_name_english || item.product_name || 'N/A'
    }));
    
    res.json({
      ...sale,
      items: items
    });
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Failed to fetch sale', message: error.message });
  }
});

// Create new sale/invoice
router.post('/', async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');

    const { customer_id, customer_name, items, payment_type, paid_amount, discount, tax } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    // If customer_id provided, verify it exists
    if (customer_id) {
      const customerCheck = await client.query(
        'SELECT customer_id FROM customers WHERE customer_id = $1',
        [customer_id]
      );
      if (customerCheck.rows.length === 0) {
        throw new Error('Customer not found');
      }
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Validate each item and check stock
    let subtotalAmount = 0;
    let totalProfit = 0;

    for (const item of items) {
      const { product_id, quantity, selling_price } = item;

      if (!product_id || !quantity || !selling_price) {
        throw new Error('Invalid item: product_id, quantity, and selling_price are required');
      }

      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      if (selling_price <= 0) {
        throw new Error('Selling price must be greater than 0');
      }

      // Check stock availability
      const productResult = await client.query(
        'SELECT quantity_in_stock, purchase_price FROM products WHERE product_id = $1',
        [product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${product_id} not found`);
      }

      const product = productResult.rows[0];
      
      // Allow selling even if stock is low/zero (warning only, don't block)
      // Stock can go negative for hardware shops (items sold before restocking)
      if (product.quantity_in_stock < quantity) {
        console.warn(
          `Low stock warning: Product ${product_id} - Available: ${product.quantity_in_stock}, Requested: ${quantity}`
        );
        // Continue processing - don't throw error
      }

      const purchasePrice = parseFloat(product.purchase_price);
      const itemTotal = parseFloat(selling_price) * quantity;
      const itemProfit = (parseFloat(selling_price) - purchasePrice) * quantity;

      subtotalAmount += itemTotal;
      totalProfit += itemProfit;
    }

    // Calculate totals
    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    const subtotal = subtotalAmount;
    const grandTotal = subtotal - discountAmount + taxAmount;
    // Use payment_mode from request if provided, otherwise use payment_type, default to 'cash'
    const paymentType = req.body.payment_mode || payment_type || 'cash';
    
    // Determine paid amount based on payment type
    let paidAmount = 0;
    if (paymentType === 'cash') {
      paidAmount = grandTotal;
    } else if (paymentType === 'credit') {
      paidAmount = 0;
    } else if (paymentType === 'split') {
      paidAmount = parseFloat(paid_amount) || 0;
      if (paidAmount < 0 || paidAmount > grandTotal) {
        throw new Error('Paid amount must be between 0 and total amount');
      }
    } else {
      paidAmount = parseFloat(paid_amount) || grandTotal;
    }

    // Map payment_mode to payment_type (use payment_mode from request if provided)
    const paymentTypeToSave = req.body.payment_mode || paymentType;
    
    // Create sale record with user tracking
    const userId = req.user?.user_id || null;
    const saleResult = await client.query(
      `INSERT INTO sales (invoice_number, customer_id, customer_name, subtotal, discount, tax, total_amount, paid_amount, payment_type, total_profit, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [invoiceNumber, customer_id || null, customer_name || null, subtotal, discountAmount, taxAmount, grandTotal, paidAmount, paymentTypeToSave, totalProfit, userId]
    );

    const saleId = saleResult.rows[0].sale_id;

    // Create sale items and update stock
    for (const item of items) {
      const { product_id, quantity, selling_price } = item;

      // Get product purchase price
      const productResult = await client.query(
        'SELECT purchase_price FROM products WHERE product_id = $1',
        [product_id]
      );
      const purchasePrice = parseFloat(productResult.rows[0].purchase_price);
      const profit = (parseFloat(selling_price) - purchasePrice) * quantity;

      // Insert sale item
      await client.query(
        `INSERT INTO sale_items (sale_id, product_id, quantity, selling_price, purchase_price, profit)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [saleId, product_id, quantity, selling_price, purchasePrice, profit]
      );

      // Update product stock (allow negative stock for hardware shops)
      await client.query(
        `UPDATE products 
         SET quantity_in_stock = quantity_in_stock - $1
         WHERE product_id = $2`,
        [quantity, product_id]
      );
    }

    // Update customer balance for all sales (including partial payments)
    if (customer_id) {
      await client.query(
        `UPDATE customers 
         SET current_balance = opening_balance + 
             COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split')), 0) -
             COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
         WHERE customer_id = $1`,
        [customer_id]
      );
    }

    await client.query('COMMIT');

    // Create notification for new sale
    try {
      const username = req.user?.username || 'System';
      await createNotification({
        userId: null, // Global notification for all admins
        title: 'New Sale Completed',
        message: `Sale ${invoiceNumber} completed successfully by ${username}. Total: PKR ${grandTotal.toFixed(2)}`,
        type: 'success',
        link: '/sales',
        metadata: JSON.stringify({ sale_id: saleId, invoice_number: invoiceNumber })
      });
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
      // Don't fail the sale if notification fails
    }

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'create',
      tableName: 'sales',
      recordId: saleId,
      newValues: { invoice_number: invoiceNumber, total_amount: grandTotal },
      notes: `Created invoice ${invoiceNumber}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    // Fetch complete sale with items for response
    const [saleResultFinal, itemsResult] = await Promise.all([
      db.query('SELECT * FROM sales WHERE sale_id = $1', [saleId]),
      db.query(
        `SELECT 
          si.*,
          p.name as product_name,
          p.sku
        FROM sale_items si
        JOIN products p ON si.product_id = p.product_id
        WHERE si.sale_id = $1`,
        [saleId]
      )
    ]);

    const saleData = saleResultFinal.rows[0];
    // Map payment_type to payment_mode for frontend
    saleData.payment_mode = saleData.payment_type || 'cash';
    
    res.status(201).json({
      ...saleData,
      items: itemsResult.rows
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating sale:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create sale',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// Update sale (admin only)
router.put('/:id', async (req, res) => {
  const client = await db.getClient();
  
  try {
    // Check if user is admin
    if (req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'Only administrators can update sales' });
    }
    
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { items, payment_type, paid_amount, discount, tax, customer_id, customer_name } = req.body;
    const userId = req.user?.user_id || null;

    // Get existing sale
    const existingSale = await client.query(
      'SELECT * FROM sales WHERE sale_id = $1',
      [id]
    );

    if (existingSale.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const sale = existingSale.rows[0];

    // Check if finalized
    if (sale.is_finalized) {
      return res.status(400).json({ error: 'Cannot update finalized invoice' });
    }

    // If items provided, update items
    if (items && Array.isArray(items) && items.length > 0) {
      // Delete old items and restore stock
      const oldItems = await client.query(
        'SELECT product_id, quantity FROM sale_items WHERE sale_id = $1',
        [id]
      );

      for (const oldItem of oldItems.rows) {
        // Restore stock
        await client.query(
          'UPDATE products SET quantity_in_stock = quantity_in_stock + $1 WHERE product_id = $2',
          [oldItem.quantity, oldItem.product_id]
        );
      }

      // Delete old items
      await client.query('DELETE FROM sale_items WHERE sale_id = $1', [id]);

      // Recalculate totals
      let subtotalAmount = 0;
      let totalProfit = 0;

      for (const item of items) {
        const { product_id, quantity, selling_price } = item;
        const productResult = await client.query(
          'SELECT purchase_price FROM products WHERE product_id = $1',
          [product_id]
        );
        const purchasePrice = parseFloat(productResult.rows[0].purchase_price);
        const itemTotal = parseFloat(selling_price) * quantity;
        const itemProfit = (parseFloat(selling_price) - purchasePrice) * quantity;

        subtotalAmount += itemTotal;
        totalProfit += itemProfit;

        // Insert new item
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, selling_price, purchase_price, profit)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, product_id, quantity, selling_price, purchasePrice, itemProfit]
        );

        // Update stock
        await client.query(
          'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE product_id = $2',
          [quantity, product_id]
        );
      }

      const discountAmount = parseFloat(discount) || sale.discount || 0;
      const taxAmount = parseFloat(tax) || sale.tax || 0;
      const grandTotal = subtotalAmount - discountAmount + taxAmount;
      const paymentType = payment_type || sale.payment_type || 'cash';
      
      let paidAmount = sale.paid_amount;
      if (paymentType === 'cash') {
        paidAmount = grandTotal;
      } else if (paymentType === 'credit') {
        paidAmount = 0;
      } else if (paymentType === 'split') {
        paidAmount = parseFloat(paid_amount) || sale.paid_amount || 0;
      }

      // Update sale
      await client.query(
        `UPDATE sales 
         SET subtotal = $1, discount = $2, tax = $3, total_amount = $4, 
             paid_amount = $5, payment_type = $6, total_profit = $7,
             customer_id = $8, customer_name = $9, updated_by = $10, updated_at = NOW()
         WHERE sale_id = $11`,
        [subtotalAmount, discountAmount, taxAmount, grandTotal, paidAmount, 
         paymentType, totalProfit, customer_id || sale.customer_id, 
         customer_name || sale.customer_name, userId, id]
      );
    } else {
      // Update only payment/amount fields
      const discountAmount = parseFloat(discount) !== undefined ? parseFloat(discount) : sale.discount;
      const taxAmount = parseFloat(tax) !== undefined ? parseFloat(tax) : sale.tax;
      const paymentType = payment_type || sale.payment_type;
      const grandTotal = (sale.subtotal || 0) - discountAmount + taxAmount;
      
      let paidAmount = sale.paid_amount;
      if (paymentType === 'cash') {
        paidAmount = grandTotal;
      } else if (paymentType === 'credit') {
        paidAmount = 0;
      } else if (paymentType === 'split' && paid_amount !== undefined) {
        paidAmount = parseFloat(paid_amount);
      }

      await client.query(
        `UPDATE sales 
         SET discount = $1, tax = $2, total_amount = $3, 
             paid_amount = $4, payment_type = $5, updated_by = $6, updated_at = NOW()
         WHERE sale_id = $7`,
        [discountAmount, taxAmount, grandTotal, paidAmount, paymentType, userId, id]
      );
    }

    // Update customer balance if customer_id changed
    if (customer_id !== undefined && customer_id !== sale.customer_id) {
      // Recalculate balance for old customer
      if (sale.customer_id) {
        await client.query(
          `UPDATE customers 
           SET current_balance = opening_balance + 
               COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split')), 0) -
               COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
           WHERE customer_id = $1`,
          [sale.customer_id]
        );
      }
      // Recalculate balance for new customer
      if (customer_id) {
        await client.query(
          `UPDATE customers 
           SET current_balance = opening_balance + 
               COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split')), 0) -
               COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
           WHERE customer_id = $1`,
          [customer_id]
        );
      }
    } else if (customer_id && (paid_amount !== undefined || payment_type !== undefined)) {
      // Update balance if payment changed
      await client.query(
        `UPDATE customers 
         SET current_balance = opening_balance + 
             COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split')), 0) -
             COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
         WHERE customer_id = $1`,
        [customer_id]
      );
    }

    await client.query('COMMIT');

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'update',
      tableName: 'sales',
      recordId: parseInt(id),
      notes: `Updated invoice ${sale.invoice_number}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    // Fetch updated sale
    const [saleResult, itemsResult] = await Promise.all([
      db.query('SELECT * FROM sales WHERE sale_id = $1', [id]),
      db.query(
        `SELECT 
          si.*,
          p.name as product_name,
          p.item_name_english,
          p.sku
        FROM sale_items si
        JOIN products p ON si.product_id = p.product_id
        WHERE si.sale_id = $1`,
        [id]
      )
    ]);

    const saleData = saleResult.rows[0];
    saleData.payment_mode = saleData.payment_type || 'cash';
    
    res.json({
      ...saleData,
      items: itemsResult.rows.map(item => ({
        ...item,
        product_name: item.item_name_english || item.product_name || 'N/A',
        name: item.item_name_english || item.product_name || 'N/A'
      }))
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating sale:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to update sale',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// Delete sale (admin only)
router.delete('/:id', async (req, res) => {
  const client = await db.getClient();
  
  try {
    // Check if user is admin
    if (req.user.role !== 'administrator') {
      return res.status(403).json({ error: 'Only administrators can delete sales' });
    }
    
    await client.query('BEGIN');
    
    const { id } = req.params;
    const userId = req.user?.user_id || null;

    // Get sale info
    const saleResult = await client.query(
      'SELECT * FROM sales WHERE sale_id = $1',
      [id]
    );

    if (saleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const sale = saleResult.rows[0];

    // Check if finalized
    if (sale.is_finalized) {
      return res.status(400).json({ error: 'Cannot delete finalized invoice' });
    }

    // Get sale items to restore stock
    const itemsResult = await client.query(
      'SELECT product_id, quantity FROM sale_items WHERE sale_id = $1',
      [id]
    );

    // Restore stock for each item
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE products SET quantity_in_stock = quantity_in_stock + $1 WHERE product_id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Delete sale items
    await client.query('DELETE FROM sale_items WHERE sale_id = $1', [id]);

    // Update customer balance if customer exists
    if (sale.customer_id) {
      await client.query(
        `UPDATE customers 
         SET current_balance = opening_balance + 
             COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = $1 AND payment_type IN ('credit', 'split') AND sale_id != $2), 0) -
             COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = $1), 0)
         WHERE customer_id = $1`,
        [sale.customer_id, id]
      );
    }

    // Delete sale
    await client.query('DELETE FROM sales WHERE sale_id = $1', [id]);

    await client.query('COMMIT');

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'delete',
      tableName: 'sales',
      recordId: parseInt(id),
      oldValues: { invoice_number: sale.invoice_number, total_amount: sale.total_amount },
      notes: `Deleted invoice ${sale.invoice_number}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Sale deleted successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting sale:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to delete sale',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// Finalize invoice (prevent further editing)
router.post('/:id/finalize', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id || null;

    // Check if sale exists
    const saleCheck = await db.query(
      'SELECT sale_id, is_finalized FROM sales WHERE sale_id = $1',
      [id]
    );

    if (saleCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    if (saleCheck.rows[0].is_finalized) {
      return res.status(400).json({ error: 'Invoice is already finalized' });
    }

    // Finalize the invoice
    await db.query(
      `UPDATE sales 
       SET is_finalized = true, 
           finalized_at = NOW(), 
           finalized_by = $1,
           updated_by = $1
       WHERE sale_id = $2`,
      [userId, id]
    );

    // Log audit event
    await logAuditEvent({
      userId,
      action: 'finalize',
      tableName: 'sales',
      recordId: parseInt(id),
      notes: `Finalized invoice`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Invoice finalized successfully'
    });
  } catch (error) {
    console.error('Error finalizing invoice:', error);
    res.status(500).json({ error: 'Failed to finalize invoice', message: error.message });
  }
});

module.exports = router;

