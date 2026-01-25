-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(500), -- Optional link to related resource
    metadata JSONB -- Additional data like sale_id, product_id, etc.
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id INTEGER,
    p_title VARCHAR,
    p_message TEXT,
    p_type VARCHAR DEFAULT 'info',
    p_link VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_notification_id INTEGER;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, link, metadata)
    VALUES (p_user_id, p_title, p_message, p_type, p_link, p_metadata)
    RETURNING notification_id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

