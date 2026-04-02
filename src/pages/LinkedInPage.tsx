import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { linkedinService } from '../services/linkedinService';
import {
  User as Linkedin,
  Loader2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import NeonButton from '../components/UI/NeonButton';

export default function LinkedInPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>({
    headline: '',
    summary: '',
    experience: [{ description: '', title: '', company: '', duration: '' }],
    skills: [''],
    profile_picture: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await linkedinService.getProfile();
      if (result.profile) {
        const p = result.profile.profile_data;
        const experienceList = p.experience?.length
          ? p.experience.map((exp: any) => ({
              description: exp.description || '',
              title: exp.title || '',
              company: exp.company || '',
              duration: exp.duration || ''
            }))
          : [{ description: '', title: '', company: '', duration: '' }];
        setProfile({
          headline: p.headline || '',
          summary: p.summary || '',
          experience: experienceList,
          skills: p.skills?.length ? p.skills : [''],
          profile_picture: p.profile_picture || ''
        });
        setAnalysis({
          score: result.profile.optimization_score || 0,
          suggestions: result.profile.suggestions || [],
          message: 'Last analyzed: ' + new Date(result.profile.analyzed_at).toLocaleDateString()
        });
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('Failed to load LinkedIn profile:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!profile.headline?.trim()) {
      setError('Please enter a headline');
      return;
    }
    if (!profile.summary?.trim()) {
      setError('Please enter a summary');
      return;
    }
    const skillCount = profile.skills?.filter((s: string) => s?.trim()).length || 0;
    if (skillCount < 10) {
      setError('Please add at least 10 skills');
      return;
    }

    setAnalyzing(true);
    setError(null);
    try {
      const result = await linkedinService.analyze({
        profile_data: {
          headline: profile.headline,
          summary: profile.summary,
          experience: profile.experience?.filter((e: any) => e?.description?.trim()) || [],
          skills: profile.skills?.filter((s: string) => s?.trim()) || [],
          profile_picture: profile.profile_picture
        }
      });
      setAnalysis({
        score: result.score,
        suggestions: result.suggestions,
        message: 'Analysis complete!'
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze profile');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Linkedin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">LinkedIn Optimizer</h1>
              <p className="text-gray-400">Improve your LinkedIn profile visibility</p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 flex items-center gap-2"
          >
            {error}
          </motion.div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Optimization Score</h2>
              <span className="text-sm text-gray-400">{analysis.message}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke={analysis.score >= 80 ? '#10b981' : analysis.score >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 40}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - analysis.score / 100)}` }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}%</span>
                </div>
              </div>
              <div className="flex-1">
                {analysis.suggestions?.length > 0 && (
                  <ul className="space-y-2">
                    {analysis.suggestions.slice(0, 4).map((suggestion: string, idx: number) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Enter Profile Details</h2>

          <div className="space-y-8">
            {/* Headline */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Headline</label>
              <input
                type="text"
                value={profile.headline || ''}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g., Senior Full Stack Developer | React & Node.js Expert"
                className="input-field"
              />
              <p className="text-gray-500 text-xs mt-1">Max 220 characters recommended</p>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">About / Summary</label>
              <textarea
                value={profile.summary || ''}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                rows={4}
                placeholder="Write a compelling summary highlighting your expertise and achievements..."
                className="input-field"
              />
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 font-medium">Experience</label>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, experience: [...(profile.experience || []), { description: '', title: '', company: '', duration: '' }] })}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  + Add Position
                </button>
              </div>
              <div className="space-y-3">
                {(profile.experience || []).map((exp: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...(profile.experience || [])];
                        newExp[idx] = { ...newExp[idx], description: e.target.value };
                        setProfile({ ...profile, experience: newExp });
                      }}
                      rows={2}
                      placeholder="Describe your role, responsibilities, and achievements..."
                      className="input-field flex-1"
                    />
                    {(profile.experience?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, experience: (profile.experience || []).filter((_: any, i: number) => i !== idx) })}
                        className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-300 font-medium">Skills</label>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, skills: [...(profile.skills || []), ''] })}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  + Add Skill
                </button>
              </div>
              <div className="space-y-2">
                {(profile.skills || []).map((skill: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...(profile.skills || [])];
                        newSkills[idx] = e.target.value;
                        setProfile({ ...profile, skills: newSkills });
                      }}
                      placeholder="e.g., React, Project Management"
                      className="input-field flex-1"
                    />
                    {(profile.skills?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, skills: (profile.skills || []).filter((_: any, i: number) => i !== idx) })}
                        className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">Add at least 10 skills for best results</p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => setProfile({ headline: '', summary: '', experience: [{ description: '', title: '', company: '', duration: '' }], skills: [''] })}
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
            >
              Reset
            </button>
            <NeonButton
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              disabled={analyzing}
              icon={analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Profile'}
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
