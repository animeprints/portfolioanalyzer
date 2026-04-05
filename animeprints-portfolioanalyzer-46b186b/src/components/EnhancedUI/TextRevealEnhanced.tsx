import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface TextRevealEnhancedProps {
  children: ReactNode;
  className?: string;
  type?: 'word' | 'char' | 'line';
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
  triggerOnce?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export function TextRevealEnhanced({
  children,
  className = '',
  type = 'word',
  delay = 0,
  staggerDelay = 0.03,
  duration,
  once = true,
  triggerOnce = true,
  as: Component = 'div',
}: TextRevealEnhancedProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && triggerOnce) {
      setHasAnimated(true);
    }
  }, [isInView, triggerOnce]);

  const shouldAnimate = !shouldReduceMotion && (!triggerOnce || isInView || hasAnimated);

  const splitText = () => {
    const text = typeof children === 'string' ? children : '';
    let items: string[] = [];

    if (type === 'char') {
      items = text.split('');
      return items.map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          style={{ display: 'inline' }}
          custom={i}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ));
    }

    if (type === 'word') {
      items = text.split(' ');
      return items.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-1"
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
          }}
          custom={i}
        >
          {word}
        </motion.span>
      ));
    }

    if (type === 'line') {
      items = text.split('\n');
      return items.map((line, i) => (
        <motion.div
          key={i}
          variants={lineVariants}
          className="block"
          custom={i}
        >
          {line || '\u00A0'}
        </motion.div>
      ));
    }

    return children;
  };

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      variants={containerVariants}
      style={{ transitionDelay: `${delay}s` }}
    >
      {splitText()}
    </motion.div>
  );
}
