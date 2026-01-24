-- ============================================
-- MIGRATION: Add Missing Columns to license_info
-- ============================================
-- This script adds any missing columns to the license_info table
-- Safe to run multiple times - uses IF NOT EXISTS
-- ============================================

-- Add tenant_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'tenant_name'
    ) THEN
        ALTER TABLE license_info ADD COLUMN tenant_name VARCHAR(255);
        RAISE NOTICE 'Added tenant_name column';
    END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'status'
    ) THEN
        ALTER TABLE license_info ADD COLUMN status VARCHAR(50);
        RAISE NOTICE 'Added status column';
    END IF;
END $$;

-- Add last_verified_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'last_verified_at'
    ) THEN
        ALTER TABLE license_info ADD COLUMN last_verified_at TIMESTAMP;
        RAISE NOTICE 'Added last_verified_at column';
    END IF;
END $$;

-- Add pending_status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'pending_status'
    ) THEN
        ALTER TABLE license_info ADD COLUMN pending_status VARCHAR(50);
        RAISE NOTICE 'Added pending_status column';
    END IF;
END $$;

-- Add pending_status_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'pending_status_count'
    ) THEN
        ALTER TABLE license_info ADD COLUMN pending_status_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added pending_status_count column';
    END IF;
END $$;

-- Add activated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'activated_at'
    ) THEN
        ALTER TABLE license_info ADD COLUMN activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        -- Set activated_at for existing licenses
        UPDATE license_info 
        SET activated_at = COALESCE(created_at, CURRENT_TIMESTAMP)
        WHERE activated_at IS NULL;
        RAISE NOTICE 'Added activated_at column';
    END IF;
END $$;

-- Add last_known_valid_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'license_info' AND column_name = 'last_known_valid_date'
    ) THEN
        ALTER TABLE license_info ADD COLUMN last_known_valid_date TIMESTAMP;
        -- Set last_known_valid_date for existing active licenses
        UPDATE license_info 
        SET last_known_valid_date = CURRENT_DATE
        WHERE is_active = true AND last_known_valid_date IS NULL;
        RAISE NOTICE 'Added last_known_valid_date column';
    END IF;
END $$;

-- Set last_verified_at for existing licenses (use last_validated_at if available)
DO $$ 
BEGIN
    UPDATE license_info 
    SET last_verified_at = COALESCE(last_validated_at, CURRENT_TIMESTAMP)
    WHERE last_verified_at IS NULL;
    RAISE NOTICE 'Updated last_verified_at for existing licenses';
END $$;

-- CRITICAL: Auto-fix revoked licenses (set is_active = false where status = 'revoked')
DO $$ 
BEGIN
    UPDATE license_info 
    SET is_active = false 
    WHERE status = 'revoked' AND is_active = true;
    RAISE NOTICE 'Auto-fixed revoked licenses';
END $$;

-- CRITICAL: Auto-fix inactive licenses (set status = 'revoked' where is_active = false)
DO $$ 
BEGIN
    UPDATE license_info 
    SET status = 'revoked' 
    WHERE is_active = false AND (status IS NULL OR status = '');
    RAISE NOTICE 'Auto-fixed inactive licenses';
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_license_info_status ON license_info(status) WHERE status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_pending_status ON license_info(pending_status) WHERE pending_status IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_last_verified ON license_info(last_verified_at) WHERE last_verified_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_license_info_device_active ON license_info(device_id, is_active) WHERE is_active = true;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All missing columns have been added
-- Existing data has been migrated safely
-- Revoked licenses have been auto-fixed
-- ============================================

