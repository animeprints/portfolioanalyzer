import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: 'word' | 'char' | 'line';
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

export function TextReveal({
  children,
  className,
  delay = 0,
  type = 'word',
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  // Split text based on type
  const splitText = () => {
    const text = typeof children === 'string' ? children : '';
    if (type === 'char') {
      return text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          style={{ display: 'inline' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }
    if (type === 'word') {
      return text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-1"
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            transitionDelay: i > 0 ? `${i * 0.05}s` : '0s',
          }}
        >
          {word}
        </motion.span>
      ));
    }
    return children;
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ transitionDelay: `${delay}s` }}
    >
      {splitText()}
    </motion.div>
  );
}
