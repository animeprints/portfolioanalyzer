import { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // in degrees
  perspective?: number;
  scale?: number;
  disabled?: boolean;
  glow?: boolean;
  glowColor?: string;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  disabled = false,
  glow = true,
  glowColor = 'rgba(212, 165, 116, 0.15)',
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    const rotateXValue = (y / (rect.height / 2)) * -maxTilt;
    const rotateYValue = (x / (rect.width / 2)) * maxTilt;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const rotateXSpring = useSpring(rotateX, { stiffness: 400, damping: 30 });
  const rotateYSpring = useSpring(rotateY, { stiffness: 400, damping: 30 });

  return (
    <motion.div
      ref={ref}
      className={`${className} preserve-3d`}
      style={{
        perspective,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ scale: isHovered ? scale : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}

      {/* Glow effect that follows mouse */}
      {glow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none opacity-0 mix-blend-screen"
          style={{
            background: `radial-gradient(circle 150px at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`,
          }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}
