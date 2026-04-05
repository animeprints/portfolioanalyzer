import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Positive or negative for direction
  rotate?: number;
  scale?: number;
  startOffset?: number; // 0 to 1
  endOffset?: number; // 0 to 1
}

export function ParallaxLayer({
  children,
  className = '',
  speed = 0.5,
  rotate = 0,
  scale = 1,
  startOffset = 0,
  endOffset = 1,
}: ParallaxLayerProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = useTransform(
    scrollYProgress,
    [startOffset, endOffset],
    [0, 1]
  );

  const y = useTransform(range, [0, 1], [0, speed * 1000], { clamp: false });
  const rotateZ = useTransform(range, [0, 1], [0, rotate]);
  const scaleSpring = useSpring(
    useTransform(range, [0, 1], [1, scale]),
    { stiffness: 400, damping: 40 }
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          y,
          rotateZ,
          scale: scaleSpring,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
