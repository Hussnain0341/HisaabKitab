/**
 * User Management Routes (Admin Only)
 * Handles user CRUD operations
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const { 
  hashPassword, 
  hashPIN,
  validatePassword, 
  validateUsername 
} = require('../utils/authUtils');
const { logAuditEvent, logSensitiveAccess } = require('../utils/auditLogger');

// All routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole('administrator'));

/**
 * GET /api/users
 * Get all users (admin only)
 */
router.get('/', async (req, res) => {
  try {
    await logSensitiveAccess(
      req.user.user_id,
      'users',
      req.ip || req.connection.remoteAddress,
      req.get('user-agent')
    );

    const result = await db.query(`
      SELECT 
        user_id,
        username,
        name,
        role,
        is_active,
        created_at,
        updated_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('[Users Route] Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while fetching users'
    });
  }
});

/**
 * POST /api/users
 * Create a new user (admin only)
 */
router.post('/', async (req, res) => {
  try {
    const { name, username, password, role, pin } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    if (!name || !username || !password) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Name, username, and password are required'
      });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        error: 'Invalid username',
        message: usernameValidation.message
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: passwordValidation.message
      });
    }

    const userRole = role === 'administrator' ? 'administrator' : 'cashier';

    // Check if username exists
    const existingUser = await db.query(
      'SELECT user_id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Username exists',
        message: 'This username is already taken'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Hash PIN if provided
    let pinHash = null;
    if (pin) {
      if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({
          error: 'Invalid PIN',
          message: 'PIN must be exactly 4 digits'
        });
      }
      pinHash = await hashPIN(pin);
    }

    // Create user
    const result = await db.query(`
      INSERT INTO users (
        username, password_hash, name, role, pin_hash
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING user_id, username, name, role, is_active, created_at
    `, [username, passwordHash, name, userRole, pinHash]);

    const newUser = result.rows[0];

    await logAuditEvent({
      userId: req.user.user_id,
      action: 'create',
      tableName: 'users',
      recordId: newUser.user_id,
      newValues: { username, name, role: userRole },
      notes: `Admin ${req.user.username} created user: ${username}`,
      ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('[Users Route] Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: 'An error occurred while creating user'
    });
  }
});

/**
 * PUT /api/users/:id
 * Update a user (admin only)
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, role, is_active, pin, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Allow admin to update themselves (but not delete)
    if (userId === req.user.user_id) {
      // Admin can update their own name, password, PIN, but not role or is_active
      if (role !== undefined || is_active !== undefined) {
        return res.status(400).json({
          error: 'Cannot change own role or status',
          message: 'You cannot change your own role or active status. Contact another administrator.'
        });
      }
      // Allow updating name, password, PIN for self
    }

    // Get current user
    const currentUser = await db.query(
      'SELECT user_id, role FROM users WHERE user_id = $1',
      [userId]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Prevent deleting last administrator
    if (currentUser.rows[0].role === 'administrator' && is_active === false) {
      const adminCount = await db.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE role = 'administrator' AND is_active = true AND user_id != $1
      `, [userId]);

      if (parseInt(adminCount.rows[0].count) === 0) {
        return res.status(400).json({
          error: 'Cannot deactivate last admin',
          message: 'Cannot deactivate the last administrator account'
        });
      }
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    if (role !== undefined && (role === 'administrator' || role === 'cashier')) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }

    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }

    if (pin !== undefined) {
      if (pin === null || pin === '') {
        updates.push(`pin_hash = NULL`);
      } else {
        if (!/^\d{4}$/.test(pin)) {
          return res.status(400).json({
            error: 'Invalid PIN',
            message: 'PIN must be exactly 4 digits'
          });
        }
        const pinHash = await hashPIN(pin);
        updates.push(`pin_hash = $${paramCount++}`);
        values.push(pinHash);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No updates',
        message: 'No fields to update'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await db.query(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING user_id, username, name, role, is_active, updated_at
    `, values);

    await logAuditEvent({
      userId: req.user.user_id,
      action: 'update',
      tableName: 'users',
      recordId: userId,
      newValues: { name, role, is_active },
      notes: `Admin ${req.user.username} updated user: ${result.rows[0].username}`,
      ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('[Users Route] Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: 'An error occurred while updating user'
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user (admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Prevent deleting yourself
    if (userId === req.user.user_id) {
      return res.status(400).json({
        error: 'Cannot delete self',
        message: 'You cannot delete your own account'
      });
    }

    // Get user info
    const userResult = await db.query(
      'SELECT user_id, username, role FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Prevent deleting last administrator
    if (user.role === 'administrator') {
      const adminCount = await db.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE role = 'administrator' AND is_active = true AND user_id != $1
      `, [userId]);

      if (parseInt(adminCount.rows[0].count) === 0) {
        return res.status(400).json({
          error: 'Cannot delete last admin',
          message: 'Cannot delete the last administrator account'
        });
      }
    }

    // Soft delete (deactivate) instead of hard delete
    await db.query(`
      UPDATE users
      SET is_active = false, updated_at = NOW()
      WHERE user_id = $1
    `, [userId]);

    await logAuditEvent({
      userId: req.user.user_id,
      action: 'delete',
      tableName: 'users',
      recordId: userId,
      oldValues: { username: user.username, role: user.role },
      notes: `Admin ${req.user.username} deleted user: ${user.username}`,
      ipAddress,
      userAgent
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('[Users Route] Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: 'An error occurred while deleting user'
    });
  }
});

/**
 * GET /api/users/audit-logs
 * Get audit logs (admin only)
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, action, tableName } = req.query;

    await logSensitiveAccess(
      req.user.user_id,
      'audit_logs',
      req.ip || req.connection.remoteAddress,
      req.get('user-agent')
    );

    let query = `
      SELECT 
        al.log_id,
        al.user_id,
        u.username,
        u.name as user_name,
        al.action,
        al.table_name,
        al.record_id,
        al.old_values,
        al.new_values,
        al.ip_address,
        al.user_agent,
        al.timestamp,
        al.notes
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (userId) {
      query += ` AND al.user_id = $${paramCount++}`;
      params.push(userId);
    }

    if (action) {
      query += ` AND al.action = $${paramCount++}`;
      params.push(action);
    }

    if (tableName) {
      query += ` AND al.table_name = $${paramCount++}`;
      params.push(tableName);
    }

    query += ` ORDER BY al.timestamp DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count
      FROM audit_logs al
      WHERE 1=1
      ${userId ? `AND al.user_id = $1` : ''}
      ${action ? `AND al.action = $${userId ? '2' : '1'}` : ''}
      ${tableName ? `AND al.table_name = $${userId && action ? '3' : userId || action ? '2' : '1'}` : ''}
    `;
    const countParams = [];
    if (userId) countParams.push(userId);
    if (action) countParams.push(action);
    if (tableName) countParams.push(tableName);

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      logs: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('[Users Route] Get audit logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch audit logs',
      message: 'An error occurred while fetching audit logs'
    });
  }
});

/**
 * POST /api/users/:id/generate-password
 * Generate a random password for a user (admin only)
 */
router.post('/:id/generate-password', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Generate random password (8 characters: 4 letters + 4 numbers)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let password = '';
    for (let i = 0; i < 4; i++) {
      password += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    // Hash the password
    const passwordHash = await hashPassword(password);
    
    // Update user password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE user_id = $2',
      [passwordHash, userId]
    );
    
    await logAuditEvent({
      userId: req.user.user_id,
      action: 'update',
      tableName: 'users',
      recordId: userId,
      notes: `Admin ${req.user.username} generated new password for user`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    });
    
    res.json({
      success: true,
      password: password, // Return plain password so admin can share it
      message: 'Password generated successfully'
    });
  } catch (error) {
    console.error('[Users Route] Generate password error:', error);
    res.status(500).json({
      error: 'Failed to generate password',
      message: 'An error occurred while generating password'
    });
  }
});

module.exports = router;

