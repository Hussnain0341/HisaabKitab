-- Migration: Electric Shop Specific Features
-- This script updates the schema for electric wholesale + retail shop workflow
-- Run this AFTER migration_add_full_features.sql

-- ============================================
-- 1. UPDATE PRODUCTS TABLE (Items Master)
-- ============================================

-- Rename name to item_name_english (keep both for compatibility)
ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS item_name_english VARCHAR(255),
    ADD COLUMN IF NOT EXISTS item_name_urdu VARCHAR(255),
    ADD COLUMN IF NOT EXISTS retail_price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS wholesale_price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS special_price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS unit_type VARCHAR(50) DEFAULT 'piece' CHECK (unit_type IN ('piece', 'packet', 'meter', 'box', 'kg', 'roll')),
    ADD COLUMN IF NOT EXISTS is_frequently_sold BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Migrate existing data: name -> item_name_english, selling_price -> retail_price
UPDATE products 
SET 
    item_name_english = COALESCE(item_name_english, name),
    retail_price = COALESCE(retail_price, selling_price),
    wholesale_price = COALESCE(wholesale_price, selling_price)
WHERE item_name_english IS NULL OR retail_price IS NULL;

-- Make item_name_english NOT NULL after migration
ALTER TABLE products 
    ALTER COLUMN item_name_english SET NOT NULL,
    ALTER COLUMN retail_price SET NOT NULL;

-- Update selling_price to be retail_price (for backward compatibility)
-- Keep both fields, selling_price will reference retail_price
UPDATE products SET selling_price = retail_price WHERE selling_price != retail_price;

-- Create indexes for electric shop features
CREATE INDEX IF NOT EXISTS idx_products_frequently_sold ON products(is_frequently_sold) WHERE is_frequently_sold = true;
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_subcategory ON products(category_id, sub_category_id);

-- ============================================
-- 2. UPDATE CUSTOMERS TABLE (Customer Types)
-- ============================================

ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS customer_type VARCHAR(20) DEFAULT 'walk-in' 
        CHECK (customer_type IN ('walk-in', 'retail', 'wholesale', 'special'));

-- Set existing customers with balances to 'retail' type
UPDATE customers SET customer_type = 'retail' WHERE customer_type IS NULL AND opening_balance != 0;

-- Create index
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);

-- ============================================
-- 3. UPDATE PRODUCTS: Link to Categories Properly
-- ============================================

-- If products.category is text, migrate to category_id if possible
-- This is a best-effort migration - may need manual cleanup
DO $$
DECLARE
    cat_record RECORD;
    cat_id_var INTEGER;
BEGIN
    -- For each unique category text value, create category if doesn't exist
    FOR cat_record IN SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' AND category_id IS NULL
    LOOP
        -- Check if category exists
        SELECT category_id INTO cat_id_var 
        FROM categories 
        WHERE LOWER(category_name) = LOWER(cat_record.category) 
        LIMIT 1;
        
        -- If doesn't exist, create it
        IF cat_id_var IS NULL THEN
            INSERT INTO categories (category_name, status) 
            VALUES (cat_record.category, 'active')
            RETURNING category_id INTO cat_id_var;
        END IF;
        
        -- Update products with this category text to use category_id
        UPDATE products 
        SET category_id = cat_id_var 
        WHERE category = cat_record.category AND category_id IS NULL;
    END LOOP;
END $$;

-- ============================================
-- 4. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN products.item_name_english IS 'Item name in English';
COMMENT ON COLUMN products.item_name_urdu IS 'Item name in Urdu';
COMMENT ON COLUMN products.retail_price IS 'Price for retail customers';
COMMENT ON COLUMN products.wholesale_price IS 'Price for wholesale customers';
COMMENT ON COLUMN products.special_price IS 'Special price override for special customers';
COMMENT ON COLUMN products.unit_type IS 'Unit of measurement: piece, packet, meter, box, etc.';
COMMENT ON COLUMN products.is_frequently_sold IS 'Flag for frequently sold items (appears first in POS)';
COMMENT ON COLUMN products.display_order IS 'Custom display order for items';
COMMENT ON COLUMN customers.customer_type IS 'Customer type: walk-in, retail, wholesale, special';

-- ============================================
-- END OF MIGRATION
-- ============================================

