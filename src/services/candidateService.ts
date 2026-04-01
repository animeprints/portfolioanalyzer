import api from './api';

export interface CandidateSearchFilters {
  skills?: string[]; // Required skills - must have all
  min_experience?: number; // Minimum years
  keywords?: string[]; // Keywords to search in resume text
  limit?: number;
}

export interface CandidateResult {
  id: string;
  user_id: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  analysis_data: {
    personalInfo: {
      name?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      website?: string;
    };
    summary?: string;
    skills: Array<{ name: string; category: string; score: number; relevance: number }>;
    experience: { years: number; level: string; positions: Array<any> };
    education: Array<any>;
    scores: { overall: number; ats: number; readability: number; impact: number; completeness: number };
    feedback: { strengths: string[]; improvements: string[]; keywords: string[]; missingSkills: string[] };
  };
}

export interface CandidateSearchResponse {
  candidates: CandidateResult[];
  count: number;
  filters_applied: CandidateSearchFilters;
}

export const candidateService = {
  async search(filters: CandidateSearchFilters): Promise<CandidateSearchResponse> {
    const response = await api.post<CandidateSearchResponse>('/candidates/search', filters);
    return response.data;
  },
};
