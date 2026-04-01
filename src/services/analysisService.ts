import api from './api';
import type { CVAnalysis as StoreCVAnalysis } from '../store/useStore';

export interface CVAnalysisResponse {
  id: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  analysis: StoreCVAnalysis;
}

export type { CVAnalysis } from '../store/useStore';

export const analysisService = {
  async uploadCV(file: File): Promise<{ success: boolean; analysis: StoreCVAnalysis }> {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await api.uploadFile('/analysis/upload', formData);
    return response.data as { success: boolean; analysis: StoreCVAnalysis };
  },

  async list(): Promise<{ analyses: CVAnalysisResponse[]; count: number }> {
    const response = await api.get<{ analyses: CVAnalysisResponse[]; count: number }>('/analysis');
    return response.data.data!;
  },

  async get(id: string): Promise<{ analysis: StoreCVAnalysis }> {
    const response = await api.get<{ analysis: StoreCVAnalysis }>(`/analysis/${id}`);
    return response.data.data!;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/analysis/${id}`);
  },
};
