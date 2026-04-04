import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Target, Users, Zap, Code, Eye, Heart, Shield } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-mono text-gold-gradient">
      {count}{suffix}
    </span>
  );
}


// Timeline item component
function TimelineItem({
  year,
  title,
  description,
  side,
  index
}: {
  year: string;
  title: string;
  description: string;
  side: 'left' | 'right';
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: side === 'left' ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative ${side === 'left' ? 'pl-8 md:pl-0 md:pr-8 md:text-left' : 'pr-8 md:pr-0 md:pl-8 md:text-right'} md:w-1/2 ${side === 'left' ? 'md:mr-auto' : 'md:ml-auto'}`}
    >
      {/* Timeline dot */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-gold-500 bg-black z-10 hidden md:block">
        <motion.div
          className="absolute inset-0 rounded-full bg-gold-400"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.3 }}
        />
      </div>

      <div className="card-glass p-6 border-gold-500/20">
        <span className="text-gold-400 font-mono text-sm mb-2 block">
          {year}
        </span>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

// Value card
function ValueCard({
  icon: Icon,
  title,
  description,
  index
}: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-glass p-8 text-center group"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-500/20 to-violet-500/20 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-colors">
        <Icon className="w-8 h-8 text-gold-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);
  const timelineRef = useRef(null);

  // Mission statement can be updated in portfolioData or here
  const mission = "We're on a mission to democratize professional development through AI-powered tools that help individuals unlock their full potential and achieve career excellence.";

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-mono tracking-wider mb-6">
                  <Sparkles className="w-4 h-4" />
                  ABOUT CARZEY
                </span>

                <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                  <span className="block text-white mb-2">Redefining</span>
                  <span className="block text-gold-gradient">Professional Growth</span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
                  {mission}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                    <Users className="w-5 h-5 text-violet-400" />
                    <span className="text-gray-300"><AnimatedCounter value={50000} suffix="+" /> Users</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                    <Award className="w-5 h-5 text-gold-400" />
                    <span className="text-gray-300"><AnimatedCounter value={98} suffix="%" /> Satisfaction</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="card-glass p-10 border-gold-500/20 relative overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-gold-500/20 to-violet-500/20 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-violet-500/20 to-gold-500/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-6">
                    Our <span className="text-gold-gradient">Story</span>
                  </h3>
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      Cardzey was born from a simple observation: most professionals struggle to showcase their true potential in a crowded job market.
                    </p>
                    <p>
                      Founded in 2024, we've grown from a small startup to a platform serving thousands worldwide, always staying true to our core belief that every career journey deserves personalized, intelligent support.
                    </p>
                    <p>
                      Today, we combine cutting-edge AI with elegant design to create tools that don't just analyze—they transform.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-3xl font-bold text-gold-gradient font-mono">
                          <AnimatedCounter value={2024} />
                        </div>
                        <div className="text-sm text-gray-400">Founded</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-violet-gradient font-mono">
                          <AnimatedCounter value={30} suffix="+" />
                        </div>
                        <div className="text-sm text-gray-400">Team Members</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-violet-400 font-mono text-sm tracking-widest mb-4 block">
                IMPACT
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Numbers That <span className="text-gold-gradient">Speak</span>
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 50000, label: 'Active Users', suffix: '+' },
              { value: 150000, label: 'CVs Analyzed', suffix: '+' },
              { value: 85, label: 'Match Rate %', suffix: '%' },
              { value: 25, label: 'Countries Reached', suffix: '+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-glass p-8 text-center border-gold-500/10 hover:border-gold-500/30"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-20">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-gold-400 font-mono text-sm tracking-widest mb-4 block">
                WHAT DRIVES US
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Core <span className="text-violet-gradient">Values</span>
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Innovation',
                description: 'We push boundaries with AI and design, constantly evolving to meet tomorrow\'s challenges.'
              },
              {
                icon: Heart,
                title: 'Empathy',
                description: 'Every tool we build starts with understanding real user needs and genuine career aspirations.'
              },
              {
                icon: Shield,
                title: 'Integrity',
                description: 'Transparency, privacy, and ethical AI guide every decision we make as a company.'
              },
              {
                icon: Target,
                title: 'Excellence',
                description: 'We pursue premium quality in every pixel, every interaction, and every user experience.'
              },
            ].map((value, index) => (
              <ValueCard key={index} {...value} index={index} />
            ))}
          </div>
        </section>


        {/* Timeline Section */}
        <section ref={timelineRef} className="py-20 relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/30 via-violet-500/30 to-gold-500/30 hidden md:block" />

          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-violet-400 font-mono text-sm tracking-widest mb-4 block">
                OUR JOURNEY
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Timeline & <span className="text-gold-gradient">Milestones</span>
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            {[
              {
                year: '2024',
                title: 'Cardzey Founded',
                description: 'Started with a vision to revolutionize career development through AI.',
                side: 'left' as const
              },
              {
                year: '2024 Q2',
                title: 'First 10,000 Users',
                description: 'Reached significant milestone within months of launch.',
                side: 'right' as const
              },
              {
                year: '2024 Q3',
                title: 'AI CV Analyzer Launch',
                description: 'Introduced advanced AI-powered resume analysis and scoring.',
                side: 'left' as const
              },
              {
                year: '2024 Q4',
                title: 'Global Expansion',
                description: 'Expanded to serve users in 25+ countries worldwide.',
                side: 'right' as const
              },
              {
                year: '2025',
                title: 'Premium Suite',
                description: 'Launched comprehensive interview prep and job matching features.',
                side: 'left' as const
              },
            ].map((item, index) => (
              <TimelineItem key={index} {...item} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-glass p-16 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-violet-500/10 to-gold-500/10" />
              <div className="absolute inset-0 grain" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Join the <span className="text-gold-gradient">Future</span>?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                  Be part of a community that's reshaping how professionals grow and succeed.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold text-lg"
                >
                  Get Started Today
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
