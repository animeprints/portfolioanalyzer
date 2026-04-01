import api from './api';

export interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements: string[];
  status: 'draft' | 'active' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface JobListResponse {
  jobs: Job[];
  count: number;
}

export const jobService = {
  async list(): Promise<JobListResponse> {
    const response = await api.get<JobListResponse>('/jobs');
    return response.data.data!;
  },

  async get(id: string): Promise<{ job: Job }> {
    const response = await api.get<{ job: Job }>(`/jobs/${id}`);
    return response.data.data!;
  },

  async create(data: Partial<Job>): Promise<Job> {
    const response = await api.post<{ job: Job }>('/jobs', data);
    return response.data.data!.job;
  },

  async update(id: string, data: Partial<Job>): Promise<Job> {
    const response = await api.put<{ job: Job }>(`/jobs/${id}`, data);
    return response.data.data!.job;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};
