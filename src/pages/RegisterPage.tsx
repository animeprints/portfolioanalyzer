import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
    'Instant CV analysis',
    'Skill extraction',
    'ATS compatibility check',
    'Job matching',
    'LinkedIn optimization',
    'Interview preparation',
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <h1 className="text-4xl font-bold text-slate-100 mb-6">
              Join Thousands Advancing Their Careers
            </h1>
            <p className="text-xl text-slate-400 mb-8">
              Create your account and get instant access to AI-powered CV analysis, job matching, and personalized recommendations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700">
              <div className="text-center mb-8 lg:hidden">
                <h1 className="text-2xl font-bold text-slate-100 mb-2">Create Account</h1>
                <p className="text-slate-400">Start your career journey today</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-slate-900/50 text-slate-100 placeholder-slate-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-slate-900/50 text-slate-100 placeholder-slate-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-4 py-3 border border-slate-600 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-slate-900/50 text-slate-100 placeholder-slate-500"
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('candidate')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        role === 'candidate'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('interviewer')}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        role === 'interviewer'
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      Interviewer
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Creating account...'
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
