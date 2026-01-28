-- ============================================
-- HISAABKITAB COMPLETE DATABASE SCHEMA
-- ============================================
-- This is a complete, end-to-end SQL script that creates all required tables
-- Run this script in pgAdmin on your 'hisaabkitab' database
-- ============================================

-- ============================================
-- PART 1: CORE POS TABLES
-- ============================================

-- Settings table (for app configuration)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    printer_config TEXT,
    language VARCHAR(10) DEFAULT 'en',
    other_app_settings JSONB,
    first_time_setup_complete BOOLEAN DEFAULT false
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    total_purchased DECIMAL(12, 2) DEFAULT 0,
    total_paid DECIMAL(12, 2) DEFAULT 0,
    balance DECIMAL(12, 2) DEFAULT 0,
    opening_balance DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    category VARCHAR(100),
    purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    barcode VARCHAR(100),
    tax_percentage DECIMAL(5, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    category_id INTEGER,
    sub_category_id INTEGER,
    -- Electric shop specific fields
    item_name_english VARCHAR(255),
    item_name_urdu VARCHAR(255),
    retail_price DECIMAL(10, 2),
    wholesale_price DECIMAL(10, 2),
    special_price DECIMAL(10, 2),
    unit_type VARCHAR(50) DEFAULT 'piece' CHECK (unit_type IN ('piece', 'packet', 'meter', 'box', 'kg', 'roll')),
    is_frequently_sold BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    sale_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(255),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_profit DECIMAL(12, 2) NOT NULL DEFAULT 0,
    customer_id INTEGER,
    payment_type VARCHAR(20) DEFAULT 'cash' CHECK (payment_type IN ('cash', 'card', 'credit', 'split')),
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    tax DECIMAL(12, 2) DEFAULT 0,
    subtotal DECIMAL(12, 2) DEFAULT 0,
    -- Invoice integrity and tracking columns
    is_finalized BOOLEAN DEFAULT false,
    finalized_at TIMESTAMP,
    finalized_by INTEGER,
    created_by INTEGER,
    updated_by INTEGER
);

-- Sale_Items table (line items for each sale)
CREATE TABLE IF NOT EXISTS sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    selling_price DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    profit DECIMAL(10, 2) NOT NULL
);

-- Purchases table (for stock purchases from suppliers)
CREATE TABLE IF NOT EXISTS purchases (
    purchase_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(10, 2),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    payment_type VARCHAR(20) DEFAULT 'cash' CHECK (payment_type IN ('cash', 'credit')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PART 2: EXTENDED FEATURES TABLES
-- ============================================

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    opening_balance DECIMAL(12, 2) DEFAULT 0,
    current_balance DECIMAL(12, 2) DEFAULT 0,
    credit_limit NUMERIC(10, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    -- Electric shop specific field
    customer_type VARCHAR(20) DEFAULT 'walk-in' CHECK (customer_type IN ('walk-in', 'retail', 'wholesale', 'special'))
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sub_categories table
CREATE TABLE IF NOT EXISTS sub_categories (
    sub_category_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    sub_category_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, sub_category_name)
);

-- Purchase_items table (for detailed purchase line items)
CREATE TABLE IF NOT EXISTS purchase_items (
    purchase_item_id SERIAL PRIMARY KEY,
    purchase_id INTEGER NOT NULL REFERENCES purchases(purchase_id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    cost_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL
);

-- Customer_payments table
CREATE TABLE IF NOT EXISTS customer_payments (
    payment_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily_expenses table
CREATE TABLE IF NOT EXISTS daily_expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supplier_payments table
CREATE TABLE IF NOT EXISTS supplier_payments (
    payment_id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'cheque', 'other')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PART 3: SECURITY SYSTEM TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'cashier' CHECK (role IN ('administrator', 'cashier')),
    pin_hash VARCHAR(255), -- Optional 4-digit PIN (bcrypt hash)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    password_reset_token VARCHAR(255), -- For password recovery
    password_reset_expires TIMESTAMP,
    security_question TEXT, -- For password recovery
    security_answer_hash VARCHAR(255) -- Hashed answer
);

-- User Sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    device_id VARCHAR(255), -- Device fingerprint
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view', 'login', 'logout', etc.
    table_name VARCHAR(100), -- Which table was affected
    record_id INTEGER, -- ID of the affected record
    old_values JSONB, -- Previous values (for updates/deletes)
    new_values JSONB, -- New values (for creates/updates)
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT -- Additional context
);

-- Encryption Keys table
CREATE TABLE IF NOT EXISTS encryption_keys (
    key_id SERIAL PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    encrypted_key TEXT NOT NULL, -- Base64 encoded encrypted key
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PART 4: NOTIFICATIONS SYSTEM
-- ============================================

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(500), -- Optional link to related resource
    metadata JSONB -- Additional data like sale_id, product_id, etc.
);

-- ============================================
-- PART 5: LICENSE SYSTEM TABLES
-- ============================================

-- License Info Table (stores encrypted license data locally)
CREATE TABLE IF NOT EXISTS license_info (
    id SERIAL PRIMARY KEY,
    license_id VARCHAR(255) UNIQUE,
    tenant_id VARCHAR(255),
    tenant_name VARCHAR(255), -- Added for display purposes
    license_key VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    device_fingerprint TEXT NOT NULL,
    expires_at TIMESTAMP,
    last_validated_at TIMESTAMP,
    last_verified_at TIMESTAMP, -- Last successful server verification
    validation_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    status VARCHAR(50), -- License status: active, expired, revoked (NULL = active)
    pending_status VARCHAR(50), -- For two-step downgrade (expired/revoked)
    pending_status_count INTEGER DEFAULT 0, -- Count of consecutive pending status
    features JSONB DEFAULT '{}',
    max_users INTEGER DEFAULT 1,
    max_devices INTEGER DEFAULT 1,
    app_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Explicit activation timestamp
    last_known_valid_date TIMESTAMP, -- For clock tampering protection
    UNIQUE(license_key, device_id)
);

-- License Logs Table (for debugging and support)
CREATE TABLE IF NOT EXISTS license_logs (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(255),
    device_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    error_details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PART 6: SCHEMA VERSION METADATA
-- ============================================

-- Schema version tracking table (for migrations and upgrades)
CREATE TABLE IF NOT EXISTS schema_version (
  id SERIAL PRIMARY KEY,
  version INTEGER NOT NULL UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  success BOOLEAN DEFAULT true
);

-- Insert initial version (0) if not exists
INSERT INTO schema_version (version, description, success)
SELECT 0, 'Initial schema version', true
WHERE NOT EXISTS (
  SELECT 1 FROM schema_version WHERE version = 0
);

-- ============================================
-- PART 7: FOREIGN KEY CONSTRAINTS
-- ============================================

-- Add foreign keys for products table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey'
    ) THEN
        ALTER TABLE products 
            ADD CONSTRAINT products_category_id_fkey 
            FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_sub_category_id_fkey'
    ) THEN
        ALTER TABLE products 
            ADD CONSTRAINT products_sub_category_id_fkey 
            FOREIGN KEY (sub_category_id) REFERENCES sub_categories(sub_category_id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add foreign key for sales table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sales_customer_id_fkey'
    ) THEN
        ALTER TABLE sales 
            ADD CONSTRAINT sales_customer_id_fkey 
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL;
    END IF;
    
    -- Add foreign keys for sales tracking columns
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sales_finalized_by_fkey'
    ) THEN
        ALTER TABLE sales 
            ADD CONSTRAINT sales_finalized_by_fkey 
            FOREIGN KEY (finalized_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sales_created_by_fkey'
    ) THEN
        ALTER TABLE sales 
            ADD CONSTRAINT sales_created_by_fkey 
            FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sales_updated_by_fkey'
    ) THEN
        ALTER TABLE sales 
            ADD CONSTRAINT sales_updated_by_fkey 
            FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- PART 8: INDEXES FOR PERFORMANCE
-- ============================================

-- Core tables indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_frequently_sold ON products(is_frequently_sold) WHERE is_frequently_sold = true;
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_subcategory ON products(category_id, sub_category_id);

CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_payment_type ON sales(payment_type);
CREATE INDEX IF NOT EXISTS idx_sales_finalized ON sales(is_finalized) WHERE is_finalized = true;
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON sales(created_by);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);

CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);

-- Extended features indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);

CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

CREATE INDEX IF NOT EXISTS idx_sub_categories_category ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_status ON sub_categories(status);

CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase ON purchase_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_item ON purchase_items(item_id);

CREATE INDEX IF NOT EXISTS idx_customer_payments_customer ON customer_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_date ON customer_payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON daily_expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON daily_expenses(expense_category);

CREATE INDEX IF NOT EXISTS idx_supplier_payments_supplier ON supplier_payments(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_payments_date ON supplier_payments(payment_date);

-- Security system indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- License system indexes
CREATE INDEX IF NOT EXISTS idx_license_info_license_key ON license_info(license_key);
CREATE INDEX IF NOT EXISTS idx_license_info_device_id ON license_info(device_id);
CREATE INDEX IF NOT EXISTS idx_license_info_active ON license_info(is_active);
CREATE INDEX IF NOT EXISTS idx_license_info_status ON license_info(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_pending_status ON license_info(pending_status) WHERE pending_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_last_verified ON license_info(last_verified_at) WHERE last_verified_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_device_active ON license_info(device_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_license_logs_license_key ON license_logs(license_key);
CREATE INDEX IF NOT EXISTS idx_license_logs_created_at ON license_logs(created_at);

-- ============================================
-- PART 9: FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update license_info updated_at timestamp
CREATE OR REPLACE FUNCTION update_license_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update license_info updated_at
DROP TRIGGER IF EXISTS trigger_update_license_info_updated_at ON license_info;
CREATE TRIGGER trigger_update_license_info_updated_at
    BEFORE UPDATE ON license_info
    FOR EACH ROW
    EXECUTE FUNCTION update_license_info_updated_at();

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

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to log audit changes
CREATE OR REPLACE FUNCTION log_audit_change()
RETURNS TRIGGER AS $$
DECLARE
    current_user_id INTEGER;
BEGIN
    -- Get current user ID from session (if available)
    -- This will be set by the application layer
    current_user_id := current_setting('app.current_user_id', true)::INTEGER;
    
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'delete', TG_TABLE_NAME, OLD.id, 
            row_to_json(OLD)::jsonb, NULL
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'update', TG_TABLE_NAME, NEW.id,
            row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'create', TG_TABLE_NAME, NEW.id,
            NULL, row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is the last administrator
CREATE OR REPLACE FUNCTION is_last_administrator(check_user_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count
    FROM users
    WHERE role = 'administrator' 
    AND is_active = true
    AND user_id != check_user_id;
    
    RETURN admin_count = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id INTEGER,
    p_title VARCHAR,
    p_message TEXT,
    p_type VARCHAR DEFAULT 'info',
    p_link VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_notification_id INTEGER;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, link, metadata)
    VALUES (p_user_id, p_title, p_message, p_type, p_link, p_metadata)
    RETURNING notification_id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 10: DEFAULT DATA & MIGRATIONS
-- ============================================

-- Insert default settings
INSERT INTO settings (printer_config, language, other_app_settings, first_time_setup_complete) 
VALUES (
    NULL, 
    'en',
    '{"shop_name": "My Shop", "currency": "PKR", "tax_rate": 0}'::jsonb,
    false
) ON CONFLICT DO NOTHING;

-- Ensure "General" category exists
INSERT INTO categories (category_name, status)
SELECT 'General', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE LOWER(category_name) = 'general'
);

-- Ensure General category is active
UPDATE categories 
SET status = 'active'
WHERE LOWER(category_name) = 'general';

-- Update existing sales: set subtotal = total_amount, paid_amount = total_amount for existing records
UPDATE sales SET subtotal = total_amount, paid_amount = total_amount 
WHERE (subtotal IS NULL OR subtotal = 0) AND total_amount > 0;

-- Migrate products data for electric shop features (if columns exist)
UPDATE products 
SET 
    item_name_english = COALESCE(item_name_english, name),
    retail_price = COALESCE(retail_price, selling_price),
    wholesale_price = COALESCE(wholesale_price, selling_price)
WHERE (item_name_english IS NULL OR retail_price IS NULL) AND name IS NOT NULL;

-- Set existing customers with balances to 'retail' type
UPDATE customers SET customer_type = 'retail' 
WHERE customer_type IS NULL AND opening_balance != 0;

-- Set last_verified_at for existing licenses (use last_validated_at if available)
UPDATE license_info 
SET last_verified_at = COALESCE(last_validated_at, CURRENT_TIMESTAMP)
WHERE last_verified_at IS NULL;

-- Set activated_at for existing licenses
UPDATE license_info 
SET activated_at = COALESCE(created_at, CURRENT_TIMESTAMP)
WHERE activated_at IS NULL;

-- Set last_known_valid_date for existing active licenses
UPDATE license_info 
SET last_known_valid_date = CURRENT_DATE
WHERE is_active = true AND last_known_valid_date IS NULL;

-- CRITICAL: Auto-fix revoked licenses (set is_active = false where status = 'revoked')
UPDATE license_info 
SET is_active = false 
WHERE status = 'revoked' AND is_active = true;

-- CRITICAL: Auto-fix inactive licenses (set status = 'revoked' where is_active = false)
UPDATE license_info 
SET status = 'revoked' 
WHERE is_active = false AND (status IS NULL OR status = '');

-- ============================================
-- PART 11: COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE customers IS 'Customer master data with opening and current balance';
COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE sub_categories IS 'Product sub-categories linked to categories';
COMMENT ON TABLE customer_payments IS 'Customer loan/payment transactions';
COMMENT ON TABLE daily_expenses IS 'Daily expense tracking';
COMMENT ON TABLE supplier_payments IS 'Supplier payment transactions';
COMMENT ON TABLE purchase_items IS 'Line items for each purchase order';
COMMENT ON TABLE license_info IS 'Encrypted license information for activation and validation';
COMMENT ON TABLE license_logs IS 'License action logs for debugging and support';
COMMENT ON TABLE users IS 'User accounts with roles (administrator, cashier)';
COMMENT ON TABLE user_sessions IS 'Active user sessions for authentication';
COMMENT ON TABLE audit_logs IS 'Audit trail for sensitive operations';
COMMENT ON TABLE notifications IS 'User notifications system';
COMMENT ON TABLE encryption_keys IS 'Encrypted keys for sensitive data';

COMMENT ON COLUMN customers.credit_limit IS 'Maximum credit limit for credit customers (optional)';
COMMENT ON COLUMN purchases.product_id IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';
COMMENT ON COLUMN purchases.quantity IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';
COMMENT ON COLUMN purchases.purchase_price IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';
COMMENT ON COLUMN sales.is_finalized IS 'Flag to prevent modification after invoice is finalized';
COMMENT ON COLUMN sales.finalized_by IS 'User who finalized the invoice';
COMMENT ON COLUMN settings.first_time_setup_complete IS 'Flag to track if initial setup wizard has been completed';

-- ============================================
-- END OF SCHEMA
-- ============================================
-- All tables, indexes, triggers, functions, and default data have been created.
-- Your database is now ready to use!
-- ============================================
