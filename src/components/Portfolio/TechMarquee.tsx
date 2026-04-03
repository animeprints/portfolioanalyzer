import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const techItems = [
  'React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS',
  'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'WebGL',
  'Vue.js', 'Python', 'Redis', 'Kubernetes', 'Firebase', 'Vite',
];

export default function TechMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="py-12 overflow-hidden bg-gradient-to-b from-transparent via-white/5 to-transparent">
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-32 h-full bg-gradient-to-r from-dark-950 to-transparent" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-32 h-full bg-gradient-to-l from-dark-950 to-transparent" />

        <div ref={containerRef} className="flex whitespace-nowrap">
          <motion.div
            className="flex gap-8"
            animate={{ x: [0, -techItems.length * 120] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {techItems.map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">{tech}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {techItems.map((tech, i) => (
              <div
                key={`duplicate-${i}`}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-gray-300">{tech}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
