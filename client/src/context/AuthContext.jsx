import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Authentication Provider.
 * Maintains user session state using HTTP-only cookies and /api/auth/me checks.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check if an active session exists on backend.
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getMe();
      if (data && data.success && data.data) {
        const userData = data.data.user || data.data;
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      // 401 unauthenticated is normal on first visit or expired session
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user with credentials.
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login({ email, password });
      if (data && data.success && data.data) {
        const userData = data.data.user || data.data;
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(data?.message || 'Login failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Register new user account.
   */
  const register = async (name, email, password) => {
    try {
      setError(null);
      const data = await authService.register({ name, email, password });
      if (data && data.success && data.data) {
        const userData = data.data.user || data.data;
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(data?.message || 'Registration failed');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  /**
   * Log out of current session.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

