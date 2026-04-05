import { ReactNode, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useLenis } from '../Scroll/ScrollProvider';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Positive moves slower than scroll (parallax), negative faster
  offset?: number; // Vertical offset in px
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  offset = 0,
}: ParallaxProps) {
  const lenis = useLenis();
  const scroll = useMotionValue(0);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = (e: { scroll: number }) => {
      scroll.set(e.scroll);
    };

    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis, scroll]);

  // Parallax transform: position = offset - scroll * speed
  const y = useTransform(
    scroll,
    [0, 1],
    [offset, offset - 1000 * speed]
  );

  const parallaxY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  return (
    <motion.div
      className={className}
      style={{
        y: parallaxY,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}

interface HorizontalParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
}

export function HorizontalParallax({
  children,
  className,
  speed = 0.3,
  direction = 'right',
}: HorizontalParallaxProps) {
  const lenis = useLenis();
  const scroll = useMotionValue(0);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = (e: { scroll: number }) => {
      scroll.set(e.scroll);
    };

    lenis.on('scroll', onScroll);

    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenis, scroll]);

  const multiplier = direction === 'right' ? 1 : -1;
  const x = useTransform(
    scroll,
    [0, 1000],
    [0, 1000 * speed * multiplier]
  );

  const parallaxX = useSpring(x, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  return (
    <motion.div
      className={className}
      style={{
        x: parallaxX,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}
