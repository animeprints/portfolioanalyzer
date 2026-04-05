import { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number; // How strong the magnetic effect is (pixels)
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 40,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) / (rect.width / 2);
    const distanceY = (e.clientY - centerY) / (rect.height / 2);

    const maxDistance = Math.sqrt(2);
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, distanceX)) * strength;
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, distanceY)) * strength;

    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: springX,
        y: springY,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
