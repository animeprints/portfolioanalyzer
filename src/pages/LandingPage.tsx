import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoGrid from '../components/Landing/LogoGrid';
import NeonButton from '../components/UI/NeonButton';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-white">Build Smarter</span>
                <br />
                <span className="gradient-text">Resume Intelligence</span>
              </h1>

              {/* Subhead */}
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Upload your resume and get instant analysis, skills extraction,
                and personalized recommendations to improve your career prospects.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/upload">
                  <NeonButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Launch App
                  </NeonButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose <span className="gradient-text">CV Analyzer?</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered',
                  description: 'Advanced NLP extracts skills, experience, and qualifications with 95%+ accuracy',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Process CVs in under 2 seconds. Optimized for high-volume workloads',
                },
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'SOC 2 compliant. Data encrypted at rest and in transit. GDPR ready',
                },
                {
                  icon: BarChart3,
                  title: 'Rich Insights',
                  description: 'ATS scores, job matching, skill gaps, and personalized recommendations',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 hover:border-cyan-500/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations / Tech Stack */}
        <LogoGrid />

        {/* Free Badge */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 border-cyan-500/30"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Always Free</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                No hidden fees, no trial limits. Get unlimited CV analysis, job matching, and PDF exports — forever.
              </p>
              <Link to="/upload">
                <NeonButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Start Analyzing Now
                </NeonButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CV</span>
                  </div>
                  <span className="text-xl font-semibold text-white">
                    CV<span className="gradient-text">Analyzer</span>
                  </span>
                </Link>
                <p className="text-gray-400 text-sm">
                  The developer-friendly CV analysis platform.
                  Build better hiring tools with AI.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link to="/upload" className="hover:text-white transition-colors">Launch App</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} CV Analyzer. All rights reserved.</p>
              <p className="mt-2">Built with ❤️ for developers worldwide</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
