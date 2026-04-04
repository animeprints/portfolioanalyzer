import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Upload, Plus, X, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { analysisAPI, AnalysisResult } from '../services';
import { useAuth } from '../contexts/AuthContext';

interface JobDescription {
  title: string;
  requirements: string[];
  skills: string[];
}

export default function JobMatchPage() {
  const { user } = useAuth();
  const [job, setJob] = useState<JobDescription>({
    title: '',
    requirements: [],
    skills: [],
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [matchResult, setMatchResult] = useState<{
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
    recommendations: string[];
  } | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await analysisAPI.list();
      setAnalyses(response.data.analyses);
      if (response.data.analyses.length > 0) {
        setSelectedAnalysisId(response.data.analyses[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
      setError('Could not load your CV analyses. Please try again.');
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setJob({ ...job, requirements: [...job.requirements, newRequirement.trim()] });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setJob({ ...job, requirements: job.requirements.filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setJob({ ...job, skills: [...job.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setJob({ ...job, skills: job.skills.filter((_, i) => i !== index) });
  };

  const handleMatch = async () => {
    if (!selectedAnalysisId || job.skills.length === 0) {
      setError('Please select an analysis and add at least one skill.');
      return;
    }

    setIsMatching(true);
    setError(null);
    setMatchResult(null);

    try {
      const response = await analysisAPI.matchJob(selectedAnalysisId, job);
      setMatchResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to match job. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 mb-6">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-mono tracking-wider">JOB MATCHING</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Match with Jobs</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compare your CV against job descriptions and discover your ideal roles.
            Get personalized skill gap analysis and recommendations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Input Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border-cyan-500/30"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Plus className="w-6 h-6 text-cyan-400" />
                Job Description
              </h2>

              <div className="space-y-6">
                {/* CV Analysis Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your CV Analysis
                  </label>
                  <select
                    value={selectedAnalysisId}
                    onChange={(e) => setSelectedAnalysisId(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white"
                  >
                    {analyses.length === 0 ? (
                      <option value="">No analyses found. Upload a CV first.</option>
                    ) : (
                      analyses.map((analysis) => (
                        <option key={analysis.id} value={analysis.id}>
                          {analysis.created_at.substring(0, 10)} - {analysis.overall_score}%
                        </option>
                      ))
                    )}
                  </select>
                  {analyses.length === 0 && (
                    <p className="text-amber-400 text-sm mt-2">
                      You need to upload and analyze a CV first. Go to Analyze page.
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={job.title}
                    onChange={(e) => setJob({ ...job, title: e.target.value })}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all outline-none text-white"
                      placeholder="Add skill..."
                    />
                    <button
                      onClick={addSkill}
                      className="px-6 py-3 bg-purple-500 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-300"
                      >
                        {skill}
                        <button onClick={() => removeSkill(i)} className="hover:text-red-400">
                          <X className="w-4 h-4" />
                        </button>
                      </span>
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
                      onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white"
                      placeholder="Add requirement..."
                    />
                    <button
                      onClick={addRequirement}
                      className="px-6 py-3 bg-cyan-500 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <span className="text-gray-300">{req}</span>
                        <button
                          onClick={() => removeRequirement(i)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-sm mb-6"
                  >
                    {error}
                  </motion.div>
                )}


                <button

                  onClick={handleMatch}
                  disabled={!job.title || job.skills.length === 0 || isMatching}
                  className={`w-full py-5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                    isMatching || !job.title || job.skills.length === 0
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 transform hover:scale-[1.02]'
                  }`}
                >
                  {isMatching ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing match...
                    </>
                  ) : (
                    <>
                      <Target className="w-6 h-6" />
                      Find Match Score
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Requirements checklist */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 border-purple-500/30"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400">
                <AlertCircle className="w-5 h-5" />
                What We Compare
              </h3>
              <div className="space-y-4">
                {[
                  'Skill matching against your CV profile',
                  'ATS keyword optimization',
                  'Experience level alignment',
                  'Education requirements',
                  'Certifications and credentials',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {matchResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="sticky top-32 space-y-6"
                >
                  {/* Match Score */}
                  <div className="glass-card p-8 border-pink-500/30 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-600/10" />
                    <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-2">Match Score</div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-7xl font-bold gradient-text font-mono mb-4"
                      >
                        {matchResult.match_percentage}%
                      </motion.div>
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                          matchResult.match_percentage >= 80
                            ? 'bg-green-900/40 text-green-400 border border-green-500/30'
                            : matchResult.match_percentage >= 60
                            ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-900/40 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {matchResult.match_percentage >= 80
                          ? 'Excellent Match'
                          : matchResult.match_percentage >= 60
                          ? 'Good Match'
                          : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <div className="glass-card p-6 border-cyan-500/30">
                    <h3 className="text-lg font-semibold mb-6 text-cyan-400">Skills Analysis</h3>

                    {matchResult.matched_skills.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">
                            Matched ({matchResult.matched_skills.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.matched_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg text-xs bg-green-900/30 border border-green-500/30 text-green-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchResult.missing_skills.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">
                            Missing ({matchResult.missing_skills.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.missing_skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg text-xs bg-red-900/30 border border-red-500/30 text-red-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400">
                          Recommendations
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {matchResult.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-300 leading-relaxed">
                            • {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4">💡 Pro Tips</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  The match algorithm considers skill overlap, required experience level,
                  and keyword density from ATS systems.
                </p>
                <p>
                  A score above 70% indicates you're a strong candidate. Below 50% means
                  you may need to upskill or adjust your career path.
                </p>
                <p>
                  Use the recommendations to identify skill gaps and close them
                  before applying.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
