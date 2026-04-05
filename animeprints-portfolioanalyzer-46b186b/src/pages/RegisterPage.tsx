import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, CheckCircle, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, name, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Unlimited CV analysis',
    'Advanced skill intelligence',
    'ATS compatibility scoring',
    'Precision job matching',
    'LinkedIn profile optimizer',
    'Interview preparation suite',
    'Cloud sync & history',
    'Priority support',
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient-alt opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                Card<span className="text-gold-500">zey</span>
              </span>
            </div>

            <h1 className="text-5xl font-display font-bold text-white mb-8 leading-tight">
              Unlock Your
              <span className="block text-gold-gradient mt-2">Career Potential</span>
            </h1>

            <p className="text-xl text-silver-400 mb-12 leading-relaxed">
              Join thousands of ambitious professionals who've transformed their career trajectory with AI-powered intelligence.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-silver-300 text-sm font-medium leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="card-glass p-10 md:p-12">
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-display font-bold text-white">
                    Card<span className="text-gold-500">zey</span>
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Create Your Account
                </h2>
                <p className="text-silver-400">Start your career transformation</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-silver-300 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-500" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="input-field pl-12"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-silver-300 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="input-field pl-12"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-silver-300 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-500" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="input-field pl-12 pr-12"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-500 hover:text-gold-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-silver-600">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-silver-300 mb-3">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setRole('candidate')}
                      whileTap={{ scale: 0.98 }}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        role === 'candidate'
                          ? 'border-gold-500/50 bg-gold-500/10 text-white'
                          : 'border-white/10 text-silver-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <User className={`w-8 h-8 mx-auto mb-2 ${role === 'candidate' ? 'text-gold-400' : 'text-silver-500'}`} />
                        <div className="font-semibold">Job Seeker</div>
                        <div className="text-xs opacity-60 mt-1">Analyze CV, find jobs</div>
                      </div>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setRole('interviewer')}
                      whileTap={{ scale: 0.98 }}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        role === 'interviewer'
                          ? 'border-gold-500/50 bg-gold-500/10 text-white'
                          : 'border-white/10 text-silver-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <Crown className={`w-8 h-8 mx-auto mb-2 ${role === 'interviewer' ? 'text-gold-400' : 'text-silver-500'}`} />
                        <div className="font-semibold">Interviewer</div>
                        <div className="text-xs opacity-60 mt-1">Post jobs, search</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-gold flex items-center justify-center gap-2 text-lg mt-8"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-10 text-center border-t border-white/5 pt-8">
                <p className="text-silver-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom link */}
        <div className="mt-10 text-center">
          <Link
            to="/"
            className="text-silver-600 hover:text-silver-400 text-sm transition-colors inline-flex items-center gap-2"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
