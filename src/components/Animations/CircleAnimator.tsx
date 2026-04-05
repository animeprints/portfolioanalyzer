import React, { useState, useEffect, useRef, ReactElement, isValidElement } from "react";

interface CircleAnimatorProps {
  /** Mode: "images" for image URLs, "components" for React components */
  mode?: "images" | "components";
  /** Number of items to display (for images mode) */
  itemCount?: number;
  /** Content array for components mode */
  content?: React.ReactNode[];
  /** Image sources (up to 10) */
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  image7?: string;
  image8?: string;
  image9?: string;
  image10?: string;
  /** Radius of the circular path in pixels */
  radius?: number;
  /** Animation speed (0.1 to 1) */
  speed?: number;
  /** Orientation mode */
  orientation?: "rotate" | "pin";
  /** Rotation alignment (for rotate mode) */
  rotationAlignment?: "fixed" | "radial" | "tangent";
  /** Fixed angle in degrees (when rotationAlignment is "fixed") */
  fixedAngle?: number;
  /** Animation direction */
  direction?: "normal" | "reverse";
  /** Pause animation on hover */
  pauseOnHover?: boolean;
  /** Item width in pixels (for images mode or fixed sizing) */
  itemWidth?: number;
  /** Item height in pixels (for images mode or fixed sizing) */
  itemHeight?: number;
  /** Sizing mode for components */
  sizing?: "fixed" | "fit-content";
  /** Additional styles */
  style?: React.CSSProperties;
  /** Children (alternative to image props) */
  children?: React.ReactNode;
}

/**
 * CircleAnimator - A circular rotating element animation component
 *
 * Creates a circular arrangement of items (images or components) that rotate around a center point.
 * Perfect for showcases, galleries, or decorative animations.
 *
 * @example
 * ```tsx
 * <CircleAnimator
 *   mode="images"
 *   itemCount={6}
 *   image1="/img1.jpg"
 *   image2="/img2.jpg"
 *   radius={150}
 *   speed={0.5}
 *   itemWidth={100}
 *   itemHeight={100}
 * />
 * ```
 */
export default function CircleAnimator({
  mode = "images",
  itemCount = 4,
  content = [],
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  radius = 120,
  speed = 0.5,
  orientation = "pin",
  rotationAlignment = "fixed",
  fixedAngle = 0,
  direction = "normal",
  pauseOnHover = false,
  itemWidth = 80,
  itemHeight = 80,
  sizing = "fixed",
  style,
  children,
}: CircleAnimatorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const contentMeasureRefs = useRef<(HTMLElement | null)[]>([]);
  const zoomProbeRef = useRef<HTMLDivElement>(null);
  const [maxContentSize, setMaxContentSize] = useState({ width: 0, height: 0 });

  // Linear mapping of speed (0.1 to 1) to rotations per second
  const minSpeed = 0.1;
  const maxSpeed = 1;
  const minRotationsPerSec = 1 / 300; // slowest: 1 rotation per 5 minutes
  const maxRotationsPerSec = 1 / 3; // fastest: 1 rotation per 3 seconds

  const normalizedSpeed = (speed - minSpeed) / (maxSpeed - minSpeed);
  const rotationsPerSec = minRotationsPerSec + normalizedSpeed * (maxRotationsPerSec - minRotationsPerSec);
  const duration = 1 / rotationsPerSec;

  // Get images array
  const images = [
    image1, image2, image3, image4, image5,
    image6, image7, image8, image9, image10
  ];

  // Determine actual count based on mode
  const actualCount = mode === "components" ? (content.length > 0 ? content.length : 4) : itemCount;

  // Measure intrinsic sizes of child components when sizing = "fit-content"
  useEffect(() => {
    if (!(mode === "components" && sizing === "fit-content")) return;

    const timer = setTimeout(() => {
      const probe = zoomProbeRef.current;
      const editorZoom = probe ? probe.getBoundingClientRect().width / 20 : 1;
      const safeZoom = Math.max(editorZoom, 1e-4);

      let maxW = 0;
      let maxH = 0;

      for (const el of contentMeasureRefs.current) {
        if (!el) continue;
        const child = el.firstElementChild;
        const rect = (child ?? el).getBoundingClientRect();
        const adjustedW = rect.width / safeZoom;
        const adjustedH = rect.height / safeZoom;

        if (adjustedW > maxW) maxW = adjustedW;
        if (adjustedH > maxH) maxH = adjustedH;
      }

      setMaxContentSize({ width: maxW, height: maxH });
    }, 0);

    return () => clearTimeout(timer);
  }, [mode, sizing, content, actualCount, itemWidth, itemHeight]);

  // Animation styles
  const rotatingWrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate3d(-50%, -50%, 0)",
    transformOrigin: "center",
    willChange: "transform",
    animationName: "rotate360",
    animationDuration: `${duration}s`,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationDirection: direction,
  };

  const radiusWrapperStyle: React.CSSProperties = {
    transform: `translateX(${radius}px)`,
    willChange: "transform",
  };

  // Calculate item rotation based on orientation mode
  let itemRotation = 0;
  if (orientation === "rotate") {
    if (rotationAlignment === "tangent") {
      itemRotation = 0;
    } else if (rotationAlignment === "radial") {
      itemRotation = 90;
    } else {
      itemRotation = fixedAngle;
    }
  }

  const renderItems = () => {
    return Array.from({ length: actualCount }).map((_, index) => {
      const offsetDegrees = index * 360 / (actualCount === 0 ? 1 : actualCount);
      const animationDelaySeconds = -(offsetDegrees / 360 * duration);

      const itemImage = images[index];
      const itemComponent = content[index];

      const itemStyle: React.CSSProperties = {
        ...(mode === "components" && sizing === "fit-content"
          ? { display: "inline-block" }
          : { width: itemWidth, height: itemHeight }),
        position: "relative",
        borderRadius: 8,
        overflow: "visible",
        animationName: orientation === "pin" ? "counterRotate360" : "none",
        animationDuration: `${duration}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDirection: direction,
        animationDelay: `${animationDelaySeconds}s`,
        animationPlayState: (pauseOnHover && isHovered) ? "paused" : "running",
        transform: orientation === "rotate" ? `rotate(${itemRotation}deg)` : "none",
        backgroundColor:
          (mode === "images" && !itemImage) ||
          (mode === "components" && !itemComponent)
            ? "rgba(243, 239, 255, 0.8)"
            : "transparent",
        backdropFilter:
          (mode === "images" && !itemImage) ? "blur(10px)" : "none",
        border:
          (mode === "images" && !itemImage) ||
          (mode === "components" && !itemComponent)
            ? "1.5px solid #9967FF"
            : "none",
      };

      const rotatingContainerStyle: React.CSSProperties = {
        ...rotatingWrapperStyle,
        animationDelay: `${animationDelaySeconds}s`,
        animationPlayState: (pauseOnHover && isHovered) ? "paused" : "running",
      };

      const childStyle: React.CSSProperties = {
        ...(sizing === "fixed"
          ? { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }
          : {}),
        ...(isValidElement(itemComponent) ? ((itemComponent as ReactElement<{ style?: React.CSSProperties }>).props?.style || {}) : {}),
      };

      return (
        <div key={index} style={rotatingContainerStyle}>
          <div style={radiusWrapperStyle}>
            <div style={itemStyle}>
              {mode === "images" ? (
                itemImage ? (
                  <img
                    src={itemImage}
                    alt={`Item ${index + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <PlaceholderMessage index={index} />
                )
              ) : isValidElement(itemComponent) ? (
                <div
                  ref={(el) => {
                    contentMeasureRefs.current[index] = el;
                  }}
                  style={{ position: "relative" }}
                >
                  {React.cloneElement(
                    itemComponent as ReactElement<{ style?: React.CSSProperties }>,
                    {
                      style: childStyle,
                    }
                  )}
                </div>
              ) : (
                <PlaceholderMessage index={index} />
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  // Calculate container dimensions
  const effectiveItemW =
    mode === "components" && sizing === "fit-content"
      ? Math.max(maxContentSize.width, 0)
      : itemWidth;
  const effectiveItemH =
    mode === "components" && sizing === "fit-content"
      ? Math.max(maxContentSize.height, 0)
      : itemHeight;

  const containerW = 2 * radius + effectiveItemW;
  const containerH = 2 * radius + effectiveItemH;

  return (
    <>
      <style>{`
        @keyframes rotate360 {
          from { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
          to { transform: translate3d(-50%, -50%, 0) rotate(360deg); }
        }
        @keyframes counterRotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
      <div
        style={{
          ...style,
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      >
        {renderItems()}
        <div
          ref={zoomProbeRef}
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "relative",
            width: containerW,
            height: containerH,
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>
    </>
  );
}

// Placeholder component for when no image/component is provided
function PlaceholderMessage({ index }: { index: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9967FF",
        fontSize: "0.875rem",
        textAlign: "center",
        padding: "0.5rem",
      }}
    >
      Item {index + 1}
    </div>
  );
}
