const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to get date range for periods
function getDateRange(period) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate, endDate;

  switch (period) {
    case 'daily':
      startDate = new Date(today);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'weekly':
      // Get start of current week (Monday)
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'last3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'last6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      startDate = null;
      endDate = null;
  }

  return { startDate, endDate };
}

// Get comprehensive report with sales, purchases, and cash
router.get('/comprehensive', async (req, res) => {
  try {
    const { period = 'monthly', productId, supplierId } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Build WHERE clause for date filtering
    let dateWhere = '';
    let params = [];
    let paramIndex = 1;

    if (startDate && endDate) {
      dateWhere = `WHERE s.date >= $${paramIndex} AND s.date <= $${paramIndex + 1}`;
      params.push(startDate, endDate);
      paramIndex += 2;
    }

    // Build filters
    let salesWhere = dateWhere;
    let purchasesWhere = dateWhere.replace(/s\.date/g, 'p.date');

    if (productId) {
      const productFilter = dateWhere ? 'AND' : 'WHERE';
      salesWhere += ` ${productFilter} EXISTS (SELECT 1 FROM sale_items si WHERE si.sale_id = s.sale_id AND si.product_id = $${paramIndex})`;
      purchasesWhere += ` ${productFilter} p.product_id = $${paramIndex}`;
      params.push(parseInt(productId));
      paramIndex++;
    }

    if (supplierId) {
      const supplierFilter = (dateWhere || productId) ? 'AND' : 'WHERE';
      salesWhere += ` ${supplierFilter} EXISTS (
        SELECT 1 FROM sale_items si 
        JOIN products pr ON si.product_id = pr.product_id 
        WHERE si.sale_id = s.sale_id AND pr.supplier_id = $${paramIndex}
      )`;
      purchasesWhere += ` ${supplierFilter} p.supplier_id = $${paramIndex}`;
      params.push(parseInt(supplierId));
      paramIndex++;
    }

    // Get sales data
    const salesQuery = `
      SELECT 
        s.sale_id,
        s.invoice_number,
        s.date,
        s.customer_name,
        s.total_amount,
        s.total_profit
      FROM sales s
      ${salesWhere}
      ORDER BY s.date DESC
    `;

    // Get purchases data
    const purchasesQuery = `
      SELECT 
        p.purchase_id,
        p.date,
        p.quantity,
        p.purchase_price,
        (p.quantity * p.purchase_price) as total_amount,
        pr.name as product_name,
        s.name as supplier_name
      FROM purchases p
      JOIN products pr ON p.product_id = pr.product_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ${purchasesWhere}
      ORDER BY p.date DESC
    `;

    const [salesResult, purchasesResult] = await Promise.all([
      db.query(salesQuery, params),
      db.query(purchasesQuery, params),
    ]);

    // Calculate totals
    let totalSales = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let totalPurchases = 0;

    salesResult.rows.forEach(sale => {
      totalSales += parseFloat(sale.total_amount);
      const profit = parseFloat(sale.total_profit);
      if (profit >= 0) {
        totalProfit += profit;
      } else {
        totalLoss += Math.abs(profit);
      }
    });

    purchasesResult.rows.forEach(purchase => {
      totalPurchases += parseFloat(purchase.total_amount);
    });

    const netProfit = totalProfit - totalLoss;
    // Cash in hand = Total Sales - Total Purchases (simplified calculation)
    // In a real system, this would account for payments to suppliers, expenses, etc.
    const cashInHand = totalSales - totalPurchases;

    res.json({
      period,
      dateRange: {
        start: startDate ? startDate.toISOString() : null,
        end: endDate ? endDate.toISOString() : null,
      },
      totals: {
        totalSales,
        totalProfit,
        totalLoss,
        netProfit,
        totalPurchases,
        cashInHand,
      },
      sales: salesResult.rows,
      purchases: purchasesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching comprehensive report:', error);
    res.status(500).json({ error: 'Failed to fetch report', message: error.message });
  }
});

// Get all products for filter dropdown
router.get('/products', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT product_id, name FROM products ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

// Get all suppliers for filter dropdown
router.get('/suppliers', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT supplier_id, name FROM suppliers ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers', message: error.message });
  }
});

// Stock Report - All products with stock levels
router.get('/stock', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.product_id,
        p.name,
        p.sku,
        p.category,
        p.purchase_price,
        p.selling_price,
        p.quantity_in_stock,
        s.name as supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.quantity_in_stock ASC, p.name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stock report:', error);
    res.status(500).json({ error: 'Failed to fetch stock report', message: error.message });
  }
});

// Customer Outstanding Report
router.get('/customers-outstanding', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        customer_id,
        name,
        phone,
        current_balance,
        opening_balance
      FROM customers
      WHERE current_balance != 0
      ORDER BY ABS(current_balance) DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customer outstanding:', error);
    res.status(500).json({ error: 'Failed to fetch customer outstanding', message: error.message });
  }
});

// Supplier Payable Report
router.get('/suppliers-payable', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        supplier_id,
        name,
        contact_number,
        balance,
        total_purchased,
        total_paid
      FROM suppliers
      WHERE balance != 0
      ORDER BY ABS(balance) DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching supplier payable:', error);
    res.status(500).json({ error: 'Failed to fetch supplier payable', message: error.message });
  }
});

module.exports = router;
