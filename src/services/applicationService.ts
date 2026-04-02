import api from './api';
import type { Job } from './jobService';
import type { CVAnalysis } from './analysisService';

export type ApplicationStatus = 'pending' | 'reviewing' | 'interviewing' | 'rejected' | 'accepted' | 'withdrawn';

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  analysis_id: string;
  match_score: number;
  status: ApplicationStatus;
  notes?: string | { content: string; updated_by: string; updated_at: string }[]; // Backward compatible
  created_at: string;
  updated_at?: string;

  // Joined data
  job?: Job;
  analysis?: CVAnalysis;
  candidate_name?: string;
  candidate_email?: string;
  job_title?: string;
  job_company?: string;
  cv_file_name?: string;
}

export interface ApplicationSubmitData {
  job_id: string;
  analysis_id: string;
}

export interface ApplicationListResponse {
  applications: Application[];
  count: number;
}

export const applicationService = {
  /**
   * Candidate applies to a job
   */
  async apply(data: ApplicationSubmitData): Promise<Application> {
    const response = await api.post<Application>('/applications', data);
    return response.data.data!;
  },

  /**
   * List applications for a specific job (interviewer view)
   */
  async listByJob(jobId?: string): Promise<ApplicationListResponse> {
    const params = jobId ? { job_id: jobId } : {};
    const response = await api.get<ApplicationListResponse>('/jobs/applications', { params });
    return response.data.data!;
  },

  /**
   * Get single application with full details
   */
  async get(id: string): Promise<{ application: Application }> {
    const response = await api.get<{ application: Application }>(`/applications/${id}`);
    return response.data.data!;
  },

  /**
   * Update application status
   */
  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    await api.put(`/applications/${id}/status`, { status });
  },

  /**
   * Update application notes
   */
  async updateNotes(id: string, notes: string): Promise<void> {
    await api.put(`/applications/${id}/notes`, { notes });
  },

  /**
   * Withdraw/delete application (candidate only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  }
};
