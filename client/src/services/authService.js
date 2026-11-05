import api from './api';

/**
 * Authentication API Service.
 * Communicates with backend /api/auth endpoints.
 */
export const authService = {
  /**
   * Register a new user account.
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>} API response with user data
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log into an existing user account.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} API response with user data
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Log out of current session.
   * Clears HTTP-only cookie on the backend.
   * @returns {Promise<Object>}
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Retrieve currently authenticated user profile.
   * Uses HTTP-only cookie stored in browser.
   * @returns {Promise<Object>}
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
