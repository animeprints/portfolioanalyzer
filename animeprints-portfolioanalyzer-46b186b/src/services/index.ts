import api from './api';

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'interviewer' | 'admin';
  phone?: string;
  linkedin?: string;
  github?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: 'candidate' | 'interviewer';
  }) => api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  refresh: (data: { refresh_token: string }) =>
    api.post<{ token: string; refresh_token: string }>('/auth/refresh', data),

  me: () => api.get<{ user: User }>('/auth/me'),
};

// Analysis types
export interface AnalysisResult {
  id: string;
  overall_score: number;
  ats_score: number;
  readability_score: number;
  impact_score: number;
  completeness_score: number;
  extracted_skills: {
    technical: string[];
    soft: string[];
    business: string[];
    languages: string[];
    tools: string[];
  };
  personal_info: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  education?: any[];
  experience?: any[];
  created_at: string;
}

export interface JobDescription {
  title: string;
  requirements: string[];
  skills: string[];
}

export interface JobMatchResult {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}

// Analysis API
export const analysisAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('cv', file);
    return api.post<{ analysis: AnalysisResult }>('/analysis/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  get: (id: string) => api.get<{ analysis: AnalysisResult }>(`/analysis/${id}`),

  list: () => api.get<{ analyses: AnalysisResult[] }>('/analysis'),

  delete: (id: string) => api.delete(`/analysis/${id}`),

  matchJob: (analysisId: string, job: JobDescription) =>
    api.post<JobMatchResult>(`/analysis/${analysisId}/match`, job),
};

// Profile API
export const profileAPI = {
  get: () => api.get<User>('/profile'),
  update: (data: Partial<User>) => api.put<User>('/profile', data),
};

// Jobs API (Interviewer only)
export const jobsAPI = {
  create: (data: { title: string; description: string; requirements: string[]; skills: string[] }) =>
    api.post('/jobs', data),
  list: () => api.get('/jobs'),
};

// Candidates API (Interviewer only)
export const candidatesAPI = {
  search: (params: { skills?: string[]; minScore?: number; experience?: string }) =>
    api.post('/candidates/search', params),
};

// Applications API
export const applicationsAPI = {
  apply: (jobId: string, coverLetter?: string) =>
    api.post('/applications', { job_id: jobId, cover_letter: coverLetter }),
  get: (id: string) => api.get(`/applications/${id}`),
  updateStatus: (id: string, status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired') =>
    api.put(`/applications/${id}?action=status`, { status }),
  updateNotes: (id: string, notes: string) =>
    api.put(`/applications/${id}?action=notes`, { notes }),
  delete: (id: string) => api.delete(`/applications/${id}`),
  listByJob: (jobId: string) => api.get(`/jobs/${jobId}/applications`),
};

// Share API
export const shareAPI = {
  create: (analysisId: string, password?: string) =>
    api.post('/share', { analysis_id: analysisId, password }),
  view: (shareId: string) => api.get(`/share/${shareId}`),
  revoke: (shareId: string) => api.delete(`/share/${shareId}`),
};

// Interview API
export const interviewAPI = {
  getQuestions: (category?: string) =>
    category
      ? api.get(`/interview/questions/${category}`)
      : api.get('/interview/questions'),

  getQuestion: (id: string) => api.get(`/interview/questions/${id}`),

  recordPractice: (questionId: string, answer: string, duration: number) =>
    api.post('/interview/practice', {
      question_id: questionId,
      answer,
      duration_seconds: duration,
    }),

  getHistory: () => api.get('/interview/practice'),
};

// LinkedIn API
export const linkedinAPI = {
  analyze: (profileData: { headline?: string; summary?: string; experience?: any[]; skills?: string[] }) =>
    api.post('/linkedin/analyze', profileData),

  get: () => api.get('/linkedin/profile'),
};

// Export API
export const exportAPI = {
  export: (analysisId: string, format: 'pdf' | 'json' | 'html' | 'docx') =>
    api.post('/export', { analysis_id: analysisId, format }),
};
