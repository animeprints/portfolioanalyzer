import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { jobService } from '../../services/jobService';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      loadJob();
    }
  }, [id, isNew]);

  const loadJob = async () => {
    try {
      const jobsResult = await jobService.list();
      const job = jobsResult.jobs.find(j => j.id === id);
      if (job) {
        setTitle(job.title);
        setCompany(job.company || '');
        setDescription(job.description || '');
        setRequirements(job.requirements ? job.requirements.join(', ') : '');
        setStatus(job.status === 'draft' || job.status === 'active' ? job.status : 'draft');
      } else {
        setError('Job not found');
      }
    } catch (err) {
      setError('Failed to load job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const requirementsArray = requirements
        .split(',')
        .map(r => r.trim())
        .filter(Boolean);

      const jobData = {
        title,
        company: company || undefined,
        description: description || undefined,
        requirements: requirementsArray,
        status
      };

      if (isNew) {
        await jobService.create(jobData as any);
      } else {
        // TODO: Implement update endpoint
        console.log('Update job', id, jobData);
        alert('Update not implemented yet - using create instead');
        await jobService.create(jobData as any);
      }

      navigate('/interviewer/jobs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Back nav */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/interviewer/jobs')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Jobs
            </button>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              {isNew ? 'Create New Job Posting' : 'Edit Job Posting'}
            </h1>
            <p className="text-gray-400 mb-6">
              {isNew
                ? 'Fill in the details below to create a new job posting'
                : 'Update the job details below'}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="e.g., Acme Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors min-h-[120px]"
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Requirements (comma-separated)
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="e.g., React, TypeScript, Node.js, 5+ years experience, Bachelor's degree"
                />
                <p className="text-xs text-gray-500 mt-2">
                  These skills will be used to match candidates automatically
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'active')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="draft">Draft (not visible yet)</option>
                  <option value="active">Active (accepting applications)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/interviewer/jobs')}
                  className="flex-1 py-3 px-6 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {isNew ? 'Create Job' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
