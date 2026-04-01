import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Clock,
  Search
} from 'lucide-react';
import { jobService, Job } from '../../services/jobService';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const result = await jobService.list();
      setJobs(result.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filter === 'all'
    ? jobs
    : jobs.filter(job => job.status === filter);

  const stats = {
    all: jobs.length,
    draft: jobs.filter(j => j.status === 'draft').length,
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status === 'closed').length
  };

  return (
    <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Job Postings</h1>
              <p className="text-gray-400">Create and manage your job listings</p>
            </div>
            <button
              onClick={() => navigate('/interviewer/jobs/new')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2 w-fit"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All', count: stats.all },
              { key: 'active', label: 'Active', count: stats.active },
              { key: 'draft', label: 'Draft', count: stats.draft },
              { key: 'closed', label: 'Closed', count: stats.closed }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-400 mb-6">Create your first job posting to start receiving applications</p>
              <button
                onClick={() => navigate('/interviewer/jobs/new')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Job
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-6 relative overflow-hidden group hover:border-cyan-400/30 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16" />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {job.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          job.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                          job.status === 'closed' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                        {job.company && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {job.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/interviewer/jobs/${job.id}/edit`);
                        }}
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Edit job"
                      >
                        <Edit2 className="w-5 h-5 text-cyan-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this job?')) {
                            // TODO: Implement delete
                            console.log('Delete job', job.id);
                          }
                        }}
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Delete job"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                      <button
                        onClick={() => navigate(`/interviewer/candidates?jobId=${job.id}`)}
                        className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        Find Candidates
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
