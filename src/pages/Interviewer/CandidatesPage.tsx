import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, User, Mail, BarChart3, Eye } from 'lucide-react';
import { candidateService, CandidateResult, CandidateSearchFilters } from '../../services/candidateService';
import { Skill } from '../../store/useStore';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function CandidatesPage() {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    skills: '',
    minExperience: '',
    keywords: ''
  });

  useEffect(() => {
    if (initialJobId) {
      // Auto-search with jobId if provided
      searchCandidates();
    }
  }, [initialJobId]);

  const searchCandidates = async () => {
    setLoading(true);
    try {
      const queryParams: CandidateSearchFilters = {};
      if (filters.skills) queryParams.skills = filters.skills.split(',').map(s => s.trim());
      if (filters.minExperience) queryParams.min_experience = parseInt(filters.minExperience);
      if (filters.keywords) queryParams.keywords = filters.keywords.split(',').map(k => k.trim());

      const result = await candidateService.search(queryParams);
      setCandidates(result.candidates);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCandidates();
  };

  const clearFilters = () => {
    setFilters({ skills: '', minExperience: '', keywords: '' });
    setCandidates([]);
  };

  return (
    <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
      <div className="min-h-screen pt-8 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Candidate Search</h1>
            <p className="text-gray-400">
              Find and filter candidates based on job requirements
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g., Python, Machine Learning, SQL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Years of Experience
                  </label>
                  <input
                    type="number"
                    name="minExperience"
                    value={filters.minExperience}
                    onChange={handleFilterChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g., 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Keywords (any field)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={filters.keywords}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="e.g., project manager, agile"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Searching...' : 'Search Candidates'}
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                {loading ? 'Searching...' : `${candidates.length} candidate(s) found`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Finding candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No candidates found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => setCandidates([])}
                  className="px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  Clear Results
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar placeholder */}
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {(candidate.analysis.personalInfo.name || '?').charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white truncate">
                            {candidate.analysis.personalInfo.name || 'Unknown Candidate'}
                          </h3>
                          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                            {candidate.analysis.experience.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                          {candidate.analysis.personalInfo.email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-4 h-4" />
                              {candidate.analysis.personalInfo.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {candidate.analysis.experience.years} years experience
                          </span>
                        </div>

                        {/* Skills Preview */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidate.analysis.skills.slice(0, 5).map((skill: Skill) => (
                            <span
                              key={skill.name}
                              className="px-2 py-1 bg-white/5 border border-cyan-400/30 rounded text-xs text-cyan-300"
                            >
                              {skill.name}
                            </span>
                          ))}
                          {candidate.analysis.skills.length > 5 && (
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                              +{candidate.analysis.skills.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Overall Score */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <BarChart3 className="w-4 h-4 text-cyan-400 mr-1" />
                            <span className="text-white font-semibold">
                              {candidate.analysis.scores.overall}%
                            </span>
                          </div>
                          <span className="text-gray-500">Overall Score</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => window.open(`/shared/${candidate.id}`, '_blank')}
                          className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                          title="View full analysis"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// candidateService is imported from services/candidateService
