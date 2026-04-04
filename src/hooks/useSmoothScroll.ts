import { useEffect } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll(options?: {
  duration?: number;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: options?.duration ?? 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [options?.duration]);
}

