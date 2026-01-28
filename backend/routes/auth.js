/**
 * Authentication Routes
 * Handles login, logout, password recovery, and user management
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { 
  hashPassword, 
  verifyPassword, 
  hashPIN, 
  verifyPIN,
  generateResetToken,
  hashSecurityAnswer,
  verifySecurityAnswer,
  validatePassword,
  validateUsername,
  generateDeviceBoundRecoveryKey
} = require('../utils/authUtils');
const { 
  createSession, 
  destroySession, 
  requireAuth, 
  requireRole 
} = require('../middleware/authMiddleware');
const { logLogin, logLogout, logAuditEvent } = require('../utils/auditLogger');
const deviceFingerprint = require('../utils/deviceFingerprint');

/**
 * POST /api/auth/login
 * Login with username/password or PIN
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password, pin } = req.body;
    const deviceId = req.headers['x-device-id'] || deviceFingerprint.getDeviceId();
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    if (!username && !pin) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Username/password or PIN is required'
      });
    }

    let user;
    
    // PIN login (for cashier)
    if (pin && !username) {
      if (!/^\d{4}$/.test(pin)) {
        await logLogin(null, ipAddress, userAgent, false);
        return res.status(400).json({
          error: 'Invalid PIN',
          message: 'PIN must be exactly 4 digits'
        });
      }

      // Find user by PIN
      const pinResult = await db.query(`
        SELECT user_id, username, name, role, pin_hash, is_active
        FROM users
        WHERE pin_hash IS NOT NULL
        AND is_active = true
      `);

      let foundUser = null;
      for (const row of pinResult.rows) {
        const isValid = await verifyPIN(pin, row.pin_hash);
        if (isValid) {
          foundUser = row;
          break;
        }
      }

      if (!foundUser) {
        await logLogin(null, ipAddress, userAgent, false);
        return res.status(401).json({
          error: 'Invalid PIN',
          message: 'The PIN you entered is incorrect'
        });
      }

      user = foundUser;
    } else {
      // Username/password login
      if (!username || !password) {
        return res.status(400).json({
          error: 'Invalid credentials',
          message: 'Username and password are required'
        });
      }

      const result = await db.query(`
        SELECT user_id, username, name, role, password_hash, is_active
        FROM users
        WHERE username = $1 AND is_active = true
      `, [username]);

      if (result.rows.length === 0) {
        await logLogin(null, ipAddress, userAgent, false);
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        });
      }

      user = result.rows[0];
      const isValidPassword = await verifyPassword(password, user.password_hash);
      
      if (!isValidPassword) {
        await logLogin(null, ipAddress, userAgent, false);
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        });
      }
    }

    // Create session
    const sessionId = await createSession(user.user_id, deviceId, ipAddress, userAgent);
    
    // Log successful login
    await logLogin(user.user_id, ipAddress, userAgent, true);

    res.json({
      success: true,
      sessionId,
      user: {
        user_id: user.user_id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[Auth Route] Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login. Please try again.'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout and destroy session
 */
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    await destroySession(sessionId);
    await logLogout(req.user.user_id, ipAddress, userAgent);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('[Auth Route] Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * POST /api/auth/forgot-password
 * Generate password recovery token (offline)
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { username, securityAnswer, deviceId } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    if (!username) {
      return res.status(400).json({
        error: 'Username required',
        message: 'Please provide your username'
      });
    }

    const result = await db.query(`
      SELECT user_id, username, security_answer_hash, security_question
      FROM users
      WHERE username = $1 AND is_active = true
    `, [username]);

    if (result.rows.length === 0) {
      // Don't reveal if user exists (security best practice)
      return res.json({
        success: true,
        message: 'If the username exists, a recovery key has been generated'
      });
    }

    const user = result.rows[0];

    // If security answer provided, verify it
    if (securityAnswer && user.security_answer_hash) {
      const isValid = await verifySecurityAnswer(securityAnswer, user.security_answer_hash);
      if (!isValid) {
        await logAuditEvent({
          userId: null,
          action: 'password_recovery_failed',
          notes: `Failed password recovery attempt for user: ${username}`,
          ipAddress,
          userAgent
        });
        return res.status(401).json({
          error: 'Invalid answer',
          message: 'The security answer is incorrect'
        });
      }
    }

    // Generate device-bound recovery key
    const currentDeviceId = deviceId || deviceFingerprint.getDeviceId();
    const recoveryKey = generateDeviceBoundRecoveryKey(currentDeviceId);
    
    // Store recovery token (temporary password)
    const resetToken = generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour validity

    await db.query(`
      UPDATE users
      SET password_reset_token = $1,
          password_reset_expires = $2
      WHERE user_id = $3
    `, [resetToken, expiresAt, user.user_id]);

    await logAuditEvent({
      userId: user.user_id,
      action: 'password_recovery_requested',
      notes: 'Password recovery key generated',
      ipAddress,
      userAgent
    });

    // Return recovery key (in production, this would be shown in a secure popup)
    res.json({
      success: true,
      recoveryKey,
      message: 'Recovery key generated. Use this to reset your password.',
      resetToken // Client will use this to reset password
    });
  } catch (error) {
    console.error('[Auth Route] Forgot password error:', error);
    res.status(500).json({
      error: 'Recovery failed',
      message: 'An error occurred during password recovery'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using recovery token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { username, recoveryKey, resetToken, newPassword } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    if (!username || !newPassword || (!recoveryKey && !resetToken)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Username, recovery key/token, and new password are required'
      });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: passwordValidation.message
      });
    }

    const result = await db.query(`
      SELECT user_id, username, password_reset_token, password_reset_expires
      FROM users
      WHERE username = $1 AND is_active = true
    `, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    // Verify reset token
    if (resetToken && user.password_reset_token !== resetToken) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid or expired recovery token'
      });
    }

    if (user.password_reset_expires && new Date() > new Date(user.password_reset_expires)) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Recovery token has expired. Please request a new one.'
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and clear reset token
    await db.query(`
      UPDATE users
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires = NULL,
          updated_at = NOW()
      WHERE user_id = $2
    `, [passwordHash, user.user_id]);

    await logAuditEvent({
      userId: user.user_id,
      action: 'password_reset',
      notes: 'Password reset successfully',
      ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    console.error('[Auth Route] Reset password error:', error);
    res.status(500).json({
      error: 'Reset failed',
      message: 'An error occurred during password reset'
    });
  }
});

/**
 * POST /api/auth/change-password
 * Change password (requires authentication)
 */
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Current password and new password are required'
      });
    }

    // Get current password hash
    const result = await db.query(`
      SELECT password_hash FROM users WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, result.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: passwordValidation.message
      });
    }

    // Hash and update password
    const passwordHash = await hashPassword(newPassword);
    await db.query(`
      UPDATE users
      SET password_hash = $1, updated_at = NOW()
      WHERE user_id = $2
    `, [passwordHash, userId]);

    await logAuditEvent({
      userId,
      action: 'password_changed',
      notes: 'User changed their password',
      ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('[Auth Route] Change password error:', error);
    res.status(500).json({
      error: 'Change failed',
      message: 'An error occurred while changing password'
    });
  }
});

module.exports = router;


