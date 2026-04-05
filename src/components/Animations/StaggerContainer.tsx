import React, { ReactNode } from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';

interface StaggerContainerProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  threshold?: number;
  once?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
  rootMargin?: string;
}

const getStaggerVariants = (
  direction: 'up' | 'down' | 'left' | 'right' | 'scale',
  distance: number,
  staggerDelay: number
): Variants => {
  const hiddenByDirection = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: distance },
    right: { opacity: 0, x: -distance },
    scale: { opacity: 0, scale: 0.8 },
  };

  return {
    hidden: hiddenByDirection[direction],
    visible: {
      opacity: 1,
      y: direction === 'up' || direction === 'down' ? 0 : undefined,
      x: direction === 'left' || direction === 'right' ? 0 : undefined,
      scale: direction === 'scale' ? 1 : undefined,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
        staggerChildren: staggerDelay,
      },
    },
  };
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  threshold = 0.1,
  once = true,
  direction = 'up',
  distance = 30,
  rootMargin = '0px',
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = getStaggerVariants(direction, distance, staggerDelay);

  if (shouldReduceMotion) {
    return (
      <div className={className}>
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        amount: threshold as any,
        once,
        margin: rootMargin,
      }}
      variants={variants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={variants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
