-- Migration: Fix purchases table to support purchase_items structure
-- This makes product_id nullable since we now use purchase_items table for line items

-- Make product_id nullable (since we use purchase_items table now)
ALTER TABLE purchases 
    ALTER COLUMN product_id DROP NOT NULL;

-- Make quantity nullable (since we use purchase_items table now)
ALTER TABLE purchases 
    ALTER COLUMN quantity DROP NOT NULL;

-- Make purchase_price nullable (since we use purchase_items table now)
ALTER TABLE purchases 
    ALTER COLUMN purchase_price DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN purchases.product_id IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';
COMMENT ON COLUMN purchases.quantity IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';
COMMENT ON COLUMN purchases.purchase_price IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';




