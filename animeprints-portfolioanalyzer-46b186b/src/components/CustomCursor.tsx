import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updatePointerState = () => {
      const target = document.elementFromPoint(mousePosition.x, mousePosition.y);
      const isClickable =
        target?.tagName === 'BUTTON' ||
        target?.tagName === 'A' ||
        target?.hasAttribute('role') ||
        (target as HTMLElement)?.className?.includes('interactive');
      setIsPointer(isClickable);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updatePointerState);
    window.addEventListener('mouseout', updatePointerState);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updatePointerState);
      window.removeEventListener('mouseout', updatePointerState);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePosition.x, mousePosition.y]);

  // Don't show on touch devices
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouch || isHidden) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 24,
          top: mousePosition.y - 24,
        }}
        animate={{
          width: isPointer ? 56 : 40,
          height: isPointer ? 56 : 40,
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full border-2 backdrop-blur-sm"
          style={{
            borderColor: isPointer ? 'rgba(212, 165, 116, 0.8)' : 'rgba(255, 255, 255, 0.5)',
            boxShadow: `0 0 20px ${isPointer ? 'rgba(212, 165, 116, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 3,
          top: mousePosition.y - 3,
        }}
        animate={{
          width: isPointer ? 12 : 6,
          height: isPointer ? 12 : 6,
          opacity: 1,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: isPointer ? '#d4a574' : '#ffffff',
            boxShadow: `0 0 8px ${isPointer ? 'rgba(212, 165, 116, 0.6)' : 'rgba(255, 255, 255, 0.4)'}`,
          }}
        />
      </motion.div>
    </>
  );
}
