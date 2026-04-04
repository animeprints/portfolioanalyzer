import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { analysisAPI, AnalysisResult } from '../services';
import { FileText, Download, Trash2, Calendar, TrendingUp, Award, BarChart3, ExternalLink, Plus } from 'lucide-react';
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
    ? Math.round(analyses.reduce((acc, a) => acc + (a.overall_score || 0), 0) / analyses.length)
    : 0;

  const highestScore = analyses.length > 0
    ? Math.max(...analyses.map((a) => a.overall_score || 0))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">
              Welcome back, {user?.name || 'User'}! Here's your career analytics.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/analyze')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Analysis
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Analyses</p>
                <p className="text-3xl font-bold text-slate-900">{analyses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Average Score</p>
                <p className="text-3xl font-bold text-green-600">{averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-orange/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Best Score</p>
                <p className="text-3xl font-bold text-accent-orange">{highestScore}%</p>
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Recent Analyses
          </h2>

          {isLoading ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-slate-500">Loading your analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="bg-white p-16 rounded-xl border border-slate-200 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No analyses yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Upload your CV to get detailed insights, skill extraction, and personalized recommendations.
              </p>
              <button
                onClick={() => navigate('/analyze')}
                className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
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
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="text-sm font-mono text-slate-400 mb-2">
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                        {analysis.personal_info?.name || 'Untitled CV'}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {(analysis as any).file_name || analysis.personal_info?.email || 'No email'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary font-mono">
                        {analysis.overall_score}%
                      </div>
                      <div className="text-xs text-slate-400">Overall</div>
                    </div>
                  </div>

                  {/* Mini score breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-6 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-green-600 mb-1">ATS</div>
                      <div className="text-sm font-semibold">{analysis.ats_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-primary mb-1">Read</div>
                      <div className="text-sm font-semibold">{analysis.readability_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-secondary mb-1">Impact</div>
                      <div className="text-sm font-semibold">{analysis.impact_score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-accent-orange mb-1">Comp</div>
                      <div className="text-sm font-semibold">{analysis.completeness_score}%</div>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {analysis.extracted_skills?.technical?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded text-xs bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill}
                      </span>
                    )) || null}
                    {analysis.extracted_skills?.technical?.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs bg-slate-100 text-slate-500 border border-slate-200">
                        +{(analysis.extracted_skills?.technical?.length || 0) - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/analyze`)}
                      className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {/* TODO: Export */}}
                      className="py-2 px-4 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                      title="Download report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="py-2 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
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
          className="mt-16 bg-white p-8 rounded-xl border border-slate-200 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/analyze')}
              className="p-6 rounded-xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyze New CV</h3>
              <p className="text-sm text-slate-600">
                Upload a resume to get AI-powered insights and recommendations.
              </p>
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="p-6 rounded-xl border-2 border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Find Job Matches</h3>
              <p className="text-sm text-slate-600">
                Compare your CV against job descriptions and find the best matches.
              </p>
            </button>
            <button
              onClick={() => navigate('/linkedin')}
              className="p-6 rounded-xl border-2 border-accent-orange/20 hover:border-accent-orange hover:bg-accent-orange/5 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-orange/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-accent-orange" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">LinkedIn Optimization</h3>
              <p className="text-sm text-slate-600">
                Get suggestions to improve your LinkedIn profile visibility.
              </p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
