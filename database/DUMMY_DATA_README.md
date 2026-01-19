# Dummy Data Insertion Script

This script inserts 100+ realistic dummy records for each table in the HisaabKitab database to help with testing.

## What Data is Inserted

- **100+ Suppliers** - Pakistani supplier names with contact numbers and balances
- **30 Categories** - Product categories (Electrical, Plumbing, Hardware, etc.)
- **100+ Sub-Categories** - Detailed sub-categories linked to categories
- **100+ Customers** - Customers with different types (walk-in, retail, wholesale, special)
- **100+ Products** - Products with English/Urdu names, multiple prices, stock levels
- **100+ Purchases** - Purchase orders from suppliers over the last 6 months
- **300+ Purchase Items** - Detailed line items for purchases
- **100+ Sales** - Sales invoices over the last 6 months
- **500+ Sale Items** - Detailed line items for sales
- **100+ Daily Expenses** - Various expense records
- **100+ Customer Payments** - Payment records for customer balances
- **100+ Supplier Payments** - Payment records for supplier balances

## Prerequisites

1. All database migrations must be completed:
   - `init.sql`
   - `migration_add_full_features.sql`
   - `migration_electric_shop.sql` (if applicable)

2. PostgreSQL database must be running and accessible

## How to Run

### Option 1: Using psql command line

```bash
# Navigate to database folder
cd E:\POS\HisaabKitab\database

# Run the script
psql -U hisaab_user -d hisaabkitab_db -f insert_dummy_data.sql
```

### Option 2: Using psql interactive mode

```bash
# Connect to database
psql -U hisaab_user -d hisaabkitab_db

# Run the script
\i insert_dummy_data.sql
```

### Option 3: Using pgAdmin or other GUI tools

1. Open pgAdmin or your preferred PostgreSQL GUI
2. Connect to your database
3. Open Query Tool
4. Open the file `insert_dummy_data.sql`
5. Execute the script

## Expected Execution Time

The script should complete in 1-3 minutes depending on your system performance.

## Data Characteristics

- **Dates**: Spread over the last 6 months
- **Amounts**: Realistic Pakistani Rupee amounts
- **Relationships**: All foreign keys are properly maintained
- **Balances**: Automatically calculated based on transactions
- **Stock**: Updated based on purchases and sales

## Resetting Data

If you want to clear all data and start fresh:

```sql
-- WARNING: This will delete ALL data from all tables
TRUNCATE TABLE sale_items CASCADE;
TRUNCATE TABLE sales CASCADE;
TRUNCATE TABLE purchase_items CASCADE;
TRUNCATE TABLE purchases CASCADE;
TRUNCATE TABLE customer_payments CASCADE;
TRUNCATE TABLE supplier_payments CASCADE;
TRUNCATE TABLE daily_expenses CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE customers CASCADE;
TRUNCATE TABLE sub_categories CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE suppliers CASCADE;
-- Settings table is not truncated to preserve configuration
```

Then run `insert_dummy_data.sql` again.

## Verification

After running the script, verify data was inserted:

```sql
-- Check record counts
SELECT 'Suppliers' as table_name, COUNT(*) as count FROM suppliers
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Sub-Categories', COUNT(*) FROM sub_categories
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Purchases', COUNT(*) FROM purchases
UNION ALL
SELECT 'Purchase Items', COUNT(*) FROM purchase_items
UNION ALL
SELECT 'Sales', COUNT(*) FROM sales
UNION ALL
SELECT 'Sale Items', COUNT(*) FROM sale_items
UNION ALL
SELECT 'Expenses', COUNT(*) FROM daily_expenses
UNION ALL
SELECT 'Customer Payments', COUNT(*) FROM customer_payments
UNION ALL
SELECT 'Supplier Payments', COUNT(*) FROM supplier_payments;
```

Expected counts:
- Suppliers: 100+
- Categories: 30
- Sub-Categories: 100+
- Customers: 100+
- Products: 100+
- Purchases: 100+
- Purchase Items: 300+
- Sales: 100+
- Sale Items: 500+
- Expenses: 100+
- Customer Payments: 100+
- Supplier Payments: 100+

## Notes

- The script uses PostgreSQL-specific features (DO blocks, arrays)
- All data is in English with some Urdu placeholders
- Phone numbers follow Pakistani format
- Amounts are in PKR (Pakistani Rupees)
- Dates are randomly distributed over the last 6 months
- Stock quantities are automatically calculated from purchases and sales





