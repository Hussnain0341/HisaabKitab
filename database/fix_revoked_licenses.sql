-- ============================================
-- FIX REVOKED LICENSE IN DATABASE
-- ============================================
-- This script fixes licenses that have status = 'revoked' 
-- but is_active = true (should be false)
-- ============================================

-- Fix row 4: Set is_active = false for revoked licenses
UPDATE license_info 
SET is_active = false 
WHERE status = 'revoked' AND is_active = true;

-- Verify the fix
SELECT id, license_id, tenant_name, device_id, status, is_active, expires_at, last_verified_at
FROM license_info
WHERE status = 'revoked' OR is_active = false
ORDER BY id;

-- ============================================
-- FIX COMPLETE
-- ============================================





