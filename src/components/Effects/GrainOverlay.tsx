import { useReducedMotion } from 'framer-motion';

interface GrainOverlayProps {
  className?: string;
  opacity?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function GrainOverlay({
  className = '',
  opacity = 0.03,
  intensity = 'medium',
}: GrainOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  const intensityMap = {
    light: 'blur-3xl',
    medium: 'blur-2xl',
    heavy: 'blur-sm',
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${intensityMap[intensity]} ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}
