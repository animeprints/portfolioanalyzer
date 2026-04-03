import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await register(email, password, name, role);
      navigate('/analyze');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Instant CV analysis',
    'Skill extraction',
    'ATS compatibility check',
    'Job matching',
    'LinkedIn optimization',
    'Interview preparation',
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 py-12">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-900/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border border-cyan-500/30">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-mono text-sm">THE FUTURE OF CV ANALYSIS</span>
              </div>

              <h1 className="text-6xl font-bold leading-tight">
                <span className="gradient-text">Unlock</span>{' '}
                <span className="text-white">Your True</span>{' '}
                <span className="gradient-text">Potential</span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed">
                Join thousands of professionals using AI to transform their careers.
                Get detailed CV insights, personalized recommendations, and land your dream job.
              </p>

              <div className="space-y-4">
                <h3 className="text-cyan-400 font-semibold">What you get:</h3>
                {features.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center gap-8 text-gray-400 text-sm">
                  <div>
                    <div className="text-3xl font-bold text-white">50K+</div>
                    <div>Analyses completed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">96%</div>
                    <div>Satisfaction rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">4.9/5</div>
                    <div>Average rating</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card p-8 md:p-10 border-cyan-500/30">
              <div className="text-center mb-8 lg:hidden">
                <h2 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">Create Account</span>
                </h2>
                <p className="text-gray-400">Start your journey to a better career</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-6 py-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white"
                      placeholder="John Doe"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-6 py-4 pl-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white placeholder-gray-500"
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-6 py-4 pl-12 pr-12 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('candidate')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'candidate'
                          ? 'bg-cyan-900/30 border-cyan-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold mb-1">Analyze CVs</div>
                      <div className="text-xs opacity-70">As a job seeker</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('interviewer')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'interviewer'
                          ? 'bg-purple-900/30 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold mb-1">Hire Talent</div>
                      <div className="text-xs opacity-70">As a recruiter</div>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-sm text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full py-5 rounded-xl font-semibold text-white transition-all duration-300
                    ${isLoading
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/30 transform hover:scale-[1.02]'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
