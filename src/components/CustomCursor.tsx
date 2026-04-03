import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

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

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updatePointerState);
    window.addEventListener('mouseout', updatePointerState);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updatePointerState);
      window.removeEventListener('mouseout', updatePointerState);
    };
  }, [mousePosition.x, mousePosition.y]);

  // Don't show on touch devices
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Outer glow */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
        }}
        animate={{
          width: isPointer ? 50 : 40,
          height: isPointer ? 50 : 40,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full border-2"
          style={{
            borderColor: isPointer ? '#06b6d4' : '#8b5cf6',
            boxShadow: `0 0 20px ${isPointer ? '#06b6d4' : '#8b5cf6'}40`,
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x - 4,
          top: mousePosition.y - 4,
        }}
        animate={{
          width: isPointer ? 10 : 8,
          height: isPointer ? 10 : 8,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: isPointer ? '#06b6d4' : '#ffffff',
          }}
        />
      </motion.div>
    </>
  );
}
