// @ts-nocheck
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, Briefcase, FileText, Eye, Calendar, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { jobsAPI, candidatesAPI } from '../services';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  created_at: string;
  applications_count: number;
}

interface Candidate {
  id: string;
  user: {
    name: string;
    email: string;
  };
  analysis?: AnalysisResult;
  match_score?: number;
  applied_at: string;
}

export default function InterviewerPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: [] as string[],
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (activeTab === 'candidates') {
      fetchCandidates();
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.list();
      setJobs(response.data.jobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const params: any = {};
      if (searchQuery && searchQuery.length > 2) {
        params.keywords = [searchQuery];
      }
      if (selectedJob !== 'all') {
        params.jobId = selectedJob;
      }
      const response = await candidatesAPI.search(params);
      setCandidates(response.data.candidates);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    }
  };

  const handleCreateJob = async () => {
    try {
      await jobsAPI.create(newJob);
      setShowCreateJob(false);
      setNewJob({ title: '', description: '', requirements: [], skills: [] });
      fetchJobs();
    } catch (err) {
      alert('Failed to create job');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'jobs', label: 'Job Postings', icon: Briefcase },
    { id: 'candidates', label: 'Candidate Search', icon: Users },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-2">
            <span className="gradient-text">Interviewer Portal</span>
          </h1>
          <p className="text-gray-400">
            Manage job postings, search candidates, and review applications.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 border border-white/20 text-gray-300 hover:border-purple-400/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}

          {activeTab === 'jobs' && (
            <button
              onClick={() => setShowCreateJob(true)}
              className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          )}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {jobs.length === 0 && !showCreateJob ? (
              <div className="glass-card p-16 text-center border-white/10">
                <Briefcase className="w-16 h-16 mx-auto mb-6 text-gray-500" />
                <h3 className="text-2xl font-bold mb-3">No job postings yet</h3>
                <p className="text-gray-400 mb-6">Create your first job posting to start receiving applications.</p>
                <button
                  onClick={() => setShowCreateJob(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold text-white hover:shadow-lg"
                >
                  Create Job Posting
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="glass-card p-6 border-white/10 group hover:border-purple-400/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-md text-xs bg-purple-900/30 border border-purple-500/30 text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-3 py-1 rounded-md text-xs bg-white/10 border border-white/20 text-gray-400">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applications_count || 0} applicants
                        </div>
                      </div>
                      <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Job Modal */}
            <AnimatePresence>
              {showCreateJob && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                  onClick={() => setShowCreateJob(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card w-full max-w-2xl p-8 border-purple-500/30 max-h-[90vh] overflow-y-auto"
                  >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Plus className="w-6 h-6 text-purple-400" />
                      Create Job Posting
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                        <input
                          type="text"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 transition-all outline-none text-white"
                          placeholder="e.g., Senior Full Stack Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                          rows={4}
                          className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 transition-all outline-none text-white resize-none"
                          placeholder="Describe the role, responsibilities, and what the candidate will do..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma-separated)</label>
                        <div className="flex gap-3 mb-3">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 transition-all outline-none text-white"
                            placeholder="React, Node.js, TypeScript..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newSkill) {
                                setNewJob({ ...newJob, skills: [...newJob.skills, newSkill.trim()] });
                                setNewSkill('');
                              }
                            }}
                            className="px-6 py-3 bg-purple-500 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newJob.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-500/30 text-purple-300"
                            >
                              {skill}
                              <button type="button" onClick={() => setNewJob({ ...newJob, skills: newJob.skills.filter((_, idx) => idx !== i) })}>
                                <XCircle className="w-4 h-4" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button
                          onClick={handleCreateJob}
                          disabled={!newJob.title || newJob.skills.length === 0}
                          className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                            !newJob.title || newJob.skills.length === 0
                              ? 'bg-gray-700 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg'
                          }`}
                        >
                          Create Job
                        </button>
                        <button
                          onClick={() => setShowCreateJob(false)}
                          className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:bg-white/20 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Search & Filter */}
            <div className="glass-card p-6 mb-8 border-white/10 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by skills, keywords..."
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all outline-none text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 transition-all outline-none text-white"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results */}
            {candidates.length === 0 ? (
              <div className="glass-card p-16 text-center border-white/10">
                <Users className="w-16 h-16 mx-auto mb-6 text-gray-500" />
                <h3 className="text-2xl font-bold mb-3">No candidates found</h3>
                <p className="text-gray-400">Try adjusting your search criteria or job filter.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6 border-white/10 hover:border-purple-400/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{candidate.user.name}</h3>
                            <p className="text-gray-400">{candidate.user.email}</p>
                          </div>
                          {candidate.match_score && (
                            <div className={`text-3xl font-bold font-mono ${getScoreColor(candidate.match_score)}`}>
                              {candidate.match_score}%
                            </div>
                          )}
                        </div>

                        {candidate.analysis && (
                          <div className="mt-4 grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">ATS</p>
                              <p className="text-lg font-mono text-green-400">{candidate.analysis.ats_score}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Reading</p>
                              <p className="text-lg font-mono text-cyan-400">{candidate.analysis.readability_score}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Impact</p>
                              <p className="text-lg font-mono text-purple-400">{candidate.analysis.impact_score}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Complete</p>
                              <p className="text-lg font-mono text-pink-400">{candidate.analysis.completeness_score}%</p>
                            </div>
                          </div>
                        )}

                        {/* Top skills */}
                        {candidate.analysis && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {candidate.analysis.extracted_skills.technical.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 rounded-full text-xs bg-cyan-900/30 border border-cyan-500/30 text-cyan-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 text-sm">
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                        <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium hover:shadow-lg transition-all">
                          Contact
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Applied {new Date(candidate.applied_at).toLocaleDateString()}
                      </div>
                      {candidate.match_score && (
                        <div className={`font-medium ${getScoreColor(candidate.match_score)}`}>
                          {candidate.match_score >= 80 ? 'Strong Match' : candidate.match_score >= 60 ? 'Good Match' : 'Low Match'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-16 text-center border-white/10">
              <FileText className="w-16 h-16 mx-auto mb-6 text-gray-500" />
              <h3 className="text-2xl font-bold mb-3">Applications Management</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Review applications, schedule interviews, and manage your hiring pipeline.
                This feature is coming soon with full interview scheduling capabilities.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
