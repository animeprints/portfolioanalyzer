import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  BarChart3,
  Target
} from 'lucide-react';
import { jobService } from '../services/jobService';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  status: string;
  created_at: string;
}

export default function InterviewerDashboardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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

  const activeJobs = jobs.filter(j => j.status === 'active' || j.status === 'draft');
  const totalJobs = jobs.length;

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
              <h1 className="text-4xl font-bold text-white mb-2">Interviewer Dashboard</h1>
              <p className="text-gray-400">Manage job postings and review candidates</p>
            </div>
            <Link
              to="/interviewer/jobs/new"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Jobs', value: totalJobs, icon: Briefcase, color: 'from-cyan-500 to-blue-500' },
              { label: 'Active Jobs', value: activeJobs.filter(j => j.status === 'active').length, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
              { label: 'Draft Jobs', value: activeJobs.filter(j => j.status === 'draft').length, icon: Calendar, color: 'from-yellow-500 to-orange-500' },
              { label: 'Candidates', value: '0', icon: Users, color: 'from-green-500 to-emerald-500' } // Placeholder until applications are implemented
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                Recent Jobs
              </h2>
              <Link to="/interviewer/jobs" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-6">No job postings yet</p>
                <Link
                  to="/interviewer/jobs/new"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/interviewer/jobs/${job.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-400">{job.company || 'No company specified'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        job.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {job.description || 'No description provided'}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      Created {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Find Candidates
              </h3>
              <p className="text-gray-400 mb-4">
                Search and filter candidates based on skills, experience, and keywords.
              </p>
              <Link
                to="/interviewer/candidates"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Search Candidates <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Candidate Matching
              </h3>
              <p className="text-gray-400 mb-4">
                Match job requirements against candidate CVs and get ranked results.
              </p>
              <Link
                to="/interviewer/candidates"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                Start Matching <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
