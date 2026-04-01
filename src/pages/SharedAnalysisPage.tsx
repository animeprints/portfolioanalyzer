import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { shareService, SharedAnalysis } from '../services/shareService';
import { BarChart3, Award, Target, Download, Lock, ExternalLink } from 'lucide-react';

export default function SharedAnalysisPage() {
  const { token } = useParams<{ token: string }>();
  const [analysis, setAnalysis] = useState<SharedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAnalysis();
    }
  }, [token]);

  const fetchAnalysis = async () => {
    try {
      const data = await shareService.getSharedAnalysis(token!, showPasswordInput ? password : undefined);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load shared analysis');

      // Check if password is required
      if (err.response?.status === 401) {
        setShowPasswordInput(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const downloadReport = () => {
    // Trigger client-side export if analysis is available
    if (analysis) {
      // Could integrate with existing export functions
      alert('Export functionality - integrate with frontend export utilities');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (error && showPasswordInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Password Protected</h1>
          <p className="text-gray-400 mb-6">This shared analysis requires a password to view.</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              placeholder="Enter password"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-2xl w-full text-center"
        >
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Unable to Load Analysis</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Go to CV Analyzer
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { analysis: data, file_name } = analysis;
  const scores = data.scores;

  return (
    <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Shared CV Analysis</h1>
            <p className="text-gray-400">Shared via CV Analyzer</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadReport}
              className="px-6 py-3 glass-card flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Download className="w-5 h-5 text-cyan-400" />
              <span>Download</span>
            </button>
            <a
              href="https://cardzey.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 glass-card flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400" />
              <span>Try CV Analyzer</span>
            </a>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">Overall CV Score</h2>
              <p className="text-gray-400">Performance across key metrics</p>
            </div>

            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - scores.overall / 100)}`}
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
                <span className={`text-5xl font-bold ${getScoreColor(scores.overall)}`}>
                  {scores.overall}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'ATS Compatible', value: scores.ats, icon: Shield },
            { label: 'Readability', value: scores.readability, icon: BarChart3 },
            { label: 'Impact', value: scores.impact, icon: Target },
            { label: 'Completeness', value: scores.completeness, icon: Award }
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
            </motion.div>
          ))}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Skills ({data.skills.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full text-sm text-cyan-300"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-bold text-green-400 mb-4">Strengths</h3>
            <ul className="space-y-3">
              {data.feedback.strengths.map((s, i) => (
                <li key={i} className="text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Improvements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Areas for Improvement</h3>
            <ul className="space-y-3">
              {data.feedback.improvements.map((s, i) => (
                <li key={i} className="text-gray-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-12">
          <p>This analysis was shared via CV Analyzer</p>
          <p className="mt-2">
            <a
              href="https://cardzey.com"
              className="text-cyan-400 hover:underline"
            >
              Try CV Analyzer for your own CV →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
