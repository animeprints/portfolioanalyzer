import api from './api';
import type { CVAnalysis as StoreCVAnalysis } from '../store/useStore';

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
  analysis_data: StoreCVAnalysis;
  // Alias for convenience
  analysis: StoreCVAnalysis;
}

export interface CandidateSearchResponse {
  candidates: CandidateResult[];
  count: number;
  filters_applied: CandidateSearchFilters;
}

export const candidateService = {
  async search(filters: CandidateSearchFilters): Promise<CandidateSearchResponse> {
    const response = await api.post<CandidateSearchResponse>('/candidates/search', filters);
    const result = response.data.data!;
    // Transform analysis_data to analysis for component compatibility
    return {
      ...result,
      candidates: result.candidates.map(candidate => ({
        ...candidate,
        analysis: candidate.analysis_data
      }))
    };
  },
};
