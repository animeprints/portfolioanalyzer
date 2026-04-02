import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import Lenis from 'lenis';

const ScrollContext = createContext<Lenis | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Set up the animation loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollContext.Provider value={lenisRef.current}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useLenis() {
  return useContext(ScrollContext);
}
