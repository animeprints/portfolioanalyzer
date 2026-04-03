// @ts-nocheck
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2 as LinkedinIcon, ArrowRight, Sparkles, CheckCircle, AlertCircle, TrendingUp, Users, Eye, Target } from 'lucide-react';

interface LinkedInAnalysis {
  score: number;
  headline?: string;
  summary?: string;
  experience?: any[];
  skills?: string[];
  recommendations: {
    headline?: string[];
    summary?: string[];
    skills?: string[];
    general?: string[];
  };
  keyword_analysis: {
    important_keywords: string[];
    missing_keywords: string[];
    keyword_density: Record<string, number>;
  };
}

export default function LinkedInPage() {
  const [profile, setProfile] = useState<{
    headline?: string;
    summary?: string;
    experience?: any[];
    skills?: string[];
  }>({
    headline: '',
    summary: '',
    skills: [],
  });
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setAnalysis({
      score: 72,
      headline: profile.headline,
      summary: profile.summary,
      experience: profile.experience,
      skills: profile.skills,
      recommendations: {
        headline: [
          'Add your target role/title at the beginning',
          'Include 2-3 key achievements or specializations',
          'Use industry-relevant keywords',
        ],
        summary: [
          'Start with a compelling hook about your value proposition',
          'Quantify achievements with metrics',
          'Add a clear call-to-action at the end',
        ],
        skills: [
          'Add 5-10 more relevant skills from your industry',
          'Remove outdated or irrelevant skills',
          'Prioritize in-demand skills like React, Node.js, Python',
        ],
        general: [
          'Get 2-3 recommendations from colleagues',
          'Add a professional profile picture',
          'Update your experience with quantifiable results',
        ],
      },
      keyword_analysis: {
        important_keywords: ['React', 'TypeScript', 'Node.js', 'API', 'Agile'],
        missing_keywords: ['AWS', 'Docker', 'GraphQL', 'CI/CD'],
        keyword_density: {
          'React': 3,
          'JavaScript': 5,
          'TypeScript': 2,
          'Node': 1,
        },
      },
    });
    setIsAnalyzing(false);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/30 mb-6">
            <LinkedinIcon className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-mono tracking-wider">LINKEDIN OPTIMIZER</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Optimize LinkedIn</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform your LinkedIn profile to attract recruiters. Get AI-powered recommendations
            for your headline, summary, skills, and keyword optimization.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 border-blue-500/30 space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  Your LinkedIn Profile
                </h2>
                <p className="text-gray-400">
                  Fill in your current profile information to get optimization suggestions.
                </p>
              </div>

              <div className="space-y-6">
                {/* Headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Headline (Current Title + Value)
                  </label>
                  <textarea
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    rows={2}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all outline-none text-white resize-none"
                    placeholder="e.g., Senior Full Stack Engineer | Building Scalable Web Applications | React, Node.js, AWS"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    About / Summary
                  </label>
                  <textarea
                    value={profile.summary}
                    onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                    rows={6}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all outline-none text-white resize-none"
                    placeholder="Write a compelling summary about your experience, achievements, and what you're looking for..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Skills (comma-separated)
                  </label>
                  <textarea
                    value={profile.skills?.join(', ')}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()) })}
                    rows={3}
                    className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all outline-none text-white resize-none"
                    placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, AWS..."
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!profile.headline || !profile.summary || isAnalyzing}
                  className={`w-full py-5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                    isAnalyzing || !profile.headline || !profile.summary
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Get Optimization Tips
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* What we analyze */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 glass-card p-6 border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                What We Analyze
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '🎯', label: 'Keyword Optimization', desc: 'ATS-friendly keywords' },
                  { icon: '📝', label: 'Headline Impact', desc: 'Attention-grabbing titles' },
                  { icon: '✨', label: 'Summary Quality', desc: 'Compelling storytelling' },
                  { icon: '🔗', label: 'Skills Relevance', desc: 'Industry-specific skills' },
                  { icon: '📊', label: 'Completeness', desc: 'Profile completeness score' },
                  { icon: '🏆', label: 'Achievements', desc: 'Quantified results' },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-medium text-white mb-1">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Score */}
                  <div className="glass-card p-8 border-cyan-500/30 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                    <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-2">Profile Strength</div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-6xl font-bold text-cyan-400 font-mono mb-4"
                      >
                        {analysis.score}%
                      </motion.div>
                      {analysis.score >= 80 ? (
                        <div className="px-4 py-2 rounded-full bg-green-900/40 text-green-400 text-sm font-semibold inline-block border border-green-500/30">
                          Excellent
                        </div>
                      ) : analysis.score >= 60 ? (
                        <div className="px-4 py-2 rounded-full bg-yellow-900/40 text-yellow-400 text-sm font-semibold inline-block border border-yellow-500/30">
                          Needs Improvement
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-full bg-red-900/40 text-red-400 text-sm font-semibold inline-block border border-red-500/30">
                          Significant Work Needed
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations cards */}
                  {analysis.recommendations.headline && analysis.recommendations.headline.length > 0 && (
                    <div className="glass-card p-6 border-purple-500/30">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-400">
                        <Target className="w-5 h-5" />
                        Headline Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {analysis.recommendations.headline.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recommendations.summary && analysis.recommendations.summary.length > 0 && (
                    <div className="glass-card p-6 border-pink-500/30">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-400">
                        <Sparkles className="w-5 h-5" />
                        Summary Recommendations
                      </h3>
                      <ul className="space-y-3">
                        {analysis.recommendations.summary.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Keywords */}
                  <div className="glass-card p-6 border-cyan-500/30">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
                      <TrendingUp className="w-5 h-5" />
                      Keyword Analysis
                    </h3>

                    {analysis.keyword_analysis.missing_keywords.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">
                            Missing ({analysis.keyword_analysis.missing_keywords.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyword_analysis.missing_keywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg text-xs bg-red-900/30 border border-red-500/30 text-red-300"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">
                          Present ({analysis.keyword_analysis.important_keywords.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyword_analysis.important_keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-lg text-xs bg-green-900/30 border border-green-500/30 text-green-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* General tips */}
                  {analysis.recommendations.general && analysis.recommendations.general.length > 0 && (
                    <div className="glass-card p-6 border-white/10">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        Next Steps
                      </h3>
                      <ul className="space-y-3">
                        {analysis.recommendations.general.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inspiration */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 glass-card p-6 border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4">💡 Pro Tips</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Include 20-30 skills</strong> - The more relevant skills you add, the higher your discoverability.
                </p>
                <p>
                  <strong className="text-white">Use keywords naturally</strong> - Sprinkle them throughout your headline, summary, and experience without cramming.
                </p>
                <p>
                  <strong className="text-white">Update weekly</strong> - LinkedIn's algorithm rewards fresh activity and updated profiles.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
