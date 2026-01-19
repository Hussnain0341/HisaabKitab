-- HisaabKitab Database Schema
-- This script creates all required tables for the POS system
-- Run this script after creating the PostgreSQL database

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Settings table (for app configuration)
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    printer_config TEXT,
    language VARCHAR(10) DEFAULT 'en',
    other_app_settings JSONB
);

-- Suppliers table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    total_purchased DECIMAL(12, 2) DEFAULT 0,
    total_paid DECIMAL(12, 2) DEFAULT 0,
    balance DECIMAL(12, 2) DEFAULT 0
);

-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    category VARCHAR(100),
    purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL
);

-- Sales table
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(255),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_profit DECIMAL(12, 2) NOT NULL DEFAULT 0
);

-- Sale_Items table (line items for each sale)
CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    selling_price DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    profit DECIMAL(10, 2) NOT NULL
);

-- Purchases table (for stock purchases from suppliers)
CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INTEGER NOT NULL DEFAULT 1,
    purchase_price DECIMAL(10, 2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);

-- Additional useful indexes
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product ON sale_items(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);

-- Insert default settings
INSERT INTO settings (printer_config, language, other_app_settings) 
VALUES (
    NULL, 
    'en',
    '{"shop_name": "My Shop", "currency": "PKR", "tax_rate": 0}'::jsonb
) ON CONFLICT DO NOTHING;
