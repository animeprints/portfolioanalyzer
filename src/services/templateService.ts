import api from './api';

export interface ResumeTemplate {
  id: string;
  name: string;
  industry: string[];
  file_url: string;
  preview_url: string;
  structure?: Record<string, unknown>;
  ats_score?: number;
  is_active: boolean;
  created_at: string;
}

export const templateService = {
  async list(): Promise<{ templates: ResumeTemplate[]; count: number }> {
    const response = await api.get<{ templates: ResumeTemplate[]; count: number }>('/templates');
    return response.data;
  },

  async create(data: Partial<ResumeTemplate>): Promise<ResumeTemplate> {
    const response = await api.post<{ template: ResumeTemplate }>('/templates', data);
    return response.data.template;
  },
};
