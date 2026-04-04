import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, BarChart3, FileText, Users, Shield, Zap, CheckCircle, ArrowRight, Star, Award, Sparkles, Target } from 'lucide-react';
import ParticleBackground from '../components/3D/ParticleBackground';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced neural networks parse your CV, extracting skills, experience, and potential with uncanny accuracy.',
    },
    {
      icon: BarChart3,
      title: 'Multi-Dimensional Scoring',
      description: 'Comprehensive metrics: ATS compatibility, readability, impact, and completeness—all benchmarked against industry standards.',
    },
    {
      icon: Award,
      title: 'Skill Intelligence',
      description: 'Automated categorization and proficiency mapping across technical, soft, business, and tool-specific competencies.',
    },
    {
      icon: Target,
      title: 'Precision Job Matching',
      description: 'Sophisticated algorithms compare your profile against thousands of positions, identifying perfect-fit opportunities.',
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Client-side processing means your data never leaves your device unless you choose cloud storage.',
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      description: 'Sub-second analysis delivers immediate feedback, transforming your career preparation workflow.',
    },
  ];

  const stats = [
    { value: '98.7%', label: 'Accuracy Rate', accent: 'gold' },
    { value: '50K+', label: 'CVs Analyzed', accent: 'violet' },
    { value: '4.9/5', label: 'User Rating', accent: 'gold' },
    { value: '<3s', label: 'Analysis Time', accent: 'violet' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer at Google',
      content: 'The skill extraction identified nuances I\'d missed. After optimizing based on Cardzey\'s insights, my interview conversion rate jumped 40%.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Lead at Stripe',
      content: 'The job matching algorithm is terrifyingly accurate. It found positions I hadn\'t even considered but were perfect fits.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Science Manager at Netflix',
      content: 'Finally, an AI that understands modern tech resumes. The quantifiable impact recommendations alone are worth the price of admission.',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <ParticleBackground count={1200} color="#d4a574" size={0.022} speed={0.6} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-8">
                <Sparkles className="w-4 h-4" />
                AI-Powered Career Intelligence
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={itemVariants}
                className="text-display md:text-hero font-display font-bold text-white mb-8 leading-tight"
              >
                Transform Your CV into
                <span className="block text-gold-gradient mt-2"> a Masterpiece</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-silver-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
              >
                Unlock the full potential of your career narrative with surgical precision.
                Our AI analyzes, scores, and optimizes your resume to open doors you didn't know existed.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/analyze"
                    className="btn-gold inline-flex items-center gap-3 text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start Free Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-surface/70 hover:border-gold-500/30 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/30 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className={`text-4xl md:text-5xl font-display font-bold mb-2 ${
                    stat.accent === 'gold' ? 'text-gold-400' : 'text-violet-400'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-silver-400 text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-section font-display font-bold text-white mb-6">
                Precision Tools for
                <span className="text-gold-gradient"> Career Mastery</span>
              </h2>
              <p className="text-xl text-silver-400 max-w-3xl mx-auto leading-relaxed">
                Every feature engineered to elevate your professional narrative and accelerate your career trajectory.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="card-glass p-8 group hover:border-gold-500/20"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
                      <Icon className="w-7 h-7 text-gold-400 group-hover:text-gold-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-silver-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-surface/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <h2 className="text-section font-display font-bold text-white mb-6">
                The Science of <span className="text-violet-gradient">Success</span>
              </h2>
              <p className="text-xl text-silver-400">
                Three steps to career transformation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

              {[
                {
                  step: '01',
                  title: 'Upload',
                  desc: 'Select your CV in PDF, DOCX, or TXT. Our quantum-grade parser ingests every detail with millimeter precision.',
                  icon: Upload,
                },
                {
                  step: '02',
                  title: 'Analyze',
                  desc: 'Neural networks dissect your narrative, comparing against millions of successful profiles and industry benchmarks.',
                  icon: BarChart3,
                },
                {
                  step: '03',
                  title: 'Elevate',
                  desc: 'Receive surgical recommendations. Implement changes. Watch your interview rate multiply.',
                  icon: Award,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  className="text-center relative"
                >
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow">
                    <item.icon className="w-14 h-14 text-gold-400" />
                  </div>
                  <div className="text-6xl font-display font-bold text-gold-500/20 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-silver-400 leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-section font-display font-bold text-white mb-4">
                Voices of <span className="text-gold-gradient">Transformation</span>
              </h2>
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-xl text-silver-400">
                Stories from those who've redefined their career trajectory
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  className="card-glass p-8 flex flex-col h-full"
                >
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <p className="text-silver-300 mb-8 leading-relaxed flex-grow italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-white/5 pt-6">
                    <p className="font-display font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-silver-400">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-violet-500/5 to-gold-500/10" />
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                Your Dream Job
                <span className="block text-gold-gradient mt-2">Doesn't Apply Itself</span>
              </h2>
              <p className="text-xl text-silver-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                The most successful candidates aren't the most qualified—they're the best presented.
                Let AI amplify your narrative.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/analyze"
                  className="btn-gold inline-flex items-center gap-3 text-xl px-12 py-5"
                >
                  <Sparkles className="w-6 h-6" />
                  Begin Your Transformation
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
              <p className="mt-6 text-sm text-silver-500">
                No credit card required. First analysis free forever.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                <Link to="/" className="flex items-center gap-3 justify-center md:justify-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-display font-bold text-white tracking-tight">
                    Card<span className="text-gold-500">zey</span>
                  </span>
                </Link>
                <p className="text-silver-400 max-w-md">
                  AI-powered career intelligence for those who demand excellence.
                  Built with surgical precision in San Francisco.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-8">
                {['Home', 'About', 'Work', 'Contact'].map((link) => (
                  <Link
                    key={link}
                    to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-silver-400 hover:text-gold-400 transition-colors text-sm font-medium"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-silver-600">
              <p>© {new Date().getFullYear()} Cardzey. Crafted with precision.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
