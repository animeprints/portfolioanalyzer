import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// Determine API URL based on environment
const getApiBaseUrl = (): string => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api'; // Local PHP backend
  }

  // Production: Use VITE_API_URL if set (different domain)
  // Otherwise, use relative path (same domain deployment like Hostinger)
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (configuredUrl && configuredUrl.trim() !== '') {
    return configuredUrl;
  }

  // Same-domain deployment: backend is at /api
  return '/api';
};

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('access_token');

    // Request interceptor to add auth header
    this.client.interceptors.request.use(
      (config) => {
        if (this.token && !config.headers?.['Authorization']) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && this.token) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {
                refresh_token: refreshToken,
              });

              const { access_token } = response.data;
              this.setToken(access_token);
              localStorage.setItem('access_token', access_token);

              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  clearTokens(): void {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete this.client.defaults.headers.common['Authorization'];
  }

  // Generic methods
  async get<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<{ success: boolean; data?: T }>> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<{ success: boolean; data?: T }>> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<{ success: boolean; data?: T }>> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string): Promise<AxiosResponse<{ success: boolean; data?: T }>> {
    return this.client.delete(url);
  }

  // File upload
  async uploadFile(url: string, formData: FormData): Promise<AxiosResponse<{ success: boolean; analysis?: unknown }>> {
    // Delete Content-Type header for multipart/form-data
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.client.post(url, formData, config);
  }
}

export const api = new ApiClient();
export default api;
