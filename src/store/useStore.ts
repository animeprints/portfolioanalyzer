import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Skill {
  name: string
  category: 'technical' | 'soft' | 'business' | 'language' | 'tool'
  score: number
  relevance: number
}

export interface CVAnalysis {
  id: string
  fileName: string
  uploadDate: Date
  personalInfo: {
    name?: string
    email?: string
    phone?: string
    linkedin?: string
    github?: string
    website?: string
  }
  summary?: string
  skills: Skill[]
  experience: {
    years: number
    level: 'junior' | 'mid' | 'senior' | 'lead'
    positions: Array<{
      title: string
      company: string
      duration: string
      description: string[]
    }>
  }
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  scores: {
    overall: number
    ats: number
    readability: number
    impact: number
    completeness: number
  }
  feedback: {
    strengths: string[]
    improvements: string[]
    keywords: string[]
    missingSkills: string[]
  }
  rawText: string
}

export interface JobDescription {
  id: string
  title: string
  company: string
  description: string
  requirements: string[]
  matchScore?: number
  matchedSkills?: string[]
  missingSkills?: string[]
}

export interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: Date
  cvHistory: string[] // analysis IDs
  savedJobs: string[] // job description IDs
  preferences: {
    theme: 'dark' | 'light'
    animations: boolean
    notifications: boolean
  }
}

interface AppState {
  // Current state
  currentCVAnalysis: CVAnalysis | null
  jobDescriptions: JobDescription[]
  currentUser: UserProfile | null
  isLoading: boolean

  // Actions
  setCurrentAnalysis: (analysis: CVAnalysis | null) => void
  addJobDescription: (job: JobDescription) => void
  removeJobDescription: (id: string) => void
  updateJobMatch: (jobId: string, results: {
    matchScore: number
    matchedSkills: string[]
    missingSkills: string[]
  }) => void
  setCurrentUser: (user: UserProfile | null) => void
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => void
  setLoading: (loading: boolean) => void
  clearAnalysis: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentCVAnalysis: null,
      jobDescriptions: [],
      currentUser: null,
      isLoading: false,

      setCurrentAnalysis: (analysis) => set({ currentCVAnalysis: analysis }),

      addJobDescription: (job) => set((state) => ({
        jobDescriptions: [...state.jobDescriptions, job]
      })),

      removeJobDescription: (id) => set((state) => ({
        jobDescriptions: state.jobDescriptions.filter(j => j.id !== id)
      })),

      updateJobMatch: (jobId, results) => set((state) => ({
        jobDescriptions: state.jobDescriptions.map(job =>
          job.id === jobId
            ? { ...job, ...results }
            : job
        )
      })),

      setCurrentUser: (user) => set({ currentUser: user }),

      updateUserPreferences: (preferences) => set((state) => ({
        currentUser: state.currentUser
          ? { ...state.currentUser, preferences: { ...state.currentUser.preferences, ...preferences } }
          : null
      })),

      setLoading: (loading) => set({ isLoading: loading }),

      clearAnalysis: () => set({
        currentCVAnalysis: null,
        jobDescriptions: []
      }),
    }),
    {
      name: 'cv-analyzer-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        jobDescriptions: state.jobDescriptions,
      }),
    }
  )
)
