import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { interviewService, InterviewQuestion } from '../services/interviewService';
import {
  MessageSquare,
  Loader2,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import NeonButton from '../components/UI/NeonButton';

export default function InterviewPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    role: '',
    difficulty: '',
    limit: 20
  });

  // Filter options from loaded questions
  const industries = ['all', ...new Set(questions.map(q => q.industry))];
  const roles = ['all', ...new Set(questions.map(q => q.role).filter(Boolean))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  useEffect(() => {
    loadQuestions();
    loadHistory();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const params: any = { limit: filters.limit };
      if (filters.industry && filters.industry !== 'all') params.industry = filters.industry;
      if (filters.role && filters.role !== 'all') params.role = filters.role;
      if (filters.difficulty && filters.difficulty !== 'all') params.difficulty = filters.difficulty;

      const result = await interviewService.getQuestions(params);
      setQuestions(result.questions);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const result = await interviewService.getPracticeHistory();
      setHistory(result.history);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const applyFilter = () => {
    loadQuestions();
  };

  const resetFilters = () => {
    setFilters({ industry: '', role: '', difficulty: '', limit: 20 });
    setTimeout(loadQuestions, 0);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Interview Prep</h1>
              <p className="text-gray-400">Practice with common interview questions</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                className="input-field"
              >
                <option value="">All</option>
                {industries.filter(i => i !== 'all').map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="input-field"
              >
                <option value="">All</option>
                {roles.filter(r => r && r !== 'all').map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="input-field"
              >
                {difficulties.map(d => (
                  <option key={d} value={d === 'all' ? '' : d}>{d === 'all' ? 'All' : d}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilter}
                className="flex-1 px-4 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
                title="Reset"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              {questions.length} Questions
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No questions found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300">
                        {q.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-xs bg-white/10 text-gray-400 capitalize">
                          {q.difficulty}
                        </span>
                        {q.role && (
                          <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                            {q.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-4">{q.question}</h3>
                    {q.tips && q.tips.length > 0 && (
                      <details className="group">
                        <summary className="list-none flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">Show tips</span>
                          <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <ul className="mt-3 space-y-1 ml-6">
                          {q.tips.map((tip, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-cyan-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Practice History */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Recent Practice</h3>
              </div>
              {history.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No practice sessions yet. Start practicing to see your history.
                </p>
              ) : (
                <div className="space-y-4">
                  {history.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 rounded-lg bg-white/5">
                      <p className="text-white text-sm font-medium mb-1 line-clamp-2">{record.question}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="capitalize">{record.difficulty}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        {record.self_rating && (
                          <span className="text-yellow-400">★ {record.self_rating}/5</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-white/10">
                <NeonButton
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {/* Could open a practice modal */}}
                >
                  Start Practice Session
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
