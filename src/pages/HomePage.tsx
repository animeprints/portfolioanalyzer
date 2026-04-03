// @ts-nocheck
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextReveal } from '../components/Animations/TextReveal';
import { MagneticButton } from '../components/Animations/MagneticButton';
import { AnimatedSection } from '../components/Animations/AnimatedSection';
import TechMarquee from '../components/Portfolio/TechMarquee';
import { portfolioData } from '../data/portfolio';
import { ArrowDown, Code, Mail, Users, Github, Link2 as Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Parallax for decorative elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Hero Content */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Decorative parallax backgrounds */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-32 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-600/10 blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-32 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-600/10 blur-3xl"
        />

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12 pt-20">
          {/* Greeting */}
          <AnimatedSection fadeIn delay={0.2}>
            <p className="text-cyan-400 font-mono text-lg md:text-xl tracking-wider">
              Hello, I'm
            </p>
          </AnimatedSection>

          {/* Name */}
          <AnimatedSection>
            <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-6">
              <TextReveal type="char" delay={0.4}>
                <span className="gradient-text">{portfolioData.name}</span>
              </TextReveal>
            </h1>
          </AnimatedSection>

          {/* Title */}
          <AnimatedSection delay={0.8}>
            <p className="text-2xl md:text-4xl text-gray-300 font-light mb-8">
              {portfolioData.title}
            </p>
          </AnimatedSection>

          {/* Tagline */}
          <AnimatedSection delay={1}>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {portfolioData.tagline}
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={1.2} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/work">
              <MagneticButton strength={40} size="lg" className="px-10 py-4">
                View My Work
              </MagneticButton>
            </Link>
            <Link to="/about">
              <MagneticButton strength={40} size="lg" type="outline" className="px-10 py-4">
                Learn More
              </MagneticButton>
            </Link>
          </AnimatedSection>

          {/* Social Links */}
          <AnimatedSection delay={1.4} className="flex gap-6 justify-center pt-4">
            <motion.a
              href={`https://github.com/${portfolioData.social.github}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all group"
            >
              <Code2 className="w-6 h-6 text-gray-400 group-hover:text-cyan-400" />
            </motion.a>
            <motion.a
              href={`mailto:${portfolioData.social.email}`}
              whileHover={{ y: -5, scale: 1.1 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400/50 transition-all group"
            >
              <Mail className="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
            </motion.a>
            <motion.a
              href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-400/50 transition-all group"
            >
              <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-pink-400" />
            </motion.a>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToNext}
        >
          <span className="text-gray-500 text-sm font-mono tracking-widest group-hover:text-cyan-400 transition-colors">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Preview Section (teaser) */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection fadeUp>
            <div className="glass-card p-8 md:p-12 border-cyan-500/20 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-2xl -ml-24 -mb-24" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
                  About Me
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mb-8">
                  {portfolioData.bio}
                </p>
                <Link to="/about">
                  <MagneticButton size="lg" className="px-8 py-4">
                    Discover My Story
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection fadeUp>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Featured <span className="gradient-text">Work</span>
              </h2>
              <p className="text-gray-400 text-lg mt-4">
                A selection of my recent projects
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {portfolioData.projects
              .filter((p) => p.featured)
              .slice(0, 2)
              .map((project, index) => (
                <AnimatedSection key={project.id} fadeUp delay={index * 0.2}>
                  <div
                    className={`glass-card p-8 border-2 group cursor-pointer hover:border-cyan-400/50 transition-all duration-500 h-full flex flex-col`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-cyan-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                        >
                          <Code2 className="w-4 h-4" />
                          Code
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="text-center">
              <Link to="/work">
                <MagneticButton size="lg" className="px-10 py-4">
                  View All Projects
                </MagneticButton>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section>
        <TechMarquee />
      </section>
    </div>
  );
}
