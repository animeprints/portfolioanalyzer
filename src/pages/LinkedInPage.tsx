import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2 as LinkedinIcon,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Award,
  Star,
  BarChart3,
  MessageSquare,
  Zap,
  ArrowRight,
  Edit3,
  Eye,
  Percent,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface LinkedInAnalysis {
  score: number;
  headline?: string;
  summary?: string;
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

// Score gauge component
function ScoreGauge({ score, size = 'large' }: { score: number; size?: 'large' | 'small' }) {
  const radius = size === 'large' ? 70 : 45;
  const strokeWidth = size === 'large' ? 8 : 6;
  const fontSize = size === 'large' ? 'text-4xl' : 'text-2xl';

  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="relative" style={{ width: radius * 2 + strokeWidth, height: radius * 2 + strokeWidth }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className={`${fontSize} font-mono font-bold text-white`}
        >
          {score}%
        </motion.div>
      </div>
    </div>
  );
}

// Input field component with character count
function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  icon: Icon,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  icon: any;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
        <Icon className="w-4 h-4 text-blue-400" />
        {label}
        <span className="text-gray-500">({value.length}/{maxLength})</span>
      </label>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 outline-none resize-none text-white placeholder-gray-600"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 outline-none text-white placeholder-gray-600"
        />
      )}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mt-0 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: isFocused ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Skill tag with copy functionality
function SkillTag({ skill, onRemove, index }: { skill: string; onRemove: () => void; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(skill);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 group"
    >
      <span>{skill}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-400"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400">
          <AlertCircle className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// Keyword badge
function KeywordBadge({ keyword, missing, density }: { keyword: string; missing: boolean; density: number }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
        missing
          ? 'bg-red-500/10 border border-red-500/30 text-red-300'
          : 'bg-green-500/10 border border-green-500/30 text-green-300'
      }`}
    >
      {missing ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      <span className="font-medium">{keyword}</span>
      <span className="text-xs opacity-60">{density}x</span>
    </div>
  );
}

// Recommendation card
function RecommendationCard({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string;
  items: string[];
  icon: any;
  color: 'gold' | 'blue' | 'cyan' | 'violet';
}) {
  const colors = {
    gold: 'from-gold-500/20 to-amber-600/20 border-gold-500/20 text-gold-400',
    blue: 'from-blue-500/20 to-cyan-600/20 border-blue-500/20 text-blue-400',
    cyan: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/20 text-cyan-400',
    violet: 'from-violet-500/20 to-purple-600/20 border-violet-500/20 text-violet-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-glass p-6 ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]} border`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color].split(' ')[0]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={`font-semibold ${colors[color].split(' ')[3]}`}>{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${color === 'gold' ? 'from-gold-500 to-amber-600' : color === 'blue' ? 'from-blue-500 to-cyan-600' : color === 'cyan' ? 'from-cyan-500 to-blue-600' : 'from-violet-500 to-purple-600'} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5`}>
              {i + 1}
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Profile strength indicator
function ProfileStrengthIndicator({ score }: { score: number }) {
  const getLabel = (s: number) => {
    if (s >= 80) return { text: 'Excellent', color: 'text-green-400', bar: 'bg-green-500' };
    if (s >= 60) return { text: 'Good', color: 'text-yellow-400', bar: 'bg-yellow-500' };
    if (s >= 40) return { text: 'Needs Work', color: 'text-orange-400', bar: 'bg-orange-500' };
    return { text: 'Poor', color: 'text-red-400', bar: 'bg-red-500' };
  };

  const status = getLabel(score);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">Profile Strength</span>
        <span className={`font-bold ${status.color}`}>{status.text}</span>
      </div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${status.bar} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['0%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function LinkedInPage() {
  const [profile, setProfile] = useState({
    headline: '',
    summary: '',
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedRec, setCopiedRec] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'input' | 'results'>('input');

  const handleAnalyze = async () => {
    if (!profile.headline.trim() || !profile.summary.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setActiveSection('results');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock analysis based on inputs
    const hasTechSkills = profile.skills.some(s => ['React', 'Node', 'JavaScript', 'Python'].some(t => s.toLowerCase().includes(t.toLowerCase())));
    const hasLeadership = profile.headline.toLowerCase().includes('lead') || profile.headline.toLowerCase().includes('manager');
    const hasResults = /\d+%|[\d]+[kK]|[\d]+[mM]/.test(profile.summary);

    const baseScore = 60 + Math.random() * 30;
    const score = Math.min(
      100,
      baseScore +
        (hasTechSkills ? 10 : 0) +
        (hasLeadership ? 8 : 0) +
        (hasResults ? 7 : 0) +
        (profile.skills.length >= 10 ? 5 : 0)
    );

    setAnalysis({
      score: Math.round(score),
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills,
      recommendations: {
        headline: [
          'Add your target role/title at the beginning for clarity',
          'Include 2-3 key achievements or specializations',
          'Use numbers and metrics to quantify impact',
          'Incorporate industry-relevant keywords naturally',
          'Keep it under 220 characters for full visibility',
        ],
        summary: [
          'Start with a compelling value proposition hook',
          'Quantify achievements with specific metrics (%, $, #)',
          'Add a clear call-to-action at the end',
          'Use first-person narrative for authenticity',
          'Include relevant keywords for searchability',
        ],
        skills: [
          profile.skills.length < 10
            ? `Add ${10 - profile.skills.length}+ more relevant skills from your industry`
            : 'Consider organizing skills by proficiency level',
          'Remove any outdated or irrelevant technologies',
          'Prioritize in-demand skills for your target role',
          'Include both technical and soft skills',
          'Add 2-3 niche skills to stand out',
        ],
        general: [
          'Get 2-3 recommendations from colleagues and clients',
          'Add a professional, high-quality profile picture',
          'Update experience with quantifiable results',
          'Enable the "Open to Work" badge if seeking opportunities',
          'Post content regularly to increase visibility',
        ],
      },
      keyword_analysis: {
        important_keywords: [
          'React', 'TypeScript', 'Node.js', 'JavaScript', 'API',
          'Agile', 'Team Leadership', 'Cloud', 'DevOps', 'UI/UX'
        ].filter(k => profile.headline.toLowerCase().includes(k.toLowerCase()) || profile.summary.toLowerCase().includes(k.toLowerCase())),
        missing_keywords: [
          'Scalable Architecture', 'Microservices', 'CI/CD',
          'Performance Optimization', 'Technical Leadership', 'Mentoring'
        ].filter(k => !profile.headline.toLowerCase().includes(k.toLowerCase()) && !profile.summary.toLowerCase().includes(k.toLowerCase())),
        keyword_density: {
          'React': Math.max(0, (profile.summary.match(/react/gi)?.length || 0) + (profile.headline.match(/react/gi)?.length || 0)),
          'JavaScript': Math.max(0, (profile.summary.match(/javascript/gi)?.length || 0) + (profile.headline.match(/javascript/gi)?.length || 0)),
          'TypeScript': Math.max(0, (profile.summary.match(/typescript/gi)?.length || 0) + (profile.headline.match(/typescript/gi)?.length || 0)),
          'Node': Math.max(0, (profile.summary.match(/node/gi)?.length || 0) + (profile.headline.match(/node/gi)?.length || 0)),
          'API': Math.max(0, (profile.summary.match(/api/gi)?.length || 0) + (profile.headline.match(/api/gi)?.length || 0)),
        },
      },
    });
    setIsAnalyzing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const copyRecommendation = async (index: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedRec(index);
    setTimeout(() => setCopiedRec(null), 2000);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { text: 'Profile All-Star', color: 'text-green-400', badge: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (score >= 60) return { text: 'Strong Profile', color: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (score >= 40) return { text: 'Needs Improvement', color: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { text: 'Profile Incomplete', color: 'text-red-400', badge: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const scoreLabel = analysis ? getScoreLabel(analysis.score) : null;

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(212,165,116,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/30 mb-6">
            <LinkedinIcon className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-mono tracking-wider">LINKEDIN OPTIMIZER</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
            <span className="block text-white">Optimize Your</span>
            <span className="block bg-gradient-to-r from-blue-500 via-cyan-500 to-gold-500 bg-clip-text text-transparent">
              LinkedIn Profile
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transform your LinkedIn profile to attract recruiters and opportunities.
            Get AI-powered optimization tips for every section.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel - Input form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-glass p-8 border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                  <p className="text-gray-400 text-sm">Enter your current LinkedIn profile information</p>
                </div>
              </div>

              <div className="space-y-6">
                <ProfileInput
                  label="Headline"
                  value={profile.headline}
                  onChange={(v) => setProfile({ ...profile, headline: v })}
                  placeholder="e.g., Senior Full Stack Engineer | Building Scalable Web Apps | React, Node.js, AWS"
                  maxLength={220}
                  icon={Star}
                  rows={1}
                />

                <ProfileInput
                  label="About / Summary"
                  value={profile.summary}
                  onChange={(v) => setProfile({ ...profile, summary: v })}
                  placeholder="Write a compelling summary about your experience, achievements, and goals..."
                  maxLength={2000}
                  icon={MessageSquare}
                  rows={6}
                />

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Skills
                    <span className="text-gray-500">({profile.skills.length} added)</span>
                  </label>
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-5 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none text-white"
                      placeholder="Add skill (press Enter)..."
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addSkill}
                      className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <SkillTag
                        key={skill}
                        skill={skill}
                        index={index}
                        onRemove={() => removeSkill(skill)}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={handleAnalyze}
                  disabled={!profile.headline.trim() || !profile.summary.trim() || isAnalyzing}
                  whileHover={{ scale: isAnalyzing || !profile.headline.trim() || !profile.summary.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: isAnalyzing || !profile.headline.trim() || !profile.summary.trim() ? 1 : 0.98 }}
                  className={`w-full py-5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                    isAnalyzing || !profile.headline.trim() || !profile.summary.trim()
                      ? 'bg-gray-800 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing Profile...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Get Optimization Tips</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* What we analyze */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-glass p-8 border-white/10"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-cyan-400">
                <Eye className="w-6 h-6" />
                What We Analyze
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Target, label: 'Keyword Optimization', desc: 'ATS-friendly keywords and phrases', color: 'blue' as const },
                  { icon: Star, label: 'Headline Impact', desc: 'Attention-grabbing first impression', color: 'gold' as const },
                  { icon: MessageSquare, label: 'Summary Quality', desc: 'Compelling storytelling and structure', color: 'cyan' as const },
                  { icon: Zap, label: 'Skills Relevance', desc: 'Industry-specific skill alignment', color: 'violet' as const },
                  { icon: BarChart3, label: 'Profile Completeness', desc: 'All sections filled properly', color: 'green' as const },
                  { icon: TrendingUp, label: 'Keywords Density', desc: 'Optimal keyword placement and frequency', color: 'yellow' as const },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 flex items-center justify-center mb-3`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                    </div>
                    <div className="font-medium text-white mb-1">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right panel - Results */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {/* Initial state */}
              {!analysis && !isAnalyzing && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card-glass p-12 text-center border-white/10"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-900/50 to-cyan-900/50 flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Ready to Optimize</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Fill in your profile details and click analyze to receive personalized optimization recommendations.
                  </p>
                </motion.div>
              )}

              {/* Analyzing state */}
              {isAnalyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card-glass p-12 text-center border-blue-500/30"
                >
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      <motion.path
                        d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
                        fill="none"
                        stroke="url(#analyzeGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0, 100' }}
                        animate={{ strokeDasharray: ['0, 100', '100, 0'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                      <defs>
                        <linearGradient id="analyzeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-400 rounded-full animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Analyzing Profile</h3>
                  <p className="text-gray-400 text-sm">
                    We're reviewing your LinkedIn profile and generating recommendations...
                  </p>
                </motion.div>
              )}

              {/* Results state */}
              {analysis && !isAnalyzing && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 sticky top-32"
                >
                  {/* Score card */}
                  <div className="card-glass p-8 border-cyan-500/30 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                    <div className="relative z-10">
                      <div className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2">
                        <Percent className="w-4 h-4 text-cyan-400" />
                        Profile Score
                      </div>
                      <div className="flex justify-center mb-4">
                        <ScoreGauge score={analysis.score} />
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold inline-block ${scoreLabel?.badge}`}>
                        {scoreLabel?.text}
                      </div>
                    </div>
                  </div>

                  {/* Headline recommendations */}
                  {analysis.recommendations.headline && analysis.recommendations.headline.length > 0 && (
                    <RecommendationCard
                      title="Headline Optimization"
                      items={analysis.recommendations.headline}
                      icon={Star}
                      color="gold"
                    />
                  )}

                  {/* Summary recommendations */}
                  {analysis.recommendations.summary && analysis.recommendations.summary.length > 0 && (
                    <RecommendationCard
                      title="Summary Improvements"
                      items={analysis.recommendations.summary}
                      icon={MessageSquare}
                      color="blue"
                    />
                  )}

                  {/* Keyword analysis */}
                  <div className="card-glass p-6 border-violet-500/30">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-violet-400">
                      <TrendingUp className="w-5 h-5" />
                      Keyword Analysis
                    </h3>

                    {/* Missing keywords */}
                    {analysis.keyword_analysis.missing_keywords.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">
                            Missing Keywords ({analysis.keyword_analysis.missing_keywords.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyword_analysis.missing_keywords.map((kw, i) => (
                            <KeywordBadge key={i} keyword={kw} missing={true} density={0} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Present keywords */}
                    {analysis.keyword_analysis.important_keywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">
                            Detected ({analysis.keyword_analysis.important_keywords.length})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keyword_analysis.important_keywords.map((kw, i) => (
                            <KeywordBadge
                              key={i}
                              keyword={kw}
                              missing={false}
                              density={analysis.keyword_analysis.keyword_density[kw] || 0}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills recommendations */}
                  {analysis.recommendations.skills && analysis.recommendations.skills.length > 0 && (
                    <RecommendationCard
                      title="Skills Section"
                      items={analysis.recommendations.skills}
                      icon={Zap}
                      color="cyan"
                    />
                  )}

                  {/* General recommendations */}
                  {analysis.recommendations.general && analysis.recommendations.general.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="card-glass p-6 border-white/10"
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gold-400">
                        <Award className="w-5 h-5" />
                        Next Steps
                      </h3>
                      <ul className="space-y-3">
                        {analysis.recommendations.general.map((rec, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <button
                              onClick={() => copyRecommendation(i, rec)}
                              className="flex items-center gap-2 group hover:text-white transition-colors"
                            >
                              <span className="w-6 h-6 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="flex-1">{rec}</span>
                              {copiedRec === i ? (
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4"
                  >
                    <button
                      onClick={() => setAnalysis(null)}
                      className="flex-1 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Analyze Again
                    </button>
                    <button className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                      <ArrowRight className="w-5 h-5" />
                      Apply Changes
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 card-glass p-6 border-white/10"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gold-400">
                <Sparkles className="w-5 h-5" />
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Headline length:</strong> LinkedIn truncates headlines after 220 characters. Keep it concise.
                </p>
                <p>
                  <strong className="text-white">Keyword placement:</strong> Include important keywords in your headline, summary, and experience.
                </p>
                <p>
                  <strong className="text-white">Skills order:</strong> Recruiters see your top 3 skills first. Order matters!
                </p>
                <p>
                  <strong className="text-white">Regular updates:</strong> LinkedIn's algorithm favors active profiles with recent updates.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
