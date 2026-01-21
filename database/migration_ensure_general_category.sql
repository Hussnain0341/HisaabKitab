-- Migration: Ensure "General" category exists
-- This category is required by the system and cannot be deleted
-- Products without a category are automatically assigned to "General"

-- Check if General category exists, if not create it
INSERT INTO categories (category_name, status)
SELECT 'General', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE LOWER(category_name) = 'general'
);

-- Ensure it's active
UPDATE categories 
SET status = 'active'
WHERE LOWER(category_name) = 'general';



