import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: ReactNode[];
  className?: string;
  cols?: 1 | 2 | 3 | 4;
  gap?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  gradient?: 'blue' | 'purple' | 'gold' | 'cyan' | 'violet' | 'mixed';
}

const colSpanClasses = {
  1: 'col-span-1',
  2: 'col-span-2',
};

const rowSpanClasses = {
  1: 'row-span-1',
  2: 'row-span-2',
};

const gradientClasses = {
  blue: 'bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border-cyan-500/20',
  purple: 'bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border-violet-500/20',
  gold: 'bg-gradient-to-br from-gold-500/10 via-amber-500/5 to-transparent border-gold-500/20',
  cyan: 'bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent border-cyan-500/20',
  violet: 'bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border-violet-500/20',
  mixed: 'bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-gold-500/10 border-cyan-500/20',
};

export function BentoGrid({
  children,
  className = '',
  cols = 3,
  gap = 'gap-6',
}: BentoGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} ${gap} ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  gradient = 'gold',
}: BentoCardProps) {
  return (
    <motion.div
      className={`
        ${colSpanClasses[colSpan]} ${rowSpanClasses[rowSpan]}
        ${gradientClasses[gradient]}
        card-glass p-8 rounded-2xl border backdrop-blur-sm
        relative overflow-hidden group
        ${className}
      `}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
