import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, ArrowRight, Eye, X, Calendar, Users, Award } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Project detail modal
function ProjectDetailModal({
  project,
  onClose
}: {
  project: typeof portfolioData.projects[0];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="card-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto border-gold-500/20 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero visual */}
          <div className={`h-64 md:h-80 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/30" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <span className="text-9xl font-display font-bold text-white/10">
                {project.title.charAt(0)}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {project.title}
                </h2>
                <p className="text-gold-400 font-mono text-sm">
                  {project.tags.slice(0, 3).join(' • ')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                {project.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-400" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-lg text-sm bg-gold-500/10 border border-gold-500/20 text-gold-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/20 hover:border-violet-400/50 transition-all group"
                >
                  <Code2 className="w-5 h-5 text-gray-400 group-hover:text-violet-400" />
                  <span className="text-white font-medium">View Code</span>
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-violet-600 text-white font-medium shadow-lg shadow-gold-500/20"
                >
                  <Eye className="w-5 h-5" />
                  <span>Live Demo</span>
                </motion.a>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gold-gradient font-mono">500+</div>
                <div className="text-sm text-gray-400">Config Options</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-violet-gradient font-mono">99%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-gradient font-mono">&lt;50ms</div>
                <div className="text-sm text-gray-400">Response Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Project card for grid
function ProjectCard({
  project,
  index,
  onClick
}: {
  project: typeof portfolioData.projects[0];
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-glass group cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Visual */}
      <div className={`h-56 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-8xl font-display font-bold text-white/15">
            {project.title.charAt(0)}
          </span>
        </motion.div>

        {/* Floating badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {project.featured && (
            <span className="px-3 py-1 rounded-full text-xs bg-gold-500/80 text-white font-semibold">
              Featured
            </span>
          )}
        </div>

        {/* Overlay actions */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-4">
            {project.github && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Code2 className="w-6 h-6 text-white" />
              </motion.div>
            )}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full bg-gradient-to-r from-gold-500 to-violet-600"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-6 h-6 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-gray-300 hover:border-gold-400/50 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{Math.floor(Math.random() * 1000) + 100} stars</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    portfolioData.projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return ['all', ...Array.from(tags)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'all') return portfolioData.projects;
    return portfolioData.projects.filter((p) => p.tags.includes(selectedFilter));
  }, [selectedFilter]);

  const featuredProjects = portfolioData.projects.filter((p) => p.featured);

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh-gradient-alt opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,165,116,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_40%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-mono tracking-wider mb-6">
              <Award className="w-4 h-4" />
              PORTFOLIO
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="block text-white">Selected</span>
              <span className="block text-gold-gradient">Works</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A collection of award-winning projects that push the boundaries of web technology and design.
            </p>
          </motion.div>
        </section>

        {/* Featured banner */}
        {featuredProjects.length > 0 && (
          <section className="py-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="card-glass p-10 border-gold-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-violet-500/5" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">Featured Project</h2>
                  <p className="text-gold-400 font-medium mb-1">{featuredProjects[0].title}</p>
                  <p className="text-gray-400 text-sm line-clamp-2">{featuredProjects[0].description}</p>
                </div>
                <motion.button
                  onClick={() => setSelectedProject(featuredProjects[0])}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-violet-600 rounded-xl font-semibold text-white flex items-center gap-2"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          </section>
        )}

        {/* Filter tabs */}
        <section className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {allTags.slice(0, 8).map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedFilter(tag)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${
                  selectedFilter === tag
                    ? 'bg-gradient-to-r from-gold-500 to-violet-600 border-transparent text-white shadow-lg shadow-gold-500/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-gold-400/50 hover:text-white'
                }`}
              >
                {tag === 'all' ? 'All Projects' : tag}
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Projects Grid */}
        <section>
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No results */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl mb-4">No projects found for this filter.</p>
              <button
                onClick={() => setSelectedFilter('all')}
                className="text-gold-400 hover:text-gold-300 underline font-medium"
              >
                Show all projects
              </button>
            </motion.div>
          )}
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
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-gold-500/10 to-violet-500/10" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Want to <span className="text-violet-gradient">Collaborate</span>?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  I'm always interested in new challenges and exciting projects.
                  Let's create something extraordinary together.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-gold"
                  >
                    Start a Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-semibold bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                  >
                    Contact Me
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
