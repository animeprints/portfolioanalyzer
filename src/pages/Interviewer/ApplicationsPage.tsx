import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  ChevronDown,
  MessageSquare,
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Award,
  ExternalLink
} from 'lucide-react';
import { applicationService, Application, ApplicationStatus } from '../../services/applicationService';
import { jobService, Job } from '../../services/jobService';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

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
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && initialJobId && !selectedJobId) {
      setSelectedJobId(initialJobId);
    }
  }, [jobs, initialJobId]);

  useEffect(() => {
    loadApplications();
  }, [selectedJobId, statusFilter]);

  const loadJobs = async () => {
    try {
      const result = await jobService.list();
      setJobs(result.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await applicationService.listByJob(selectedJobId || undefined);
      let apps = result.applications;

      // Apply status filter
      if (statusFilter !== 'all') {
        apps = apps.filter(app => app.status === statusFilter);
      }

      setApplications(apps);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setMessage({ type: 'error', text: 'Failed to load applications' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingStatus(appId);
    try {
      await applicationService.updateStatus(appId, newStatus);
      setMessage({ type: 'success', text: `Application marked as ${newStatus}` });
      loadApplications();
      if (selectedApp?.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update status' });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      await applicationService.updateNotes(selectedApp.id, notes);
      setMessage({ type: 'success', text: 'Notes saved' });
      loadApplications();
      setSelectedApp({ ...selectedApp, notes });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save notes' });
    } finally {
      setSavingNotes(false);
    }
  };

  const toggleExpand = async (app: Application) => {
    if (expandedAppId === app.id) {
      setExpandedAppId(null);
      setSelectedApp(null);
    } else {
      // Load full application details if not already loaded
      if (!app.analysis) {
        try {
          const full = await applicationService.get(app.id);
          setSelectedApp(full.application);
          setNotes(full.application.notes ? typeof full.application.notes === 'string' ? full.application.notes : (full.application.notes as any).content : '');
        } catch (err) {
          console.error('Failed to load application details:', err);
          return;
        }
      } else {
        setSelectedApp(app);
        setNotes(app.notes ? typeof app.notes === 'string' ? app.notes : (app.notes as any).content : '');
      }
      setExpandedAppId(app.id);
    }
  };

  const filteredCount = statusFilter === 'all' ? applications.length : applications.filter(a => a.status === statusFilter).length;

  // Get current job for context
  const currentJob = jobs.find(j => j.id === selectedJobId);

  return (
    <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Applications</h1>
              <p className="text-gray-400">
                Review and manage candidate applications
                {currentJob && ` for "${currentJob.title}"`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/interviewer/jobs')}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                View Jobs
              </button>
              <button
                onClick={() => navigate('/interviewer/candidates')}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Candidates
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Job Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Job
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="">All Jobs</option>
                  {jobs.filter(j => j.status === 'active').map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} {job.company ? `(${job.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div className="flex items-end">
                <div className="w-full p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Showing</p>
                  <p className="text-3xl font-bold text-white">{filteredCount}</p>
                  <p className="text-gray-500 text-sm">application(s)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No applications found</h3>
              <p className="text-gray-400 mb-6">
                {selectedJobId || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'When candidates apply to your jobs, they will appear here'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => {
                const statusConfig = STATUS_CONFIG[app.status];
                const isExpanded = expandedAppId === app.id;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`glass-card transition-all ${isExpanded ? 'border-cyan-400/50' : 'hover:border-cyan-400/30'}`}
                  >
                    {/* Main row */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpand(app)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white truncate">
                              {app.candidate_name || 'Unknown Candidate'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${app.match_score >= 80 ? 'bg-green-500/20 text-green-400' : app.match_score >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                              <Award className="w-3 h-3" />
                              {Math.round(app.match_score)}% Match
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2 flex-wrap">
                            {app.job_title && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {app.job_title}
                              </span>
                            )}
                            {app.candidate_email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {app.candidate_email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {app.analysis && (
                            <div className="flex flex-wrap gap-2">
                              {(app.analysis.skills as any[]).slice(0, 4).map((skill: any, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-white/5 border border-cyan-400/30 rounded text-xs text-cyan-300"
                                >
                                  {skill.name}
                                </span>
                              ))}
                              {(app.analysis.skills as any[]).length > 4 && (
                                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                                  +{(app.analysis.skills as any[]).length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && selectedApp && (
                      <div className="border-t border-white/10 p-6 pt-4" onClick={e => e.stopPropagation()}>
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* CV Analysis */}
                          <div className="md:col-span-2">
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-cyan-400" />
                              CV Analysis
                            </h4>

                            {selectedApp.analysis ? (
                              <div className="space-y-4">
                                {/* Scores */}
                                <div className="grid grid-cols-4 gap-3">
                                  <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-xs text-gray-400">Overall</p>
                                    <p className="text-xl font-bold text-white">{selectedApp.analysis.scores.overall}%</p>
                                  </div>
                                  <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-xs text-gray-400">ATS</p>
                                    <p className="text-xl font-bold text-white">{selectedApp.analysis.scores.ats}%</p>
                                  </div>
                                  <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-xs text-gray-400">Readability</p>
                                    <p className="text-xl font-bold text-white">{selectedApp.analysis.scores.readability}%</p>
                                  </div>
                                  <div className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-xs text-gray-400">Impact</p>
                                    <p className="text-xl font-bold text-white">{selectedApp.analysis.scores.impact}%</p>
                                  </div>
                                </div>

                                {/* Personal Info */}
                                {(selectedApp.analysis.personalInfo as any).name && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Name</p>
                                    <p className="text-white">{(selectedApp.analysis.personalInfo as any).name}</p>
                                  </div>
                                )}

                                {(selectedApp.analysis.personalInfo as any).email && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Email</p>
                                    <p className="text-white flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      {(selectedApp.analysis.personalInfo as any).email}
                                    </p>
                                  </div>
                                )}

                                {selectedApp.analysis.personalInfo.linkedin && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">LinkedIn</p>
                                    <p className="text-white flex items-center gap-2">
                                      <ExternalLink className="w-4 h-4" />
                                      {selectedApp.analysis.personalInfo.linkedin}
                                    </p>
                                  </div>
                                )}

                                {/* Skills */}
                                <div>
                                  <p className="text-sm text-gray-400 mb-2">Skills ({selectedApp.analysis.skills.length})</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedApp.analysis.skills.map((skill: any, i: number) => (
                                      <span
                                        key={i}
                                        className="px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-sm text-cyan-300"
                                      >
                                        {skill.name}
                                        {skill.category && (
                                          <span className="text-xs text-gray-400 ml-1">({skill.category})</span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Experience */}
                                {selectedApp.analysis.experience && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Experience</p>
                                    <p className="text-white">
                                      {(selectedApp.analysis.experience as any).level} - {(selectedApp.analysis.experience as any).years} years
                                    </p>
                                  </div>
                                )}

                                {/* Summary */}
                                {selectedApp.analysis.summary && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-1">Summary</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {typeof selectedApp.analysis.summary === 'string' ? selectedApp.analysis.summary : ''}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400">No analysis data available</p>
                            )}
                          </div>

                          {/* Actions & Notes */}
                          <div className="space-y-6">
                            {/* Status Actions */}
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <Edit3 className="w-4 h-4" />
                                Update Status
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                                  const Icon = config.icon;
                                  const isCurrent = selectedApp.status === key;
                                  const isUpdating = updatingStatus === selectedApp.id && selectedApp.status !== key;
                                  return (
                                    <button
                                      key={key}
                                      onClick={() => handleStatusChange(selectedApp.id, key as ApplicationStatus)}
                                      disabled={isCurrent || isUpdating}
                                      className={`p-2 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                                        isCurrent
                                          ? `${config.bg} ${config.color} border-current opacity-50 cursor-not-allowed`
                                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                      }`}
                                    >
                                      {isUpdating ? (
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Icon className="w-4 h-4" />
                                      )}
                                      {config.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Notes
                              </h4>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about this candidate..."
                                className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors min-h-[120px] resize-none text-sm"
                              />
                              <button
                                onClick={handleSaveNotes}
                                disabled={savingNotes}
                                className="mt-2 w-full py-2 px-4 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm flex items-center justify-center gap-2"
                              >
                                {savingNotes ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Edit3 className="w-4 h-4" />
                                )}
                                Save Notes
                              </button>
                            </div>

                            {/* Contact */}
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-3">Contact Candidate</h4>
                              <div className="space-y-2">
                                {selectedApp.candidate_email && (
                                  <a
                                    href={`mailto:${selectedApp.candidate_email}`}
                                    className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                                  >
                                    <Mail className="w-4 h-4" />
                                    Send Email
                                  </a>
                                )}
                                {selectedApp.candidate_email && (
                                  <a
                                    href={`tel:${selectedApp.candidate_email}`}
                                    className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                                  >
                                    <Phone className="w-4 h-4" />
                                    Schedule Call
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
