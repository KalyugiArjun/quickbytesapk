import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: add JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quickbite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and token is invalid, clear token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('quickbite_token');
        localStorage.removeItem('quickbite_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
