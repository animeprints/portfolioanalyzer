import api from './api';

export const profileService = {
  async getProfile(): Promise<{
    profile: {
      id: string;
      user_id: string;
      language: string;
      theme: 'dark' | 'light' | 'system';
      linkedin_url?: string;
      github_url?: string;
      website_url?: string;
      notifications: boolean;
      preferences: Record<string, unknown>;
    };
  }> {
    const response = await api.get<{ profile: {
      id: string;
      user_id: string;
      language: string;
      theme: 'dark' | 'light' | 'system';
      linkedin_url?: string;
      github_url?: string;
      website_url?: string;
      notifications: boolean;
      preferences: Record<string, unknown>;
    } }>('/profile');
    return response.data.data!;
  },

  async updateProfile(data: {
    language?: string;
    theme?: 'dark' | 'light' | 'system';
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    notifications?: boolean;
    preferences?: Record<string, unknown>;
  }): Promise<{ profile: unknown }> {
    const response = await api.put<{ profile: unknown }>('/profile', data);
    return response.data.data!;
  },
};
