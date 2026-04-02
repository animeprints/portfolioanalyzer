import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { jobService, Job } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useStore } from '../store/useStore';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

export default function JobsPage() {
  const navigate = useNavigate();
  const { currentCVAnalysis } = useStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const result = await jobService.list();
      // Only show active jobs to candidates
      const activeJobs = result.jobs.filter(job => job.status === 'active');
      setJobs(activeJobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!currentCVAnalysis) {
      setMessage({ type: 'error', text: 'Please upload and analyze your CV first' });
      navigate('/upload');
      return;
    }

    setApplying(jobId);
    setMessage(null);
    try {
      await applicationService.apply({
        job_id: jobId,
        analysis_id: currentCVAnalysis.id
      });
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setAppliedJobs(prev => new Set(prev).add(jobId));
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to submit application. You may have already applied.'
      });
    } finally {
      setApplying(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['candidate', 'interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Available Jobs</h1>
              <p className="text-gray-400">
                Browse and apply to job opportunities
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              Back
            </button>
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

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No active jobs</h3>
              <p className="text-gray-400 mb-6">
                There are no job postings available at the moment. Check back later!
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                Go to Dashboard
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job, index) => {
                const isApplied = appliedJobs.has(job.id);
                const isApplying = applying === job.id;
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {job.title}
                          </h3>
                          {isApplied && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Applied
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3 flex-wrap">
                          {job.company && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.company}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {job.description && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {job.description}
                          </p>
                        )}

                        {job.requirements && job.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.slice(0, 4).map((req, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white/5 border border-cyan-400/30 rounded text-xs text-cyan-300"
                              >
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 4 && (
                              <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                                +{job.requirements.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={isApplied || isApplying || !currentCVAnalysis}
                          className={`px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all ${
                            isApplied
                              ? 'bg-green-500/20 border border-green-400/30 cursor-default'
                              : !currentCVAnalysis
                              ? 'bg-gray-500/20 border border-gray-400/30 cursor-not-allowed'
                              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                          }`}
                        >
                          {isApplying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Applying...
                            </>
                          ) : isApplied ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Applied
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-5 h-5" />
                              Apply Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
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
