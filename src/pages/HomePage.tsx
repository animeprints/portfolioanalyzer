import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Upload,
  BarChart3,
  FileText,
  Users,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Sparkles,
  Target,
  Lightbulb,
  Rocket,
  Globe,
} from 'lucide-react';
import ParticleBackground from '../components/3D/ParticleBackground';
import { GradientBackground } from '../components/Effects/GradientBackground';
import { ParallaxLayer } from '../components/Effects/ParallaxLayer';
import { MagneticButton } from '../components/EnhancedUI/MagneticButton';
import { TiltCard } from '../components/EnhancedUI/TiltCard';
import { GradientBorder } from '../components/EnhancedUI/GradientBorder';
import { BentoGrid, BentoCard } from '../components/EnhancedUI/BentoGrid';
import { TextRevealEnhanced } from '../components/EnhancedUI/TextRevealEnhanced';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced neural networks parse your CV, extracting skills, experience, and potential with surgical precision.',
    },
    {
      icon: BarChart3,
      title: 'Multi-Dimensional Scoring',
      description: 'Comprehensive metrics: ATS compatibility, readability, impact, and completeness—benchmarked against industry standards.',
    },
    {
      icon: Award,
      title: 'Skill Intelligence',
      description: 'Automated categorization and proficiency mapping across technical, soft, business, and domain-specific competencies.',
    },
    {
      icon: Target,
      title: 'Precision Job Matching',
      description: 'Sophisticated algorithms compare your profile against thousands of positions, identifying your perfect-fit opportunities.',
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Client-side processing means your data never leaves your device unless you explicitly choose cloud storage.',
    },
    {
      icon: Zap,
      title: 'Real-Time Insights',
      description: 'Sub-second analysis delivers immediate feedback, transforming your career preparation workflow instantly.',
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
      content: 'The job matching algorithm is terrifyingly accurate. It found positions I hadn\'t even considered but were perfect matches.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Science Manager at Netflix',
      content: 'Finally, an AI that understands modern tech resumes. The quantifiable impact recommendations alone are worth the price of admission.',
      rating: 5,
    },
  ];

  const steps = [
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
  ];

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <GradientBackground intensity="intense" animated={true}>
        {/* Enhanced parallax floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxLayer speed={0.2} className="absolute top-40 left-10">
            <div className="w-3 h-3 rounded-full bg-gold-400/50 blur-sm animate-float" style={{ animationDuration: '8s' }} />
          </ParallaxLayer>
          <ParallaxLayer speed={-0.15} className="absolute top-80 right-32">
            <div className="w-4 h-4 rounded-full bg-violet-400/40 blur-sm animate-float-slow" style={{ animationDuration: '12s' }} />
          </ParallaxLayer>
          <ParallaxLayer speed={0.3} className="absolute top-1/3 right-1/4">
            <div className="w-2 h-2 rounded-full bg-cyan-300/60 blur-sm animate-float" style={{ animationDuration: '10s' }} />
          </ParallaxLayer>
          <ParallaxLayer speed={-0.25} className="absolute bottom-1/3 left-1/3">
            <div className="w-5 h-5 rounded-full bg-gold-500/30 blur-md animate-float-slow" style={{ animationDuration: '15s' }} />
          </ParallaxLayer>
          <ParallaxLayer speed={0.35} className="absolute top-1/2 left-1/4">
            <div className="w-2 h-2 rounded-full bg-violet-300/50 animate-pulse-slow" style={{ animationDuration: '4s' }} />
          </ParallaxLayer>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section - More dramatic spacing */}
          <section className="pt-40 pb-32 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
                  },
                  hidden: { opacity: 0 },
                }}
                className="text-center"
              >
                {/* Badge - More glow */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-sm font-bold mb-10 backdrop-blur-md shadow-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  AI-Powered Career Intelligence
                </motion.div>

                {/* Main headline with enhanced text reveal */}
                <TextRevealEnhanced
                  as="h1"
                  className="text-display md:text-hero font-display font-bold text-white mb-8 leading-tight"
                  type="word"
                  staggerDelay={0.04}
                >
                  <span className="block">Transform Your CV into</span>
                  <span className="block mt-4 bg-gradient-to-r from-gold-300 via-amber-200 to-gold-400 bg-clip-text text-transparent animate-gradient-flow bg-300% drop-shadow-[0_0_30px_rgba(233,200,98,0.5)]">
                    a Masterpiece
                  </span>
                </TextRevealEnhanced>

                {/* Subtitle - Higher contrast */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.7 }}
                >
                  <p className="text-xl md:text-2xl text-silver-200 max-w-4xl mx-auto mb-16 leading-relaxed font-light">
                    Unlock the full potential of your career narrative with{' '}
                    <span className="text-white font-semibold">surgical precision</span>.
                    Our AI analyzes, scores, and optimizes your resume to unlock{' '}
                    <span className="text-cyan-300 font-medium">doors you didn't know existed</span>.
                  </p>
                </motion.div>

                {/* CTA Buttons with enhanced magnetic effect */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                >
                  <MagneticButton strength={50}>
                    <Link
                      to="/analyze"
                      className="inline-flex items-center gap-3 text-lg px-12 py-6 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 rounded-xl font-bold text-black shadow-glow-ultra hover:shadow-glow-strong transition-all duration-300 border border-gold-300/50"
                    >
                      <Sparkles className="w-6 h-6" />
                      Start Free Analysis
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </MagneticButton>

                  <MagneticButton strength={40}>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-3 text-lg px-10 py-5 bg-black/60 backdrop-blur-xl border border-white/20 hover:border-gold-500/50 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:bg-black/80"
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section - Ultra contrast */}
          <section className="py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/10 to-transparent" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.7, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.7, type: 'spring' }}
                    className="text-center group"
                  >
                    <div
                      className={`text-5xl md:text-6xl font-display font-bold mb-4 transition-all duration-500 group-hover:scale-110 ${
                        stat.accent === 'gold'
                          ? 'text-gold-gradient drop-shadow-[0_0_30px_rgba(233,200,98,0.6)]'
                          : 'text-violet-gradient drop-shadow-[0_0_30px_rgba(147,51,234,0.6)]'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-silver-300 text-sm font-bold uppercase tracking-[0.2em]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

            {/* Features Grid - Bento Style */}
          <section className="py-32 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                className="text-center mb-24"
              >
                <TextRevealEnhanced
                  as="h2"
                  className="text-section font-display font-bold text-white mb-6"
                  type="word"
                >
                  <span>Precision Tools for</span>
                  <span className="block text-gold-gradient"> Career Mastery</span>
                </TextRevealEnhanced>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-silver-300 max-w-3xl mx-auto leading-relaxed"
                >
                  Every feature engineered to elevate your professional narrative and accelerate your career trajectory.
                </motion.p>
              </motion.div>

              <BentoGrid cols={3} gap="gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const gradients = ['gold', 'violet', 'cyan'] as const;
                  const gradient = gradients[index % gradients.length];
                  return (
                    <BentoCard
                      key={feature.title}
                      colSpan={1}
                      rowSpan={1}
                      gradient={gradient}
                    >
                      <TiltCard maxTilt={12} scale={1.03} glow glowColor="rgba(233,200,98,0.15)">
                        <div className="flex flex-col h-full">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-500/30 to-violet-500/30 flex items-center justify-center mb-6 border border-gold-500/30 group-hover:border-gold-400/50 transition-all duration-500 shadow-glow">
                            <Icon className="w-8 h-8 text-gold-400 group-hover:text-gold-300 transition-colors duration-300" />
                          </div>
                          <h3 className="text-xl font-display font-bold text-white mb-4">
                            {feature.title}
                          </h3>
                          <p className="text-silver-300 leading-relaxed flex-grow text-lg">
                            {feature.description}
                          </p>
                          <div className="mt-6 flex items-center text-gold-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Explore
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </TiltCard>
                    </BentoCard>
                  );
                })}
              </BentoGrid>
            </div>
          </section>

          {/* How It Works - Parallax Section */}
          <ParallaxLayer speed={0.15} className="py-32 px-6 bg-surface/20 relative">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <TextRevealEnhanced
                  as="h2"
                  className="text-section font-display font-bold text-white mb-6"
                  type="word"
                >
                  The Science of <span className="text-violet-gradient">Success</span>
                </TextRevealEnhanced>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-silver-400"
                >
                  Three steps to career transformation
                </motion.p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-16 relative">
                {/* Connector line */}
                <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

                {steps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.8, type: 'spring' }}
                    className="text-center relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gold-500/10 to-violet-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow backdrop-blur-sm group"
                    >
                      <item.icon className="w-14 h-14 text-gold-400 group-hover:scale-110 transition-transform duration-500" />
                    </motion.div>
                    <div className="text-6xl font-display font-bold text-gold-500/15 mb-4">
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
          </ParallaxLayer>

          {/* Testimonials */}
          <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
            <div className="max-w-7xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <TextRevealEnhanced
                  as="h2"
                  className="text-section font-display font-bold text-white mb-4"
                  type="word"
                >
                  Voices of <span className="text-gold-gradient">Transformation</span>
                </TextRevealEnhanced>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex justify-center gap-2 mb-8"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-7 h-7 fill-gold-400 text-gold-400 drop-shadow-glow" />
                  ))}
                </motion.div>
                <p className="text-xl text-silver-300">
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
                  >
                    <TiltCard maxTilt={10} glow glowColor="rgba(233,200,98,0.2)">
                      <div className="card-glass p-8 flex flex-col h-full backdrop-blur-md bg-surface/40 border border-white/10 hover:border-gold-500/30">
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400 drop-shadow-[0_0_10px_rgba(233,200,98,0.6)]" />
                          ))}
                        </div>
                        <p className="text-silver-200 mb-8 leading-relaxed flex-grow italic text-xl">
                          "{testimonial.content}"
                        </p>
                        <div className="border-t border-white/10 pt-6">
                          <p className="font-display font-bold text-white text-lg">{testimonial.name}</p>
                          <p className="text-sm text-cyan-300">{testimonial.role}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA - Epic with pure black */}
          <section className="py-48 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-aurora-cta animate-aurora opacity-30" />

            {/* More dramatic floating orbs */}
            <motion.div
              animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-32 left-32 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-32 right-32 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"
            />

            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <TextRevealEnhanced
                  as="h2"
                  className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-10 leading-tight"
                  type="word"
                  staggerDelay={0.04}
                >
                  <span className="block">Your Dream Job</span>
                  <span className="block mt-4 bg-gradient-to-r from-gold-300 via-amber-200 to-cyan-300 bg-clip-text text-transparent animate-gradient-flow bg-200% drop-shadow-[0_0_40px_rgba(233,200,98,0.6)]">
                    Doesn't Apply Itself
                  </span>
                </TextRevealEnhanced>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-2xl text-silver-300 mb-16 max-w-3xl mx-auto leading-relaxed"
                >
                  The most successful candidates aren't the most qualified—they're{' '}
                  <span className="text-white font-bold text-2xl">the best presented</span>.
                  Let AI amplify your narrative.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.7, type: 'spring' }}
                  className="inline-block"
                >
                  <MagneticButton strength={60}>
                    <Link
                      to="/analyze"
                      className="inline-flex items-center gap-4 text-2xl px-16 py-7 bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 bg-[length:200%_auto] animate-gradient-flow rounded-xl font-bold text-black shadow-glow-ultra border-2 border-gold-300/60"
                    >
                      <Sparkles className="w-7 h-7" />
                      Begin Your Transformation
                      <ArrowRight className="w-7 h-7" />
                    </Link>
                  </MagneticButton>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="mt-8 text-base text-silver-400"
                >
                  No credit card required. First analysis free forever.
                </motion.p>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="mt-16 flex justify-center items-center gap-8 text-silver-400 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    <span>Privacy First</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-400" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-gold-400" />
                    <span>Instant Analysis</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-24 px-6 relative bg-black/80 backdrop-blur-md border-t border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 via-transparent to-transparent" />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="text-center md:text-left">
                  <Link to="/" className="flex items-center gap-3 justify-center md:justify-start mb-4">
                    <motion.div
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow"
                    >
                      <Sparkles className="w-7 h-7 text-black" />
                    </motion.div>
                    <span className="text-4xl font-display font-bold text-white tracking-tight">
                      Card<span className="text-gold-gradient">zey</span>
                    </span>
                  </Link>
                  <p className="text-silver-300 max-w-md text-lg">
                    AI-powered career intelligence for those who demand excellence.
                    Built with surgical precision.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                  {['Home', 'About', 'Contact'].map((link) => (
                    <Link
                      key={link}
                      to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                      className="text-silver-300 hover:text-gold-400 transition-colors text-sm font-medium relative group"
                    >
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-transparent group-hover:w-full transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-silver-500">
                <p>© {new Date().getFullYear()} Cardzey. Crafted with surgical precision.</p>
              </div>
            </div>
          </footer>
        </div>
      </GradientBackground>
    </div>
  );
}
