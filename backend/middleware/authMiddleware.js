/**
 * Authentication Middleware
 * Handles user authentication and session management
 */

const db = require('../db');
const { verifyPassword, verifyPIN } = require('../utils/authUtils');
const deviceFingerprint = require('../utils/deviceFingerprint');

/**
 * Middleware to check if user is authenticated
 * Attaches user info to req.user if authenticated
 */
async function requireAuth(req, res, next) {
  try {
    // Get session ID from header or cookie
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    // Verify session
    const session = await verifySession(sessionId);
    
    if (!session || !session.isValid) {
      return res.status(401).json({
        error: 'Invalid session',
        message: 'Your session has expired. Please log in again.'
      });
    }

    // Attach user info to request
    req.user = session.user;
    req.sessionId = sessionId;
    
    // Note: User ID is available in req.user.user_id for audit logging
    next();
  } catch (error) {
    console.error('[Auth Middleware] Error checking authentication:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred while checking authentication'
    });
  }
}

/**
 * Middleware to check if user has required role
 * Must be used after requireAuth
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
}

/**
 * Verify a session and return user info
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object|null>} - Session info with user data or null
 */
async function verifySession(sessionId) {
  try {
    const result = await db.query(`
      SELECT 
        s.session_id,
        s.user_id,
        s.expires_at,
        s.last_activity,
        u.user_id,
        u.username,
        u.name,
        u.role,
        u.is_active
      FROM user_sessions s
      INNER JOIN users u ON s.user_id = u.user_id
      WHERE s.session_id = $1
      AND s.expires_at > NOW()
      AND u.is_active = true
    `, [sessionId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    
    // Update last activity
    await db.query(`
      UPDATE user_sessions 
      SET last_activity = NOW() 
      WHERE session_id = $1
    `, [sessionId]);

    return {
      isValid: true,
      user: {
        user_id: row.user_id,
        username: row.username,
        name: row.name,
        role: row.role
      }
    };
  } catch (error) {
    console.error('[Auth Middleware] Error verifying session:', error);
    return null;
  }
}

/**
 * Create a new session for a user
 * @param {number} userId - User ID
 * @param {string} deviceId - Device fingerprint
 * @param {string} ipAddress - IP address
 * @param {string} userAgent - User agent string
 * @returns {Promise<string>} - Session ID
 */
async function createSession(userId, deviceId, ipAddress, userAgent) {
  const { v4: uuidv4 } = require('uuid');
  const sessionId = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

  await db.query(`
    INSERT INTO user_sessions (
      session_id, user_id, device_id, ip_address, user_agent, expires_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `, [sessionId, userId, deviceId, ipAddress, userAgent, expiresAt]);

  // Update user's last login
  await db.query(`
    UPDATE users 
    SET last_login = NOW() 
    WHERE user_id = $1
  `, [userId]);

  return sessionId;
}

/**
 * Destroy a session
 * @param {string} sessionId - Session ID
 */
async function destroySession(sessionId) {
  try {
    await db.query(`
      DELETE FROM user_sessions 
      WHERE session_id = $1
    `, [sessionId]);
  } catch (error) {
    console.error('[Auth Middleware] Error destroying session:', error);
  }
}

/**
 * Destroy all sessions for a user
 * @param {number} userId - User ID
 */
async function destroyAllUserSessions(userId) {
  try {
    await db.query(`
      DELETE FROM user_sessions 
      WHERE user_id = $1
    `, [userId]);
  } catch (error) {
    console.error('[Auth Middleware] Error destroying user sessions:', error);
  }
}

/**
 * Clean up expired sessions (should be run periodically)
 */
async function cleanupExpiredSessions() {
  try {
    const result = await db.query(`
      DELETE FROM user_sessions 
      WHERE expires_at < NOW()
    `);
    console.log(`[Auth Middleware] Cleaned up ${result.rowCount} expired sessions`);
  } catch (error) {
    console.error('[Auth Middleware] Error cleaning up sessions:', error);
  }
}

module.exports = {
  requireAuth,
  requireRole,
  verifySession,
  createSession,
  destroySession,
  destroyAllUserSessions,
  cleanupExpiredSessions,
};

