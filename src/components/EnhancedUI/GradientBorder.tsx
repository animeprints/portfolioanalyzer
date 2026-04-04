import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  cornerRadius?: string;
  gradient?: 'gold' | 'violet' | 'cyan' | 'rainbow';
  animated?: boolean;
}

export function GradientBorder({
  children,
  className = '',
  borderWidth = 2,
  cornerRadius = '1rem',
  gradient = 'gold',
  animated = false,
}: GradientBorderProps) {
  const gradients = {
    gold: 'linear-gradient(135deg, #d4a574 0%, #f4dcc0 50%, #d4a574 100%)',
    violet: 'linear-gradient(135deg, #9333ea 0%, #b986ff 50%, #9333ea 100%)',
    cyan: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 50%, #06b6d4 100%)',
    rainbow: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 25%, #40e0d0 50%, #ff0080 75%, #ff8c00 100%)',
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        background: gradients[gradient],
        padding: borderWidth,
        borderRadius: cornerRadius,
        animation: animated ? 'gradientFlow 3s ease infinite' : 'none',
        backgroundSize: animated ? '200% 200%' : '100% 100%',
      }}
    >
      <div
        className="absolute inset-0 rounded-inherit"
        style={{
          background: 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.98) 100%)',
          borderRadius: `calc(${cornerRadius} - ${borderWidth}px)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
