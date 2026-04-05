import { useRef, ReactNode } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '../../utils/cn';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number; // How strong the magnetic effect is (pixels)
  onClick?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function MagneticButton({
  children,
  className,
  strength = 30,
  onClick,
  disabled = false,
  type = 'primary',
  size = 'md',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };

  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    x.set(0);
    y.set(0);
  };

  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const typeClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/30 focus:ring-cyan-500',
    secondary:
      'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600 focus:ring-gray-500',
    outline:
      'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 focus:ring-cyan-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };

  const combinedClasses = cn(
    baseClasses,
    typeClasses[type],
    sizeClasses[size],
    className
  );

  return (
    <motion.button
      ref={ref}
      className={combinedClasses}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}
