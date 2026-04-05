import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

export interface CarouselImage {
  src: string;
  alt?: string;
  label?: string;
}

export interface CarouselProps {
  /** Array of images to display in the carousel */
  images: CarouselImage[];
  /** Auto-play interval in milliseconds (default: 3000) */
  autoPlayInterval?: number;
  /** Whether to auto-advance slides (default: true) */
  autoPlay?: boolean;
  /** Show navigation dots (default: true) */
  showDots?: boolean;
  /** Show navigation arrows (default: true) */
  showArrows?: boolean;
  /** Enable swipe gestures (default: true) */
  enableSwipe?: boolean;
  /** Height of the carousel */
  height?: string | number;
  /** Width of the carousel */
  width?: string | number;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** Animation variant */
  variant?: "default" | "overlap" | "stack";
  /** Transition duration in seconds */
  transitionDuration?: number;
}

/**
 * Carousel - A responsive image carousel with auto-play, swipe, and navigation
 *
 * @example
 * ```tsx
 * <Carousel
 *   images={[
 *     { src: "/img1.jpg", label: "Shop" },
 *     { src: "/img2.jpg", label: "About" },
 *     { src: "/img3.jpg", label: "Journal" },
 *     { src: "/img4.jpg", label: "Updates" }
 *   ]}
 *   autoPlayInterval={4000}
 *   height={400}
 * />
 * ```
 */
export default function Carousel({
  images,
  autoPlayInterval = 3000,
  autoPlay = true,
  showDots = true,
  showArrows = true,
  enableSwipe = true,
  height = 400,
  width = "100%",
  style,
  onSlideChange,
  variant = "default",
  transitionDuration = 0.7,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isAutoPlaying) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isAutoPlaying, goToNext]);

  // Notify on slide change
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay);

  // Handle swipe/drag end
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!enableSwipe) return;

    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.95,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  if (images.length === 0) return null;

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "hidden",
    borderRadius: 20,
    ...style,
  };

  const slideStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 20,
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "12px 32px",
    borderRadius: 30,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a1a",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
  };

  const dotContainerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 10,
    zIndex: 20,
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? 24 : 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.4)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    zIndex: 20,
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} custom={direction} mode={variant === "overlap" ? "popLayout" : undefined}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: transitionDuration, ease: [0.85, -0.03, 0.21, 1.04] },
            opacity: { duration: transitionDuration * 0.8 },
            scale: { duration: transitionDuration },
            rotateY: { duration: transitionDuration },
          }}
          style={slideStyle}
          drag={enableSwipe ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt || `Slide ${currentIndex + 1}`}
            style={imageStyle}
            draggable={false}
          />
          {images[currentIndex].label && (
            <div style={labelStyle}>
              {images[currentIndex].label}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            style={{ ...arrowStyle, left: 20 }}
            onClick={goToPrev}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = `translateY(-50%) scale(1.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            ←
          </button>
          <button
            style={{ ...arrowStyle, right: 20 }}
            onClick={goToNext}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = `translateY(-50%) scale(1.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "translateY(-50%)";
            }}
          >
            →
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div style={dotContainerStyle}>
          {images.map((_, index) => (
            <div
              key={index}
              style={dotStyle(index === currentIndex)}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
