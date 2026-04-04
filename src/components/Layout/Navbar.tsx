import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, BarChart3, Upload, Target, MessageSquare, ExternalLink as LinkedIn, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const protectedLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analyze', href: '/analyze', icon: Upload },
    { name: 'Job Match', href: '/jobs', icon: Target },
    { name: 'Interview', href: '/interview', icon: MessageSquare },
    { name: 'LinkedIn', href: '/linkedin', icon: LinkedIn },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-heavy border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-glow"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-2xl font-display font-bold text-white tracking-tight">
              Card<span className="text-gold-500">zey</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className={`relative text-sm font-medium transition-all duration-300 ${
                  isActive('/') ? 'text-gold-500' : 'text-silver-400 hover:text-white'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
              <Link
                to="/about"
                className={`relative text-sm font-medium transition-all duration-300 ${
                  isActive('/about') ? 'text-gold-500' : 'text-silver-400 hover:text-white'
                }`}
              >
                About
                {isActive('/about') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
              <Link
                to="/contact"
                className={`relative text-sm font-medium transition-all duration-300 ${
                  isActive('/contact') ? 'text-gold-500' : 'text-silver-400 hover:text-white'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </div>

            {/* Protected nav items - show when logged in */}
            {isAuthenticated && (
              <div className="flex items-center gap-6">
                {protectedLinks.slice(0, 3).map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                        isActive(link.href) ? 'text-gold-500' : 'text-silver-400 hover:text-white'
                      }`}
                      title={link.name}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop CTA or User Menu */}
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4"
              >
                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-silver-400 capitalize">{user?.role}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-surface border border-white/10 text-silver-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-silver-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-medium shadow-glow hover:shadow-glow-strong transition-all"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2.5 text-silver-400 hover:text-white transition-colors rounded-xl bg-surface/50 border border-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-heavy border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-3">
              {/* Public links */}
              <Link
                to="/"
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive('/')
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-silver-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive('/about')
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-silver-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive('/contact')
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-silver-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Divider */}
              <div className="border-t border-white/10 my-4" />

              {/* Auth or protected pages */}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-white mb-1">{user?.name}</p>
                    <p className="text-xs text-silver-400 capitalize">{user?.role}</p>
                  </div>
                  {protectedLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                          isActive(link.href)
                            ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                            : 'text-silver-300 hover:bg-white/5 hover:text-white'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-3 rounded-xl text-silver-300 hover:bg-white/5 hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center font-medium shadow-glow transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
