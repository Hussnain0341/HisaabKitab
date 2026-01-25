-- ============================================
-- HISAABKITAB SECURITY SYSTEM MIGRATION
-- ============================================
-- This migration adds:
-- 1. Users and roles system
-- 2. Audit logging
-- 3. Session management
-- 4. Password recovery
-- ============================================

-- ============================================
-- PART 1: USERS AND ROLES
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

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================
-- PART 2: SESSIONS
-- ============================================

-- Sessions table for managing user sessions
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

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 3: AUDIT LOGS
-- ============================================

-- Audit logs table for tracking all sensitive operations
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

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- ============================================
-- PART 4: ENCRYPTED SENSITIVE DATA
-- ============================================

-- Table to store encryption keys (encrypted themselves)
CREATE TABLE IF NOT EXISTS encryption_keys (
    key_id SERIAL PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    encrypted_key TEXT NOT NULL, -- Base64 encoded encrypted key
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PART 5: INVOICE INTEGRITY
-- ============================================

-- Add finalized flag to sales table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'is_finalized'
    ) THEN
        ALTER TABLE sales ADD COLUMN is_finalized BOOLEAN DEFAULT false;
        ALTER TABLE sales ADD COLUMN finalized_at TIMESTAMP;
        ALTER TABLE sales ADD COLUMN finalized_by INTEGER REFERENCES users(user_id);
    END IF;
END $$;

-- Add created_by and updated_by to sales for tracking
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sales' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE sales ADD COLUMN created_by INTEGER REFERENCES users(user_id);
        ALTER TABLE sales ADD COLUMN updated_by INTEGER REFERENCES users(user_id);
    END IF;
END $$;

-- ============================================
-- PART 6: TRIGGERS FOR AUDIT LOGGING
-- ============================================

-- Function to log changes to sensitive tables
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

-- Create triggers for sensitive tables
-- Note: We'll create these triggers in the application code to avoid errors if tables don't exist

-- ============================================
-- PART 7: FIRST-TIME SETUP FLAG
-- ============================================

-- Add first-time setup flag to settings
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'settings' AND column_name = 'first_time_setup_complete'
    ) THEN
        ALTER TABLE settings ADD COLUMN first_time_setup_complete BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================
-- PART 8: PREVENT LAST ADMIN DELETION
-- ============================================

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

-- ============================================
-- PART 9: INITIAL DATA
-- ============================================

-- No initial users - first-time setup will create the first admin

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

