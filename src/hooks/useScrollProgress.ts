import { useState, useEffect } from 'react';

/**
 * Hook to track scroll progress (0 to 1)
 * Returns values between 0 and 1 representing scroll position
 */
export function useScrollProgress(options?: {
  smooth?: boolean;
  debounceMs?: number;
}) {
  const [progress, setProgress] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let lastUpdate = 0;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY / documentHeight;
      const clamped = Math.min(1, Math.max(0, scrolled));

      setRawProgress(clamped);

      // Apply smoothing if enabled
      if (options?.smooth) {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const smoothed = 0.1 * clamped + 0.9 * progress;
            setProgress(Math.min(1, Math.max(0, smoothed)));
            ticking = false;
          });
          ticking = true;
        }
      } else {
        setProgress(clamped);
      }

      lastKnownScrollPosition = window.scrollY;
    };

    const handleScroll = () => {
      if (options?.debounceMs) {
        const now = Date.now();
        if (now - lastUpdate > options.debounceMs) {
          updateProgress();
          lastUpdate = now;
        }
      } else {
        updateProgress();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [options?.smooth, options?.debounceMs, progress]);

  return { progress, rawProgress };
}

/**
 * Hook to get scroll velocity (speed of scrolling)
 */
export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number | undefined;

    const handleScroll = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;

      if (deltaTime > 0) {
        const deltaY = Math.abs(window.scrollY - lastScrollY);
        const pixelsPerMs = deltaY / deltaTime;

        // Smooth the velocity
        setVelocity((prev) => 0.7 * pixelsPerMs + 0.3 * prev);
      }

      setLastScrollY(window.scrollY);
      setLastTime(now);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [lastScrollY, lastTime]);

  return velocity;
}

/**
 * Hook to detect scroll direction
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY && currentScrollY > 50) {
        setDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return direction;
}
