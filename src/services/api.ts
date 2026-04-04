// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Axios instance with interceptors
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cardzey_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('cardzey_refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });
          const { token, refresh_token: newRefreshToken } = response.data;
          localStorage.setItem('cardzey_token', token);
          localStorage.setItem('cardzey_refresh_token', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('cardzey_token');
        localStorage.removeItem('cardzey_refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
