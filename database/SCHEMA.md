# HisaabKitab Database Schema

This document describes the database schema for the HisaabKitab POS system.

## Tables

### 1. Settings
Application configuration and settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| printer_config | TEXT | | Printer configuration JSON/text |
| language | VARCHAR(10) | DEFAULT 'en' | Application language |
| other_app_settings | JSONB | | Other app settings in JSON format |

### 2. Suppliers
Supplier information and financial tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| supplier_id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| name | VARCHAR(255) | NOT NULL | Supplier name |
| contact_number | VARCHAR(20) | | Contact phone number |
| total_purchased | DECIMAL(12,2) | DEFAULT 0 | Total amount purchased from supplier |
| total_paid | DECIMAL(12,2) | DEFAULT 0 | Total amount paid to supplier |
| balance | DECIMAL(12,2) | DEFAULT 0 | Outstanding balance (total_purchased - total_paid) |

### 3. Products
Product inventory and pricing information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| name | VARCHAR(255) | NOT NULL | Product name |
| sku | VARCHAR(100) | | Stock Keeping Unit (barcode) |
| category | VARCHAR(100) | | Product category |
| purchase_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Cost price from supplier |
| selling_price | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Selling price to customers |
| quantity_in_stock | INTEGER | NOT NULL, DEFAULT 0 | Current stock quantity |
| supplier_id | INTEGER | FK → suppliers.supplier_id | Reference to supplier (nullable) |

**Foreign Key:**
- `supplier_id` → `suppliers(supplier_id)` ON DELETE SET NULL

### 4. Sales
Sales transactions and invoices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sale_id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| invoice_number | VARCHAR(50) | UNIQUE, NOT NULL | Unique invoice/bill number |
| date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Sale date and time |
| customer_name | VARCHAR(255) | | Customer name (optional) |
| total_amount | DECIMAL(12,2) | NOT NULL, DEFAULT 0 | Total sale amount |
| total_profit | DECIMAL(12,2) | NOT NULL, DEFAULT 0 | Total profit from this sale |

### 5. Sale_Items
Line items for each sale/invoice.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| sale_item_id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| sale_id | INTEGER | NOT NULL, FK → sales.sale_id | Reference to sale |
| product_id | INTEGER | NOT NULL, FK → products.product_id | Reference to product |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Quantity sold |
| selling_price | DECIMAL(10,2) | NOT NULL | Price per unit at time of sale |
| purchase_price | DECIMAL(10,2) | NOT NULL | Cost price at time of sale |
| profit | DECIMAL(10,2) | NOT NULL | Profit per line item: (selling_price - purchase_price) × quantity |

**Foreign Keys:**
- `sale_id` → `sales(sale_id)` ON DELETE CASCADE
- `product_id` → `products(product_id)`

### 6. Purchases
Purchase transactions from suppliers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| purchase_id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| product_id | INTEGER | NOT NULL, FK → products.product_id | Reference to product |
| supplier_id | INTEGER | NOT NULL, FK → suppliers.supplier_id | Reference to supplier |
| date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Purchase date and time |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Quantity purchased |
| purchase_price | DECIMAL(10,2) | NOT NULL | Purchase price per unit |

**Foreign Keys:**
- `product_id` → `products(product_id)` ON DELETE CASCADE
- `supplier_id` → `suppliers(supplier_id)`

## Indexes

### Primary Indexes (Required)
1. **idx_products_sku** on `products(sku)` - Fast SKU lookups
2. **idx_sales_invoice_number** on `sales(invoice_number)` - Fast invoice lookups
3. **idx_sale_items_sale_id** on `sale_items(sale_id)` - Fast sale items retrieval

### Additional Performance Indexes
4. **idx_products_supplier** on `products(supplier_id)` - Filter products by supplier
5. **idx_sale_items_product** on `sale_items(product_id)` - Track product sales
6. **idx_purchases_product** on `purchases(product_id)` - Track product purchases
7. **idx_purchases_supplier** on `purchases(supplier_id)` - Filter purchases by supplier
8. **idx_sales_date** on `sales(date)` - Date-based sales queries

## Relationships

```
Suppliers (1) ──< (0..N) Products
Suppliers (1) ──< (0..N) Purchases
Products (1) ──< (0..N) Sale_Items
Products (1) ──< (0..N) Purchases
Sales (1) ──< (1..N) Sale_Items
```

## Data Flow

1. **Product Creation**: Add product → `products` table
2. **Purchase Stock**: Purchase from supplier → `purchases` table → Update `products.quantity_in_stock` → Update `suppliers.total_purchased`
3. **Make Sale**: Create sale → `sales` table + `sale_items` → Update `products.quantity_in_stock` → Calculate and store profit
4. **Supplier Payment**: Record payment → Update `suppliers.total_paid` → Recalculate `suppliers.balance`

## Notes

- **Profit Calculation**: Profit is stored at sale time for historical accuracy (preserves profit even if prices change later)
- **Stock Management**: `products.quantity_in_stock` should be updated via application logic when purchases or sales occur
- **Supplier Balance**: `suppliers.balance` = `total_purchased` - `total_paid` (can be recalculated as needed)
- **Cascade Deletes**: 
  - Deleting a sale automatically deletes all its sale_items
  - Deleting a product automatically deletes all its purchases
  - Deleting a supplier sets product `supplier_id` to NULL (doesn't delete products)

## Default Data

The schema includes default settings entry:
- Language: 'en' (English)
- Other settings: JSON object with shop_name, currency (PKR), and tax_rate





