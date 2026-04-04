import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, BarChart3, Upload, Target, MessageSquare, ExternalLink as LinkedIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-slate-100">
              Card<span className="text-primary">zey</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className={`relative text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
              <Link
                to="/about"
                className={`relative text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                About
                {isActive('/about') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
              <Link
                to="/contact"
                className={`relative text-sm font-medium transition-colors ${
                  isActive('/contact') ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </div>

            {/* Protected nav items - show when logged in */}
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                {protectedLinks.slice(0, 3).map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive(link.href) ? 'text-primary' : 'text-slate-300 hover:text-primary'
                      }`}
                      title={link.name}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
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
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-slate-700 bg-slate-900/95"
            >
              <div className="flex flex-col gap-2">
                {/* Public links */}
                <Link
                  to="/"
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive('/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive('/about')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    isActive('/contact')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Divider */}
                <div className="border-t border-slate-200 my-2" />

                {/* Auth or protected pages */}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-100 mb-1">{user?.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                    </div>
                    {protectedLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                            isActive(link.href)
                              ? 'bg-primary/10 text-primary'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-primary'
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
                      className="mt-4 w-full px-4 py-3 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 rounded-lg bg-primary text-white text-center font-medium hover:bg-primary/90 transition-colors"
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
      </div>
    </nav>
  );
}
