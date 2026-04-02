import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  ChevronDown
} from 'lucide-react';
import { applicationService, Application, ApplicationStatus } from '../services/applicationService';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Eye },
  interviewing: { label: 'Interviewing', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: UserCheck },
  accepted: { label: 'Accepted', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle },
  withdrawn: { label: 'Withdrawn', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: XCircle }
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const result = await applicationService.listByJob(); // Gets candidate's own apps
      setApplications(result.applications);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawing(appId);
    try {
      await applicationService.delete(appId);
      setApplications(apps => apps.filter(a => a.id !== appId));
    } catch (err) {
      console.error('Failed to withdraw:', err);
      alert('Failed to withdraw application');
    } finally {
      setWithdrawing(null);
    }
  };

  const toggleExpand = (appId: string) => {
    setExpandedId(expandedId === appId ? null : appId);
  };

  return (
    <ProtectedRoute allowedRoles={['candidate', 'interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">My Applications</h1>
            <p className="text-gray-400">
              Track the status of your job applications
            </p>
          </motion.div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
              <p className="text-gray-400 mb-6">
                Browse available jobs and submit your first application
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                Browse Jobs
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => {
                const statusConfig = STATUS_CONFIG[app.status];
                const isExpanded = expandedId === app.id;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card overflow-hidden"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpand(app.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">
                              {app.job_title || 'Unknown Position'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                            {app.job_company && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {app.job_company}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {app.match_score !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400">Match Score:</span>
                              <span className={`text-sm font-semibold ${app.match_score >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {Math.round(app.match_score)}%
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {app.status === 'pending' || app.status === 'reviewing' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWithdraw(app.id);
                              }}
                              disabled={withdrawing === app.id}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors text-sm flex items-center gap-2"
                            >
                              {withdrawing === app.id ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Withdraw
                            </button>
                          ) : null}
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-white/10 p-6 pt-4" onClick={e => e.stopPropagation()}>
                        <h4 className="text-sm font-semibold text-white mb-3">Application Details</h4>

                        <div className="space-y-4">
                          {app.analysis && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">Your CV Analysis</p>
                              <div className="grid grid-cols-4 gap-3 mb-4">
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <p className="text-xs text-gray-400">Overall</p>
                                  <p className="text-lg font-bold text-white">{app.analysis.scores.overall}%</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <p className="text-xs text-gray-400">ATS</p>
                                  <p className="text-lg font-bold text-white">{app.analysis.scores.ats}%</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <p className="text-xs text-gray-400">Readability</p>
                                  <p className="text-lg font-bold text-white">{app.analysis.scores.readability}%</p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <p className="text-xs text-gray-400">Impact</p>
                                  <p className="text-lg font-bold text-white">{app.analysis.scores.impact}%</p>
                                </div>
                              </div>

                              <p className="text-sm text-gray-400 mb-1">Summary</p>
                              <p className="text-gray-300 text-sm mb-3">
                                {typeof app.analysis.summary === 'string' ? app.analysis.summary : ''}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {app.analysis.skills.map((skill: any, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded text-xs text-cyan-300">
                                    {skill.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {app.notes && (
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Interviewer Notes</p>
                              <p className="text-gray-300 text-sm bg-white/5 p-3 rounded-lg">
                                {typeof app.notes === 'string' ? app.notes : (app.notes as any)?.content || ''}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick navigation */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors"
            >
              Browse More Jobs
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
