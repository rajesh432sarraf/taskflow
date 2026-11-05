import axios from 'axios';

/**
 * Axios instance preconfigured for TaskFlow API communication.
 * Prioritizes VITE_API_URL, then dynamically detects if running on a deployed domain
 * (e.g. Vercel) or falls back to local Express server (port 5000).
 * withCredentials: true ensures HTTP-only authentication cookies are sent across requests.
 */
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // If in browser on a production domain (Vercel, custom domain, etc.)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://taskflow-server-wz2r.onrender.com/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer token from localStorage as Authorization header fallback
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('taskflow_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
  }
  return config;
});

// Response interceptor: automatically clear token if session invalidated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('taskflow_token');
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;

