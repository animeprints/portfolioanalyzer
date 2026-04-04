import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: 'subtle' | 'moderate' | 'intense';
  animated?: boolean;
}

export function GradientBackground({
  className = '',
  children,
  intensity = 'moderate',
  animated = true,
}: GradientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const intensityMap = {
    subtle: 'opacity-30',
    moderate: 'opacity-50',
    intense: 'opacity-70',
  };

  useEffect(() => {
    if (shouldReduceMotion || !animated) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, animated]);

  const gradientStyle = shouldReduceMotion
    ? {}
    : {
        backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
      };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base dark background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Animated aurora blobs */}
      {animated && !shouldReduceMotion && (
        <>
          <div
            className={`absolute inset-0 bg-aurora animate-aurora ${intensityMap[intensity]}`}
            style={gradientStyle}
          />
          <div
            className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-blob-1 animate-float opacity-20 blur-3xl"
            style={{ animationDuration: '25s' }}
          />
          <div
            className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-gradient-blob-2 animate-float-slow opacity-20 blur-3xl"
            style={{ animationDuration: '30s', animationDelay: '-5s' }}
          />
          <div
            className="absolute left-1/3 top-1/3 w-96 h-96 bg-gradient-blob-3 animate-float opacity-10 blur-3xl"
            style={{ animationDuration: '20s', animationDelay: '-10s' }}
          />
        </>
      )}

      {/* Static blobs for reduced motion */}
      {shouldReduceMotion && (
        <>
          <div className={`absolute inset-0 bg-mesh-gradient ${intensityMap[intensity]}`} />
        </>
      )}

      {/* Grain texture overlay */}
      {!shouldReduceMotion && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {children}
    </div>
  );
}
