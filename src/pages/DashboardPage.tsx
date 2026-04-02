import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
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
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Link as Linkedin,
  Code as Github,
  Globe,
  Mail,
  Phone,
  Calendar,
  Building,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { generatePDFReport } from '../utils/pdfExporter';
import { analysisService } from '../services/analysisService';
import NeonButton from '../components/UI/NeonButton';
import { matchJobDescription } from '../utils/jobMatcher';

export default function DashboardPage() {
  const {
    currentCVAnalysis: storeAnalysis,
    setCurrentAnalysis,
    jobDescriptions,
    addJobDescription,
    updateJobMatch
  } = useStore();

  const [analysesList, setAnalysesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'experience', 'education']);

  // Load user's analyses on mount
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        setLoading(true);
        const result = await analysisService.list();
        setAnalysesList(result.analyses);

        // If we don't have a current analysis but have list, load most recent
        if (!storeAnalysis && result.analyses.length > 0) {
          const detail = await analysisService.get(result.analyses[0].id);
          setCurrentAnalysis(detail.analysis);
        }
      } catch (err) {
        console.error('Failed to load analyses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, [storeAnalysis, setCurrentAnalysis]);

  const handleAnalysisSelect = async (analysisId: string) => {
    try {
      const result = await analysisService.get(analysisId);
      setCurrentAnalysis(result.analysis);
    } catch (err) {
      console.error('Failed to load analysis:', err);
    }
  };

  const handleExportPDF = async () => {
    if (!storeAnalysis) return;
    setExporting(true);
    try {
      await generatePDFReport(storeAnalysis);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setExporting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (score >= 60) return { label: 'Good', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (score >= 40) return { label: 'Fair', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { label: 'Poor', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your analysis...</p>
        </motion.div>
      </div>
    );
  }

  // No analysis state
  if (!storeAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-xl"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Analysis Yet</h2>
          <p className="text-gray-400 mb-8">
            Upload your CV to get started with AI-powered analysis and insights.
          </p>
          <a href="/upload">
            <NeonButton variant="primary" size="lg" icon={<BarChart3 className="w-5 h-5" />}>
              Upload Your CV
            </NeonButton>
          </a>
        </motion.div>
      </div>
    );
  }

  const analysis = storeAnalysis;

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-6 relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analysis Complete</h1>
            <p className="text-gray-400">
              Analysis for <span className="text-cyan-400 font-medium">{analysis.fileName}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJobModal(true)}
              className="glass-card px-6 py-3 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Target className="w-5 h-5 text-cyan-400" />
              <span>Match Job</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="glass-card px-6 py-3 flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-cyan-400" />
              )}
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </motion.div>

        {/* CV History Selector */}
        {analysesList.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-cyan-400" />
              <span className="text-gray-300 font-medium">Your CV Analyses:</span>
              <span className="text-gray-500 text-sm">({analysesList.length} total)</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {analysesList.map((analysisItem) => (
                <button
                  key={analysisItem.id}
                  onClick={() => handleAnalysisSelect(analysisItem.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                    analysis.id === analysisItem.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {analysisItem.file_name}
                  <span className="text-xs opacity-70">
                    ({new Date(analysisItem.created_at).toLocaleDateString()})
                  </span>
                  {analysis.id === analysisItem.id && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Current</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Overall Score Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl -ml-16 -mb-16" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-gray-300 mb-4">
                <Award className="w-4 h-4 text-cyan-400" />
                Analysis Completed
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Your CV scored <span className={getScoreColor(analysis.scores.overall)}>{analysis.scores.overall}%</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-lg">
                Based on industry standards for ATS compatibility, readability, and impact.
                {analysis.scores.overall >= 80
                  ? ' Excellent work! Your CV is well-optimized.'
                  : analysis.scores.overall >= 60
                  ? ' Good foundation with room for improvement.'
                  : ' Consider making some improvements to boost your score.'
                }
              </p>
            </div>

            <div className="relative">
              <svg className="w-40 h-40 md:w-48 md:h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 88}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 88 * (1 - analysis.scores.overall / 100)}` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className={`text-5xl md:text-6xl font-bold ${getScoreColor(analysis.scores.overall)}`}
                >
                  {analysis.scores.overall}%
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'ATS Compatibility', value: analysis.scores.ats, icon: Shield, desc: 'How well your CV passes applicant tracking systems' },
            { label: 'Readability', value: analysis.scores.readability, icon: MessageSquare, desc: 'Clarity and ease of reading' },
            { label: 'Impact', value: analysis.scores.impact, icon: TrendingUp, desc: 'Effectiveness of your achievements' },
            { label: 'Completeness', value: analysis.scores.completeness, icon: Award, desc: 'Thoroughness of information provided' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card p-6 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-colors">
                  <metric.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">{metric.label}</span>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(metric.value)}`}>
                {metric.value}%
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${getScoreGradient(metric.value)}`}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">{metric.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Personal Info & Experience */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleSection('personal')}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">Personal Information</h2>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.includes('personal') ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedSections.includes('personal') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      {analysis.personalInfo.name && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="text-white">{analysis.personalInfo.name}</p>
                          </div>
                        </div>
                      )}
                      {analysis.personalInfo.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-white text-sm">{analysis.personalInfo.email}</p>
                          </div>
                        </div>
                      )}
                      {analysis.personalInfo.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-white">{analysis.personalInfo.phone}</p>
                          </div>
                        </div>
                      )}
                      {analysis.personalInfo.linkedin && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <Linkedin className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-xs text-gray-500">LinkedIn</p>
                            <p className="text-white text-sm">{analysis.personalInfo.linkedin}</p>
                          </div>
                        </div>
                      )}
                      {analysis.personalInfo.github && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <Github className="w-5 h-5 text-gray-300" />
                          <div>
                            <p className="text-xs text-gray-500">GitHub</p>
                            <p className="text-white text-sm">{analysis.personalInfo.github}</p>
                          </div>
                        </div>
                      )}
                      {analysis.personalInfo.website && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Website</p>
                            <p className="text-white text-sm">{analysis.personalInfo.website}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Summary */}
            {analysis.summary && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Professional Summary</h2>
                </div>
                <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
              </motion.div>
            )}

            {/* Experience */}
            {analysis.experience.positions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => toggleSection('experience')}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Experience</h2>
                      <p className="text-sm text-gray-400">
                        {analysis.experience.years} years total · {analysis.experience.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{analysis.experience.positions.length} positions</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.includes('experience') ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedSections.includes('experience') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 overflow-hidden"
                    >
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        {analysis.experience.positions.map((position, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-white font-semibold">{position.title}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Building className="w-4 h-4" />
                                  <span>{position.company}</span>
                                  {position.duration && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                                      <Calendar className="w-4 h-4" />
                                      <span>{position.duration}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            {position.description && position.description.length > 0 && (
                              <ul className="mt-3 space-y-1">
                                {position.description.map((desc, i) => (
                                  <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    {desc}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Education */}
            {analysis.education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => toggleSection('education')}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                    <div>
                      <h2 className="text-xl font-bold text-white">Education</h2>
                      <p className="text-sm text-gray-400">{analysis.education.length} credential{analysis.education.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.includes('education') ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSections.includes('education') && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 overflow-hidden"
                    >
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        {analysis.education.map((edu, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl bg-white/5"
                          >
                            <h3 className="text-white font-semibold">{edu.degree}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                              <span>{edu.institution}</span>
                              {edu.year && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                                  <Calendar className="w-4 h-4" />
                                  <span>{edu.year}</span>
                                </>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Skills Detected</h2>
                    <p className="text-sm text-gray-400">{analysis.skills.length} total skills</p>
                  </div>
                </div>
                {analysis.skills.length > 8 && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {showAllSkills ? 'Show Less' : 'View All'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllSkills ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {(showAllSkills ? analysis.skills : analysis.skills.slice(0, 8)).map((skill, index) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="skill-tag text-sm"
                  >
                    {skill.name}
                    <span className="ml-1 text-cyan-400/70 text-xs">
                      ({Math.round(skill.relevance * 100)}%)
                    </span>
                  </motion.span>
                ))}
              </div>

              {!showAllSkills && analysis.skills.length > 8 && (
                <p className="text-gray-500 text-sm mt-4">
                  +{analysis.skills.length - 8} more skills
                </p>
              )}
            </motion.div>
          </div>

          {/* Right Column - Feedback & Keywords */}
          <div className="space-y-6">
            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Recommendations</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.feedback.strengths.slice(0, 4).map((strength, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2 p-2 rounded-lg bg-white/5">
                        <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {analysis.feedback.improvements.slice(0, 4).map((improvement, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2 p-2 rounded-lg bg-white/5">
                        <span className="text-yellow-400 mt-0.5 flex-shrink-0">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Keywords */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">ATS Keywords</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Important keywords detected in your CV
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.feedback.keywords.slice(0, 12).map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-full text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Missing Skills */}
            {analysis.feedback.missingSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-pink-400" />
                  <h2 className="text-xl font-bold text-white">Missing Skills</h2>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Skills commonly found in your target role that are missing
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.feedback.missingSkills.slice(0, 8).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full text-xs bg-pink-500/10 text-pink-300 border border-pink-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Job Matching Preview */}
            {jobDescriptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Job Matches</h2>
                  </div>
                  <span className="text-sm text-gray-400">{jobDescriptions.length}</span>
                </div>
                <div className="space-y-3">
                  {jobDescriptions.slice(0, 3).map((job) => {
                    const compat = getCompatibilityLabel(job.matchScore || 0);
                    return (
                      <div
                        key={job.id}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-medium text-sm">{job.title}</h4>
                            {job.company && (
                              <p className="text-gray-400 text-xs">{job.company}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${compat.color}`}>
                            {compat.label} ({job.matchScore}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {jobDescriptions.length > 3 && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    +{jobDescriptions.length - 3} more
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowJobModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add Job Description</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Job Title *</label>
                  <input
                    type="text"
                    id="jobTitle"
                    className="input-field"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    id="jobCompany"
                    className="input-field"
                    placeholder="e.g., Tech Corp"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Requirements * (comma-separated)
                  </label>
                  <textarea
                    id="jobRequirements"
                    className="input-field"
                    rows={4}
                    placeholder="React, TypeScript, Node.js, GraphQL..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const title = (document.getElementById('jobTitle') as HTMLInputElement).value;
                    const company = (document.getElementById('jobCompany') as HTMLInputElement).value;
                    const requirements = (document.getElementById('jobRequirements') as HTMLTextAreaElement).value;

                    if (!title || !requirements) {
                      alert('Please fill in title and requirements');
                      return;
                    }

                    const job = {
                      id: `job-${Date.now()}`,
                      title,
                      company,
                      description: '',
                      requirements: requirements.split(',').map(r => r.trim()).filter(Boolean)
                    };

                    addJobDescription(job);
                    if (analysis) {
                      // Use local matching for now; could be replaced with API call
                      const match = matchJobDescription(analysis.skills, job);
                      updateJobMatch(job.id, {
                        matchScore: match.matchScore,
                        matchedSkills: match.matchedSkills,
                        missingSkills: match.missingSkills
                      });
                    }
                    setShowJobModal(false);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Add Job
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
