import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  BarChart3,
  Sparkles,
  RefreshCw,
  FileText,
  Award,
} from 'lucide-react';
import { analysisAPI, AnalysisResult } from '../services';
import { useAuth } from '../contexts/AuthContext';

interface JobDescription {
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  requirements: string[];
  skills: string[];
  description?: string;
}

interface JobMatchResult {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
  summary?: string;
}

// Job card component for saved jobs
function JobCard({
  job,
  onSelect,
  onRemove,
  index
}: {
  job: JobDescription;
  onSelect: () => void;
  onRemove: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-glass p-6 border-white/10 hover:border-violet-400/30 transition-all group cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
            {job.title}
          </h3>
          {job.company && (
            <p className="text-gray-400 text-sm">{job.company}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 rounded text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-400">
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {job.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-gold-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-gold-400">
              {job.skills.length}
            </span>
          </div>
          <span className="text-xs text-gray-400">skills</span>
        </div>
        <span className="text-xs text-gold-400 font-medium flex items-center gap-1">
          <Target className="w-3 h-3" />
          Click to match
        </span>
      </div>
    </motion.div>
  );
}

// Match score gauge
function ScoreGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'from-green-500 to-emerald-600';
    if (s >= 60) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getLabel = (s: number) => {
    if (s >= 80) return 'Excellent Match';
    if (s >= 60) return 'Good Match';
    return 'Needs Improvement';
  };

  const getLabelColor = (s: number) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <path
          d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        {/* Progress arc */}
        <motion.path
          d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
          fill="none"
          stroke={`url(--scoreGradient)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${score}, 100`}
          initial={{ strokeDasharray: '0, 100' }}
          animate={{ strokeDasharray: `${score}, 100` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : '#ef4444'} />
            <stop offset="100%" stopColor={score >= 80 ? '#34d399' : score >= 60 ? '#facc15' : '#f87171'} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="text-4xl font-mono font-bold text-white"
        >
          {score}%
        </motion.div>
      </div>
    </div>
  );
}

// Skill badge with maturity indicator
function SkillBadge({ skill, matched }: { skill: string; matched: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 ${
        matched
          ? 'bg-green-500/10 border-green-500/30 text-green-300'
          : 'bg-red-500/10 border-red-500/30 text-red-300'
      }`}
    >
      {matched ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {skill}
    </motion.div>
  );
}

// Match recommendation card
function MatchRecommendationCard({ title, items, color }: { title: string; items: string[]; color: 'gold' | 'violet' | 'green' | 'red' }) {
  const colors = {
    gold: 'from-gold-500/20 to-amber-600/20 border-gold-500/20 text-gold-400 icon-gold',
    violet: 'from-violet-500/20 to-purple-600/20 border-violet-500/20 text-violet-400 icon-violet',
    green: 'from-green-500/20 to-emerald-600/20 border-green-500/20 text-green-400 icon-green',
    red: 'from-red-500/20 to-rose-600/20 border-red-500/20 text-red-400 icon-red',
  };

  const iconColors = {
    gold: 'text-gold-400',
    violet: 'text-violet-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <div className={`card-glass p-6 ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]} border`}>
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${colors[color].split(' ')[3]}`}>
        {title === 'Matched Skills' && <CheckCircle className={`w-5 h-5 ${iconColors[color]}`} />}
        {title === 'Missing Skills' && <AlertCircle className={`w-5 h-5 ${iconColors[color]}`} />}
        {title === 'Recommendations' && <TrendingUp className={`w-5 h-5 ${iconColors[color]}`} />}
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 bg-gradient-to-r ${color === 'gold' ? 'from-gold-500 to-amber-600' : color === 'violet' ? 'from-violet-500 to-purple-600' : color === 'green' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'}`}>
              {i + 1}
            </div>
            <span className="text-gray-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// CV analysis selector
function CVAnalysisSelector({
  analyses,
  selectedId,
  onSelect
}: {
  analyses: AnalysisResult[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <FileText className="w-4 h-4 text-violet-400" />
        Your CV Analysis
      </label>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {analyses.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm text-center">
            No CV analyses found. Upload and analyze a CV first.
          </div>
        ) : (
          analyses.map((analysis) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
              onClick={() => onSelect(analysis.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selectedId === analysis.id
                  ? 'bg-gradient-to-r from-violet-500/10 to-gold-500/10 border-violet-500/30'
                  : 'bg-white/5 border-white/10 hover:border-violet-500/30'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-bold ${analysis.overall_score >= 70 ? 'text-green-400' : analysis.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {analysis.overall_score}%
                  </div>
                  <Award className={`w-4 h-4 ${analysis.overall_score >= 70 ? 'text-green-400' : analysis.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'}`} />
                </div>
              </div>
              <div className="text-sm text-gray-300">
                {analysis.personal_info?.name || 'Untitled Analysis'}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function JobMatchPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [job, setJob] = useState<JobDescription>({
    title: '',
    company: '',
    location: '',
    salary: '',
    requirements: [],
    skills: [],
    description: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [savedJobs, setSavedJobs] = useState<JobDescription[]>([]);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await analysisAPI.list();
      setAnalyses(response.data.analyses);
      if (response.data.analyses.length > 0 && !selectedAnalysisId) {
        setSelectedAnalysisId(response.data.analyses[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
      setError('Could not load your CV analyses.');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !job.skills.includes(newSkill.trim())) {
      setJob({ ...job, skills: [...job.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setJob({ ...job, skills: job.skills.filter((s) => s !== skill) });
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !job.requirements.includes(newRequirement.trim())) {
      setJob({ ...job, requirements: [...job.requirements, newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (req: string) => {
    setJob({ ...job, requirements: job.requirements.filter((r) => r !== req) });
  };

  const saveCurrentJob = () => {
    if (job.title && job.skills.length > 0) {
      setSavedJobs([...savedJobs, { ...job }]);
      setJob({ title: '', company: '', location: '', salary: '', requirements: [], skills: [], description: '' });
      setMatchResult(null);
    }
  };

  const handleMatch = async () => {
    if (!selectedAnalysisId || job.skills.length === 0) {
      setError('Please select a CV analysis and add at least one skill.');
      return;
    }

    setIsMatching(true);
    setError(null);
    setMatchResult(null);

    try {
      const response = await analysisAPI.matchJob(selectedAnalysisId, {
        title: job.title,
        skills: job.skills,
        requirements: job.requirements,
      });
      setMatchResult(response.data);

      // Auto-save to saved jobs
      if (!savedJobs.find(j => j.title === job.title && j.skills.join(',') === job.skills.join(','))) {
        setSavedJobs(prev => [...prev, job]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to match job. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  const selectSavedJob = (savedJob: JobDescription) => {
    setJob(savedJob);
    setActiveTab('create');
    setMatchResult(null);
  };

  const removeSavedJob = (index: number) => {
    setSavedJobs(savedJobs.filter((_, i) => i !== index));
  };

  const filteredSavedJobs = savedJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(147,51,234,0.08),transparent_40%),radial-gradient(circle_at_20%_70%,rgba(212,165,116,0.05),transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 mb-6">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400 text-sm font-mono tracking-wider">JOB MATCHING</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
            <span className="block text-white">Find Your Perfect</span>
            <span className="block bg-gradient-to-r from-violet-500 via-gold-500 to-pink-500 bg-clip-text text-transparent">
              Job Match
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Compare your CV against job descriptions. Get instant match scores,
            identify skill gaps, and receive personalized recommendations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel - Input form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4"
            >
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'create'
                    ? 'bg-gradient-to-r from-violet-500 to-pink-600 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                New Search
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'saved'
                    ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white shadow-lg shadow-gold-500/20'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 inline mr-2" />
                Saved Jobs ({savedJobs.length})
              </button>
            </motion.div>

            {/* Create new search panel */}
            {activeTab === 'create' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass p-8 border-violet-500/20"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-violet-400">
                  <Sparkles className="w-6 h-6" />
                  Job Description
                </h2>

                <div className="space-y-6">
                  {/* CV Analysis Selector */}
                  <CVAnalysisSelector
                    analyses={analyses}
                    selectedId={selectedAnalysisId}
                    onSelect={setSelectedAnalysisId}
                  />

                  {/* Job Title & Company */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) => setJob({ ...job, title: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                        placeholder="e.g., Senior React Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => setJob({ ...job, company: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  {/* Location & Salary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={job.location}
                        onChange={(e) => setJob({ ...job, location: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                        placeholder="e.g., San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salary (Optional)
                      </label>
                      <input
                        type="text"
                        value={job.salary}
                        onChange={(e) => setJob({ ...job, salary: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                        placeholder="e.g., $120k - $150k"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Skills *
                    </label>
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all outline-none text-white"
                        placeholder="Add a skill..."
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addSkill}
                        className="px-6 py-4 bg-gradient-to-r from-gold-500 to-amber-600 rounded-xl font-semibold text-white"
                      >
                        Add
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-300"
                        >
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Requirements
                    </label>
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                        className="flex-1 px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                        placeholder="Add requirement..."
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addRequirement}
                        className="px-6 py-4 bg-violet-500 rounded-xl font-semibold text-white hover:bg-violet-600 transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {job.requirements.map((req) => (
                        <div
                          key={req}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <span className="text-gray-300 text-sm">{req}</span>
                          <button onClick={() => removeRequirement(req)} className="text-gray-500 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save job */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleMatch}
                      disabled={!selectedAnalysisId || job.skills.length === 0 || isMatching}
                      whileHover={{ scale: isMatching || !selectedAnalysisId || job.skills.length === 0 ? 1 : 1.02 }}
                      whileTap={{ scale: isMatching || !selectedAnalysisId || job.skills.length === 0 ? 1 : 0.98 }}
                      className={`flex-1 py-5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                        isMatching || !selectedAnalysisId || job.skills.length === 0
                          ? 'bg-gray-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-violet-500 to-pink-600 hover:shadow-lg hover:shadow-violet-500/30'
                      }`}
                    >
                      {isMatching ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Target className="w-6 h-6" />
                          Get Match Score
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={saveCurrentJob}
                      disabled={!job.title || job.skills.length === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-5 rounded-xl font-semibold transition-all ${
                        !job.title || job.skills.length === 0
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      Save Job
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Saved jobs panel */}
            {activeTab === 'saved' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved jobs..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all outline-none text-white"
                  />
                </div>

                {/* Job list */}
                {filteredSavedJobs.length === 0 ? (
                  <div className="card-glass p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Saved Jobs</h3>
                    <p className="text-gray-400">
                      {searchQuery ? 'No jobs match your search.' : 'Start by creating a job match to save it here.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredSavedJobs.map((job, index) => (
                      <JobCard
                        key={index}
                        job={job}
                        index={index}
                        onSelect={() => selectSavedJob(job)}
                        onRemove={() => removeSavedJob(index)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* What we compare panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-glass p-8 border-gold-500/20"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold-400">
                <BarChart3 className="w-6 h-6" />
                What We Compare
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle, label: 'Skill Matching', desc: 'AI-powered skill alignment analysis' },
                  { icon: Target, label: 'ATS Keywords', desc: 'Resume keyword optimization check' },
                  { icon: Briefcase, label: 'Experience Level', desc: 'Seniority and years of experience' },
                  { icon: Award, label: 'Achievements', desc: 'Quantified results and impact' },
                  { icon: FileText, label: 'Requirements', desc: 'Must-have vs nice-to-have skills' },
                  { icon: TrendingUp, label: 'Growth Potential', desc: 'Career trajectory alignment' },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white mb-1">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right panel - Results */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {matchResult && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-32 space-y-6"
                >
                  {/* Match Score */}
                  <div className="card-glass p-8 border-pink-500/30 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-600/10" />
                    <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        Match Score
                      </div>
                      <ScoreGauge score={matchResult.match_percentage} />
                      <div
                        className={`mt-6 px-4 py-2 rounded-full text-sm font-bold inline-block ${
                          matchResult.match_percentage >= 80
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : matchResult.match_percentage >= 60
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {matchResult.match_percentage >= 80
                          ? 'Excellent Match'
                          : matchResult.match_percentage >= 60
                          ? 'Good Potential'
                          : 'Significant Gap'}
                      </div>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <MatchRecommendationCard
                    title="Matched Skills"
                    items={matchResult.matched_skills}
                    color="green"
                  />

                  <MatchRecommendationCard
                    title="Missing Skills"
                    items={matchResult.missing_skills}
                    color="red"
                  />

                  <MatchRecommendationCard
                    title="Recommendations"
                    items={matchResult.recommendations}
                    color="gold"
                  />

                  {/* Summary if available */}
                  {matchResult.summary && (
                    <div className="card-glass p-6 border-cyan-500/20">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-cyan-400">
                        <BarChart3 className="w-5 h-5" />
                        Analysis Summary
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {matchResult.summary}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tips card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-glass p-6 border-white/10"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gold-400">
                  <Sparkles className="w-5 h-5" />
                  Pro Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>
                    <strong className="text-white">70%+ score:</strong> You're a strong candidate.
                    Highlight matching skills prominently in your application.
                  </p>
                  <p>
                    <strong className="text-white">50-70% score:</strong> Consider upskilling in
                    missing areas before applying, or emphasize transferable skills.
                  </p>
                  <p>
                    <strong className="text-white">&lt;50% score:</strong> This role may not be the
                    best fit. Focus on roles that better match your current skill set.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
