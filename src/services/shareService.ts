import api from './api';

export interface ShareLinkResponse {
  share_url: string;
  token: string;
  expires_at?: string;
}

export interface SharedAnalysis {
  analysis: {
    id: string;
    file_name: string;
    analysis: {
      personalInfo: Record<string, unknown>;
      summary?: string;
      skills: Array<{ name: string; category: string; score: number; relevance: number }>;
      experience: { years: number; level: string; positions: Array<Record<string, unknown>> };
      education: Array<Record<string, unknown>>;
      scores: { overall: number; ats: number; readability: number; impact: number; completeness: number };
      feedback: { strengths: string[]; improvements: string[]; keywords: string[]; missingSkills: string[] };
    };
  };
  file_name: string;
  shared_by: string;
  shared_at: string;
}

export const shareService = {
  async createShareLink(analysisId: string, options?: { expires_in_days?: number; password?: string }): Promise<ShareLinkResponse> {
    const response = await api.post<ShareLinkResponse>('/share', {
      analysis_id: analysisId,
      ...options,
    });
    return response.data;
  },

  async revokeShareLink(token: string): Promise<void> {
    await api.delete(`/share/${token}`);
  },

  async getSharedAnalysis(token: string, password?: string): Promise<SharedAnalysis> {
    const response = await api.get<{ success: boolean; analysis: SharedAnalysis }>(`/share/${token}`, {
      data: { password },
    });
    return response.data.analysis;
  },
};
