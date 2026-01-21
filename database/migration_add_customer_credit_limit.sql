-- Migration: Add credit_limit column to customers table
-- Run this script to add the credit_limit column for customer credit management

-- Add credit_limit column (nullable, numeric)
ALTER TABLE customers
    ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(10, 2) DEFAULT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN customers.credit_limit IS 'Maximum credit limit for credit customers (optional)';

