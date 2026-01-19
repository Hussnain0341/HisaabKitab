-- Migration Script: Add Full POS Features
-- This script extends the existing schema with all required features
-- Run this script on the existing database to add missing tables and columns

-- ============================================
-- 1. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    opening_balance DECIMAL(12, 2) DEFAULT 0,
    current_balance DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- ============================================
-- 2. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

-- ============================================
-- 3. SUB_CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sub_categories (
    sub_category_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    sub_category_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, sub_category_name)
);

CREATE INDEX IF NOT EXISTS idx_sub_categories_category ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_status ON sub_categories(status);

-- ============================================
-- 4. UPDATE PRODUCTS TABLE
-- ============================================
-- Add missing columns to products
ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
    ADD COLUMN IF NOT EXISTS tax_percentage DECIMAL(5, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS sub_category_id INTEGER REFERENCES sub_categories(sub_category_id) ON DELETE SET NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- Migrate existing category text to categories table if needed
-- (This is a one-time migration - you may need to manually populate categories from existing category text)

-- ============================================
-- 5. UPDATE SALES TABLE
-- ============================================
ALTER TABLE sales
    ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(customer_id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'cash' CHECK (payment_type IN ('cash', 'card', 'credit', 'split')),
    ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS discount DECIMAL(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS tax DECIMAL(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12, 2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_payment_type ON sales(payment_type);

-- Update existing sales: set subtotal = total_amount, paid_amount = total_amount for existing records
UPDATE sales SET subtotal = total_amount, paid_amount = total_amount WHERE subtotal IS NULL OR subtotal = 0;

-- ============================================
-- 6. PURCHASE_ITEMS TABLE (for detailed purchase line items)
-- ============================================
CREATE TABLE IF NOT EXISTS purchase_items (
    purchase_item_id SERIAL PRIMARY KEY,
    purchase_id INTEGER NOT NULL REFERENCES purchases(purchase_id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    cost_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_item ON purchase_items(item_id);

-- ============================================
-- 7. UPDATE PURCHASES TABLE
-- ============================================
ALTER TABLE purchases
    ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'cash' CHECK (payment_type IN ('cash', 'credit')),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- If purchases table doesn't have proper structure, migrate old data
-- (Assuming old purchases table has product_id, quantity, purchase_price)
-- We'll handle this in the purchase route logic

-- ============================================
-- 8. CUSTOMER_PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_payments (
    payment_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_payments_customer ON customer_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_date ON customer_payments(payment_date);

-- ============================================
-- 9. DAILY_EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS daily_expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON daily_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON daily_expenses(expense_category);

-- ============================================
-- 10. SUPPLIER PAYMENTS TABLE (for tracking supplier payments)
-- ============================================
CREATE TABLE IF NOT EXISTS supplier_payments (
    payment_id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'cheque', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_payments_supplier ON supplier_payments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_payments_date ON supplier_payments(payment_date);

-- ============================================
-- 11. UPDATE SUPPLIERS TABLE
-- ============================================
ALTER TABLE suppliers
    ADD COLUMN IF NOT EXISTS opening_balance DECIMAL(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ensure balance is calculated correctly: balance = opening_balance + total_purchased - total_paid
-- This will be maintained by triggers or application logic

-- ============================================
-- 12. FUNCTIONS & TRIGGERS (Optional - for auto-balance calculation)
-- ============================================

-- Function to update customer balance
CREATE OR REPLACE FUNCTION update_customer_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE customers
    SET current_balance = opening_balance + 
        COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = customers.customer_id AND payment_type IN ('credit', 'split')), 0) -
        COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = customers.customer_id), 0)
    WHERE customer_id = COALESCE(NEW.customer_id, OLD.customer_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for sales (credit)
DROP TRIGGER IF EXISTS trigger_update_customer_balance_sales ON sales;
CREATE TRIGGER trigger_update_customer_balance_sales
    AFTER INSERT OR UPDATE OR DELETE ON sales
    FOR EACH ROW EXECUTE FUNCTION update_customer_balance();

-- Trigger for customer payments
DROP TRIGGER IF EXISTS trigger_update_customer_balance_payments ON customer_payments;
CREATE TRIGGER trigger_update_customer_balance_payments
    AFTER INSERT OR UPDATE OR DELETE ON customer_payments
    FOR EACH ROW EXECUTE FUNCTION update_customer_balance();

-- Function to update supplier payable balance
CREATE OR REPLACE FUNCTION update_supplier_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE suppliers
    SET balance = opening_balance + 
        COALESCE((SELECT SUM(total_amount) FROM purchases WHERE supplier_id = suppliers.supplier_id AND payment_type = 'credit'), 0) -
        COALESCE((SELECT SUM(amount) FROM supplier_payments WHERE supplier_id = suppliers.supplier_id), 0)
    WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for purchases (credit)
DROP TRIGGER IF EXISTS trigger_update_supplier_balance_purchases ON purchases;
CREATE TRIGGER trigger_update_supplier_balance_purchases
    AFTER INSERT OR UPDATE OR DELETE ON purchases
    FOR EACH ROW EXECUTE FUNCTION update_supplier_balance();

-- Trigger for supplier payments
DROP TRIGGER IF EXISTS trigger_update_supplier_balance_payments ON supplier_payments;
CREATE TRIGGER trigger_update_supplier_balance_payments
    AFTER INSERT OR UPDATE OR DELETE ON supplier_payments
    FOR EACH ROW EXECUTE FUNCTION update_supplier_balance();

-- ============================================
-- 13. COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE customers IS 'Customer master data with opening and current balance';
COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE sub_categories IS 'Product sub-categories linked to categories';
COMMENT ON TABLE customer_payments IS 'Customer loan/payment transactions';
COMMENT ON TABLE daily_expenses IS 'Daily expense tracking';
COMMENT ON TABLE supplier_payments IS 'Supplier payment transactions';
COMMENT ON TABLE purchase_items IS 'Line items for each purchase order';

-- ============================================
-- END OF MIGRATION
-- ============================================

