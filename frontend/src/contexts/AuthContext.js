/**
 * Authentication Context
 * Manages user authentication state and session
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setupAPI } from '../services/api';
import { getDeviceId } from '../utils/deviceFingerprint';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  // Check if first-time setup is needed
  const checkSetup = useCallback(async () => {
    try {
      const response = await setupAPI.check();
      const { isFirstTimeSetup } = response.data;
      setNeedsSetup(isFirstTimeSetup);
      setCheckingSetup(false);
      return isFirstTimeSetup;
    } catch (error) {
      console.error('[Auth] Error checking setup:', error);
      // If error, assume setup is needed
      setNeedsSetup(true);
      setCheckingSetup(false);
      return true;
    }
  }, []);

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const storedUser = localStorage.getItem('user');

      if (!sessionId || !storedUser) {
        setUser(null);
        setLoading(false);
        return false;
      }

      // Verify session with backend
      const response = await authAPI.getMe();
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        // Session invalid
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (error) {
      // Session expired or invalid
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);

  // Login
  const login = async (username, password, pin = null) => {
    try {
      const deviceId = getDeviceId();
      const credentials = pin 
        ? { pin } 
        : { username, password };

      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { sessionId, user: userData } = response.data;
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // CRITICAL: Re-enable all inputs before redirect to prevent stuck inputs
      const allInputs = document.querySelectorAll('input, textarea, select');
      allInputs.forEach(input => {
        input.disabled = false;
        input.readOnly = false;
        input.removeAttribute('data-license-disabled');
      });
      
      // Remove any disabling classes
      const appElement = document.querySelector('.app');
      if (appElement) {
        appElement.classList.remove('operations-disabled');
      }
      
      localStorage.removeItem('sessionId');
      localStorage.removeItem('user');
      setUser(null);
      
      // Use setTimeout to ensure DOM updates complete before redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
  };

  // Check if user has required role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user is administrator
  const isAdmin = () => {
    return hasRole('administrator');
  };

  // Check if user is cashier
  const isCashier = () => {
    return hasRole('cashier');
  };

  // Initialize auth on mount (only once)
  useEffect(() => {
    let isMounted = true;
    let initialized = false;

    const initialize = async () => {
      // Prevent multiple initializations
      if (initialized) {
        return;
      }
      initialized = true;

      try {
        // First check if setup is needed
        const needs = await checkSetup();
        
        if (!isMounted) return;
        
        if (needs) {
          setLoading(false);
          return;
        }

        // Then check authentication
        await checkAuth();
        
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('[Auth] Initialization error:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
    // CRITICAL: Empty dependency array - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    loading,
    needsSetup,
    checkingSetup,
    login,
    logout,
    checkAuth,
    checkSetup,
    hasRole,
    isAdmin,
    isCashier,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

