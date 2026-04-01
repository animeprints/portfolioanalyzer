import api from './api';

export interface InterviewQuestion {
  id: string;
  industry: string;
  role?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  category: 'technical' | 'behavioral' | 'situational' | 'experience' | 'company' | 'culture';
  expected_answer?: string;
  tips?: string[];
  created_at: string;
}

export interface PracticeRecord {
  id: string;
  question_id: string;
  user_answer: string;
  self_rating?: number;
  ai_feedback?: string;
  attempted_at: string;
  question: string;
  category: string;
  difficulty: string;
}

export const interviewService = {
  async getQuestions(params: {
    industry?: string;
    role?: string;
    difficulty?: string;
    limit?: number;
  }): Promise<{ questions: InterviewQuestion[]; count: number }> {
    const response = await api.get<{ questions: InterviewQuestion[]; count: number }>('/interview/questions', params);
    return response.data;
  },

  async recordPractice(data: {
    question_id: string;
    user_answer: string;
    self_rating?: number;
  }): Promise<void> {
    await api.post('/interview/practice', data);
  },

  async getPracticeHistory(): Promise<{ history: PracticeRecord[]; count: number }> {
    const response = await api.get<{ history: PracticeRecord[]; count: number }>('/interview/practice');
    return response.data;
  },
};
