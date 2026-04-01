import api from './api';

export interface LinkedInProfileData {
  headline?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  skills: string[];
  profile_picture?: string;
  [key: string]: unknown;
}

export interface LinkedInAnalysisResult {
  profile?: {
    id: string;
    user_id: string;
    profile_data: LinkedInProfileData;
    optimization_score: number;
    suggestions: string[];
    analyzed_at: string;
  };
  score: number;
  suggestions: string[];
  message: string;
}

export const linkedinService = {
  async analyze(data: { profile_data: LinkedInProfileData }): Promise<LinkedInAnalysisResult> {
    const response = await api.post<LinkedInAnalysisResult>('/linkedin/analyze', data);
    return response.data;
  },

  async getProfile(): Promise<LinkedInAnalysisResult> {
    const response = await api.get<LinkedInAnalysisResult>('/linkedin/profile');
    return response.data;
  },
};
