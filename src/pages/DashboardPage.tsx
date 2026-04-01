import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
  BarChart3,
  Target,
  Lightbulb,
  Download,
  AlertCircle,
  Award,
  TrendingUp,
  MessageSquare,
  Shield,
  History,
  FileText
} from 'lucide-react'
import { generatePDFReport } from '../utils/pdfExporter'
import { matchJobDescription } from '../utils/jobMatcher'
import { analysisService, CVAnalysisResponse } from '../services/analysisService'
import JobMatchCard from '../components/JobMatchCard'

export default function DashboardPage() {
  const { currentCVAnalysis: storeAnalysis, setCurrentAnalysis, jobDescriptions, addJobDescription, updateJobMatch } = useStore();

  // State for loading analyses list
  const [analysesList, setAnalysesList] = useState<CVAnalysisResponse[]>([]);

  // Load user's analyses list on mount
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const result = await analysisService.list();
        setAnalysesList(result.analyses);
      } catch (err) {
        console.error('Failed to load analyses:', err);
      }
    };

    // If we've already got an analysis from store, keep it.
    // If we navigate directly to /dashboard without analysis, try to load the most recent one.
    if (!storeAnalysis && analysesList.length === 0) {
      loadAnalyses();
    }
  }, [storeAnalysis, analysesList.length]);

  // Set the most recent analysis if we have list but no current
  useEffect(() => {
    if (!storeAnalysis && analysesList.length > 0) {
      // Fetch first analysis details
      const loadAnalysis = async () => {
        try {
          const result = await analysisService.get(analysesList[0].id);
          setCurrentAnalysis(result.analysis);
        } catch (err) {
          console.error('Failed to load analysis:', err);
        }
      };
      loadAnalysis();
    }
  }, [storeAnalysis, analysesList, setCurrentAnalysis]);

  // Redirect to home if no analysis can be loaded
  useEffect(() => {
    if (!storeAnalysis && analysesList.length === 0) {
      // Still loading or no analyses
    }
  }, [storeAnalysis, analysesList]);

  if (!storeAnalysis) {
    return null; // or loading spinner
  }

  const handleExportPDF = () => {
    generatePDFReport(storeAnalysis);
  };

  const handleAnalysisSelect = async (analysisId: string) => {
    try {
      const result = await analysisService.get(analysisId);
      setCurrentAnalysis(result.analysis);
    } catch (err) {
      console.error('Failed to load analysis:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500'
    if (score >= 60) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const handleAddJob = () => {
    const title = prompt('Job Title:')
    if (!title) return
    const company = prompt('Company (optional):') || ''
    const requirements = prompt('Key Requirements (comma-separated):') || ''

    const job = {
      id: `job-${Date.now()}`,
      title,
      company,
      description: '',
      requirements: requirements.split(',').map(r => r.trim()).filter(Boolean)
    }

    addJobDescription(job)

    // Auto-match
    if (storeAnalysis) {
      const match = matchJobDescription(storeAnalysis.skills, job)
      updateJobMatch(job.id, {
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills
      })
    }
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analysis Complete</h1>
            <p className="text-gray-400">Your CV has been analyzed with precision</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="glass-card px-6 py-3 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Download className="w-5 h-5 text-cyan-400" />
            <span>Export PDF</span>
          </button>
        </motion.div>

        {/* CV History Selector */}
        {analysesList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <History className="w-5 h-5" />
              <span className="font-medium">Your CV Analyses:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysesList.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => handleAnalysisSelect(analysis.id)}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    storeAnalysis.id === analysis.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {analysis.file_name} - {new Date(analysis.created_at).toLocaleDateString()}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Overall CV Score</h2>
              <p className="text-gray-400">Your resume's performance across key metrics</p>
            </div>

            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - storeAnalysis.scores.overall / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(storeAnalysis.scores.overall)}`}>
                  {storeAnalysis.scores.overall}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'ATS Compatible', value: storeAnalysis.scores.ats, icon: Shield },
            { label: 'Readability', value: storeAnalysis.scores.readability, icon: MessageSquare },
            { label: 'Impact', value: storeAnalysis.scores.impact, icon: TrendingUp },
            { label: 'Completeness', value: storeAnalysis.scores.completeness, icon: Award }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-gray-300 font-medium">{metric.label}</span>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(metric.value)}`}>
                {metric.value}%
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-full bg-gradient-to-r ${getScoreGradient(metric.value)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills & Feedback */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Your Skills</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {storeAnalysis.skills.length} skills identified from your CV
            </p>
            <div className="flex flex-wrap gap-3">
              {storeAnalysis.skills.map((skill, index) => (
                <motion.span
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="skill-tag"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Feedback</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {storeAnalysis.feedback.strengths.slice(0, 4).map((strength, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Improvements
                </h3>
                <ul className="space-y-2">
                  {storeAnalysis.feedback.improvements.slice(0, 4).map((improvement, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Job Matching */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Job Matching</h2>
            </div>
            <button
              onClick={handleAddJob}
              className="neon-border px-6 py-2 rounded-xl border border-white/10 hover:border-cyan-400 transition-colors"
            >
              + Add Job
            </button>
          </div>

          {jobDescriptions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No job descriptions added yet</p>
              <button
                onClick={handleAddJob}
                className="btn-primary"
              >
                Add Your First Job
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobDescriptions.map(job => (
                <JobMatchCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
