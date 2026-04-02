import { motion } from 'framer-motion';

const integrations = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Three.js', color: '#049EF4' },
  { name: 'Tailwind CSS', color: '#06B6D4' },
  { name: 'PDF.js', color: '#FF6600' },
  { name: 'Node.js', color: '#339933' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Framer Motion', color: '#0055FF' },
  { name: 'Zustand', color: '#F5A623' },
];

export default function LogoGrid() {
  return (
    <section className="py-24 px-4 bg-white/5 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powered by <span className="gradient-text">Modern Stack</span>
          </h2>
          <p className="text-lg text-gray-400">
            Built with the best tools for performance and developer experience
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
            >
              <div className="text-center">
                <div
                  className="text-3xl font-bold mb-2 transition-all duration-300 group-hover:scale-110"
                  style={{ color: integration.color }}
                >
                  {integration.name === 'React' && '⚛️'}
                  {integration.name === 'Three.js' && '🌐'}
                  {integration.name === 'Tailwind CSS' && '▲'}
                  {integration.name === 'PDF.js' && '📄'}
                  {integration.name === 'Node.js' && '🟢'}
                  {integration.name === 'TypeScript' && 'TS'}
                  {integration.name === 'Framer Motion' && '🎬'}
                  {integration.name === 'Zustand' && '◎'}
                </div>
                <span className="text-sm text-gray-400 font-medium">
                  {integration.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            And many more technologies working together seamlessly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
