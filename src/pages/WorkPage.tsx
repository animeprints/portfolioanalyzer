// @ts-nocheck
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../components/Animations/AnimatedSection';
import { TextReveal } from '../components/Animations/TextReveal';
import { MagneticButton } from '../components/Animations/MagneticButton';
import { portfolioData } from '../data/portfolio';
import { ExternalLink, Code2 } from 'lucide-react';

export default function WorkPage() {
  const [filter, setFilter] = useState<string>('all');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    portfolioData.projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return ['all', ...Array.from(tags)];
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return portfolioData.projects;
    return portfolioData.projects.filter((p) => p.tags.includes(filter));
  }, [filter]);

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="py-20 text-center">
          <AnimatedSection>
            <span className="text-cyan-400 font-mono text-sm tracking-widest mb-4 block">
              PORTFOLIO
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <TextReveal type="char">Work</TextReveal>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A collection of projects that showcase my passion for creating
              exceptional digital experiences.
            </p>
          </AnimatedSection>
        </section>

        {/* Filter Tabs */}
        <section className="py-8">
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 border ${
                    filter === tag
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 border-white/20 text-gray-400 hover:border-cyan-400/50 hover:text-white'
                  }`}
                >
                  {tag === 'all' ? 'All Projects' : tag}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </section>

        {/* Projects Grid */}
        <section>
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="glass-card h-full flex flex-col border-white/10 hover:border-cyan-400/50 transition-all duration-500 overflow-hidden">
                    {/* Project visual */}
                    <div
                      className={`h-56 bg-gradient-to-br ${project.color} relative overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                      >
                        <span className="text-8xl font-bold text-white/20">
                          {project.title.charAt(0)}
                        </span>
                      </motion.div>
                      {/* Overlay with links */}
                      <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <GitHub className="w-6 h-6 text-white" />
                          </motion.a>
                        )}
                        {project.live && (
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </motion.a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-6 flex-grow leading-relaxed text-sm">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-400/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl">No projects found for this filter.</p>
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-cyan-400 hover:text-cyan-300 underline"
              >
                Show all projects
              </button>
            </motion.div>
          )}
        </section>

        {/* Contact CTA */}
        <section className="py-32">
          <AnimatedSection>
            <div className="glass-card p-12 border-2 border-white/10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Interested in working <span className="gradient-text">together?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision.
                </p>
                <MagneticButton size="lg" className="px-10 py-4">
                  Get In Touch
                </MagneticButton>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </div>
  );
}
