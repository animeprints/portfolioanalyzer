import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'interviewer' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export interface Profile {
  id: string;
  user_id: string;
  language: string;
  theme: 'dark' | 'light' | 'system';
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  notifications: boolean;
  preferences: Record<string, unknown>;
}

export const authService = {
  async register(email: string, password: string, name: string, role: 'candidate' | 'interviewer' = 'candidate'): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
      role,
    });
    return response.data.data!;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    if (response.data.data && response.data.data.tokens) {
      localStorage.setItem('access_token', response.data.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.data.tokens.refresh_token);
      api.setToken(response.data.data.tokens.access_token);
    }

    return response.data.data!;
  },

  async refresh(): Promise<{ access_token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await api.post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (response.data.data) {
      localStorage.setItem('access_token', response.data.data.access_token);
      api.setToken(response.data.data.access_token);
    }

    return response.data.data!;
  },

  async logout(): Promise<void> {
    api.clearTokens();
    // Optionally call backend logout to invalidate refresh token
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.data?.user!;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
