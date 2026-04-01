import api from './api';

export interface CVAnalysis {
  id: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  analysis: {
    personalInfo: {
      name?: string;
      email?: string;
      phone?: string;
      linkedin?: string;
      github?: string;
      website?: string;
    };
    summary?: string;
    skills: Array<{
      name: string;
      category: string;
      score: number;
      relevance: number;
    }>;
    experience: {
      years: number;
      level: string;
      positions: Array<{
        title: string;
        company: string;
        duration: string;
        description: string[];
      }>;
    };
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    scores: {
      overall: number;
      ats: number;
      readability: number;
      impact: number;
      completeness: number;
    };
    feedback: {
      strengths: string[];
      improvements: string[];
      keywords: string[];
      missingSkills: string[];
    };
  };
}

export const analysisService = {
  async uploadCV(file: File): Promise<{ success: boolean; analysis: CVAnalysis }> {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await api.uploadFile('/analysis/upload', formData);
    return response.data;
  },

  async list(): Promise<{ analyses: CVAnalysis[]; count: number }> {
    const response = await api.get<{ analyses: CVAnalysis[]; count: number }>('/analysis');
    return response.data;
  },

  async get(id: string): Promise<{ analysis: CVAnalysis }> {
    const response = await api.get<{ analysis: CVAnalysis }>(`/analysis/${id}`);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/analysis/${id}`);
  },
};
