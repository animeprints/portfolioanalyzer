import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { analysisAPI, AnalysisResult } from '../services';
import { FileText, Download, Trash2, Calendar, TrendingUp, Award, BarChart3, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await analysisAPI.list();
      setAnalyses(response.data.analyses);
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    try {
      await analysisAPI.delete(id);
      setAnalyses(analyses.filter((a) => a.id !== id));
    } catch (err) {
      alert('Failed to delete analysis');
    }
  };

  const averageScore = analyses.length > 0
    ? Math.round(analyses.reduce((acc, a) => acc + a.overall_score, 0) / analyses.length)
    : 0;

  const highestScore = analyses.length > 0
    ? Math.max(...analyses.map((a) => a.overall_score))
    : 0;

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.name || 'User'}! Here's your career analytics.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/analyze')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              New Analysis
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-semibold text-gray-300 hover:bg-white/20 transition-all"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-card p-6 border-cyan-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 flex items-center justify-center">
                <FileText className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Analyses</p>
                <div className="text-4xl font-bold gradient-text font-mono">{analyses.length}</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-purple-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <div className="text-4xl font-bold text-purple-400 font-mono">{averageScore}%</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-pink-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/30 flex items-center justify-center">
                <Award className="w-7 h-7 text-pink-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Best Score</p>
                <div className="text-4xl font-bold text-pink-400 font-mono">{highestScore}%</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analyses List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Recent Analyses
          </h2>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <p className="text-gray-400">Loading your analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="glass-card p-16 text-center border-white/10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">No analyses yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Upload your CV to get detailed insights, skill extraction, and personalized recommendations.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Upload Your First CV
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-6 border-white/10 hover:border-cyan-400/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="text-sm font-mono text-gray-400 mb-2">
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {analysis.personal_info.name || 'Untitled CV'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {analysis.personal_info.email || 'No email'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text font-mono">
                        {analysis.overall_score}%
                      </div>
                      <div className="text-xs text-gray-500">Overall</div>
                    </div>
                  </div>

                  {/* Mini score breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="text-center">
                      <div className="text-xs text-green-400 mb-1">ATS</div>
                      <div className="text-sm font-mono">{analysis.ats_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-cyan-400 mb-1">Read</div>
                      <div className="text-sm font-mono">{analysis.readability_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-purple-400 mb-1">Impact</div>
                      <div className="text-sm font-mono">{analysis.impact_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-pink-400 mb-1">Comp</div>
                      <div className="text-sm font-mono">{analysis.completeness_score}%</div>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {analysis.extracted_skills.technical.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-md text-xs bg-cyan-900/30 border border-cyan-500/30 text-cyan-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {analysis.extracted_skills.technical.length > 3 && (
                      <span className="px-2 py-1 rounded-md text-xs bg-white/10 border border-white/20 text-gray-400">
                        +{analysis.extracted_skills.technical.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/analyze/${analysis.id}`)}
                      className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {/* TODO: Export */}}
                      className="py-2 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      title="Download report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 glass-card p-8 border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/analyze')}
              className="p-6 rounded-xl bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border border-cyan-500/30 hover:border-cyan-400/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyze New CV</h3>
              <p className="text-gray-400 text-sm">
                Upload a resume to get AI-powered insights and recommendations.
              </p>
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 hover:border-purple-400/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Find Matches</h3>
              <p className="text-gray-400 text-sm">
                Compare your CV against job descriptions and find the best matches.
              </p>
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="p-6 rounded-xl bg-gradient-to-br from-pink-900/30 to-orange-900/30 border border-pink-500/30 hover:border-pink-400/50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Practice Interviews</h3>
              <p className="text-gray-400 text-sm">
                Prepare for interviews with AI-powered practice questions and feedback.
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
