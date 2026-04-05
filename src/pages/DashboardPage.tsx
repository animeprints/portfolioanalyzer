import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { analysisAPI, AnalysisResult } from '../services';
import {
  FileText, Download, Trash2, Calendar, TrendingUp,
  Award, BarChart3, ExternalLink, Plus, Sparkles, Target, Zap
} from 'lucide-react';
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

  const stats = [
    {
      icon: FileText,
      label: 'Analyses',
      value: analyses.length,
      color: 'gold',
      gradient: 'from-gold-500/20 to-gold-500/5',
      border: 'border-gold-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: `${averageScore}%`,
      color: 'emerald',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20',
    },
    {
      icon: Award,
      label: 'Best Score',
      value: `${highestScore}%`,
      color: 'violet',
      gradient: 'from-violet-500/20 to-violet-500/5',
      border: 'border-violet-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-silver-400 text-lg">
              {user?.name || 'User'}, here's your career analytics overview.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => navigate('/analyze')}
                className="btn-gold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Analysis
              </button>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="px-6 py-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10 text-silver-300 font-semibold hover:bg-surface/70 hover:text-white transition-all"
            >
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card-glass p-8 bg-gradient-to-br ${stat.gradient} border ${stat.border} relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-${stat.color}-500/15 flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 text-${stat.color}-400`} />
                  </div>
                  <p className="text-sm text-silver-400 mb-2 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-4xl font-display font-bold text-${stat.color}-400`}>{stat.value}</p>
                </div>
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-2xl`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
            <Zap className="w-7 h-7 text-gold-400" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Analyze New CV',
                desc: 'Upload a new resume for AI-powered insights',
                icon: BarChart3,
                color: 'gold',
                action: () => navigate('/analyze'),
              },
            {
              title: 'Find Job Matches',
              desc: 'Compare your profile against job descriptions',
              icon: Target,
              color: 'violet',
              action: () => navigate('/jobs'),
            },
            {
              title: 'LinkedIn Optimization',
              desc: 'Improve your LinkedIn profile visibility',
              icon: Sparkles,
              color: 'emerald',
              action: () => navigate('/linkedin'),
            },
          ].map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`p-8 rounded-2xl border border-${action.color}-500/20 bg-gradient-to-br from-${action.color}-500/5 to-transparent hover:from-${action.color}-500/10 transition-all text-left group`}
            >
              <div className={`w-14 h-14 rounded-xl bg-${action.color}-500/15 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-7 h-7 text-${action.color}-400`} />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-3">{action.title}</h3>
              <p className="text-silver-400 text-sm leading-relaxed">{action.desc}</p>
            </motion.button>
          ))}
        </div>
        </motion.div>

        {/* Analyses List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
            <FileText className="w-7 h-7 text-gold-400" />
            Recent Analyses
          </h2>

          {isLoading ? (
            <div className="card-glass p-20 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-gold-500/20 border-t-gold-400 animate-spin" />
              <p className="text-silver-400">Loading your analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-glass p-20 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface/50 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-silver-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">No Analyses Yet</h3>
              <p className="text-silver-400 mb-8 max-w-md mx-auto leading-relaxed">
                Upload your CV to get detailed insights, skill extraction, and personalized recommendations powered by AI.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/analyze')}
                className="btn-gold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Upload Your First CV
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="card-glass p-6 group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-silver-500 mb-2 uppercase">
                        {new Date(analysis.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors truncate">
                        {analysis.personal_info?.name || 'Untitled CV'}
                      </h3>
                      <p className="text-sm text-silver-500 truncate">
                        {analysis.file_name || analysis.personal_info?.email || 'No email'}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-3xl font-display font-bold text-gold-400">{analysis.overall_score}%</div>
                      <div className="text-xs text-silver-500 uppercase tracking-wider">Overall</div>
                    </div>
                  </div>

                  {/* Mini score breakdown */}
                  <div className="grid grid-cols-4 gap-2 mb-6 p-3 rounded-xl bg-surface/50">
                    {[
                      { label: 'ATS', color: 'emerald', value: analysis.ats_score },
                      { label: 'Read', color: 'violet', value: analysis.readability_score },
                      { label: 'Impact', color: 'blue', value: analysis.impact_score },
                      { label: 'Comp', color: 'amber', value: analysis.completeness_score },
                    ].map(({ label, color, value }) => (
                      <div key={label} className="text-center">
                        <div className={`text-xs text-${color}-400 mb-1 uppercase font-bold`}>{label}</div>
                        <div className="text-sm font-semibold text-white">{value}%</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {analysis.extracted_skills?.technical?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded text-xs bg-gold-500/10 text-gold-400 border border-gold-500/20 font-medium"
                      >
                        {skill}
                      </span>
                    )) || null}
                    {(analysis.extracted_skills?.technical?.length || 0) > 3 && (
                      <span className="px-2 py-1 rounded text-xs bg-surface/50 text-silver-500 border border-white/10">
                        +{(analysis.extracted_skills?.technical?.length || 0) - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate('/analyze')}
                      className="flex-1 py-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-medium hover:bg-gold-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
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
      </div>
    </div>
  );
}
