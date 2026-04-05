import { ReactNode } from 'react';
import { motion, Variants, useReducedMotion } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  // Animation type
  fadeUp?: boolean;
  fadeIn?: boolean;
  scale?: boolean;
  slideLeft?: boolean;
  slideRight?: boolean;
  custom?: Variants;
  once?: boolean;
  rootMargin?: string;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  duration,
  threshold = 0.1,
  fadeUp = true,
  fadeIn = false,
  scale = false,
  slideLeft = false,
  slideRight = false,
  custom,
  once = true,
  rootMargin = '0px',
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Choose variant
  let variant = custom || defaultVariants;
  if (fadeUp) variant = fadeUpVariants;
  if (fadeIn) variant = fadeInVariants;
  if (scale) variant = scaleVariants;
  if (slideLeft) variant = slideLeftVariants;
  if (slideRight) variant = slideRightVariants;

  // Apply delay and duration
  if (delay > 0 || duration) {
    variant = {
      ...variant,
      visible: {
        ...variant.visible,
        transition: {
          ...(variant.visible as any).transition,
          delay,
          duration,
        },
      },
    };
  }

  // Disable animations if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
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
      variants={variant}
    >
      {children}
    </motion.div>
  );
}
