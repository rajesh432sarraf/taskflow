import axios from 'axios';

/**
 * Axios instance preconfigured for TaskFlow API communication.
 * Base URL defaults to local Express server, overrideable via VITE_API_URL.
 * withCredentials: true ensures HTTP-only authentication cookies are included.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
