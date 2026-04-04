import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Color parsing utilities
function parseColorToRgba(input: string): { r: number; g: number; b: number; a: number } {
  if (!input) return { r: 0, g: 0, b: 0, a: 0 };

  const str = input.trim();

  // rgba(r, g, b, a)
  const rgbaMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255;
    const g = Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255;
    const b = Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255;
    const a = rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1;
    return { r, g, b, a };
  }

  // Hex with alpha (#RRGGBBAA)
  const hex8 = str.replace(/^#/, '');
  if (hex8.length === 8) {
    return {
      r: parseInt(hex8.slice(0, 2), 16) / 255,
      g: parseInt(hex8.slice(2, 4), 16) / 255,
      b: parseInt(hex8.slice(4, 6), 16) / 255,
      a: parseInt(hex8.slice(6, 8), 16) / 255,
    };
  }

  // Hex 6-digit (#RRGGBB)
  const hex6 = hex8;
  if (hex6.length === 6) {
    return {
      r: parseInt(hex6.slice(0, 2), 16) / 255,
      g: parseInt(hex6.slice(2, 4), 16) / 255,
      b: parseInt(hex6.slice(4, 6), 16) / 255,
      a: 1,
    };
  }

  // Hex 3-digit (#RGB)
  const hex3 = hex6;
  if (hex3.length === 3) {
    return {
      r: parseInt(hex3[0] + hex3[0], 16) / 255,
      g: parseInt(hex3[1] + hex3[1], 16) / 255,
      b: parseInt(hex3[2] + hex3[2], 16) / 255,
      a: 1,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

// Mapping functions
function mapLinear(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function mapSpeedUiToInternal(ui: number): number {
  return mapLinear(ui, 0.1, 1, 0.1, 5);
}

function mapThicknessUiToInternal(ui: number): number {
  return mapLinear(ui, 0.1, 1, 0.01, 0.2);
}

function mapDistortionUiToInternal(ui: number): number {
  return mapLinear(ui, 0, 1, 0, 0.2);
}

function mapFrequencyUiToInternal(ui: number): number {
  return mapLinear(ui, 0.1, 1, 0.1, 3);
}

function mapAmplitudeUiToInternal(ui: number): number {
  return mapLinear(ui, 0.1, 1, 0.1, 2);
}

interface WavePrismProps {
  /** Animation speed (0.1 to 1) */
  speed?: number;
  /** Beam thickness (0.1 to 1) */
  beamThickness?: number;
  /** Distortion amount (0 to 1) */
  distortion?: number;
  /** X-scale / frequency (0.1 to 1) */
  xScale?: number;
  /** Y-scale / amplitude (0.1 to 1) */
  yScale?: number;
  /** Glow multiplier (0 to 1) */
  glow?: number;
  /** Background color */
  backgroundColor?: string;
  /** Preview mode */
  preview?: boolean;
  /** Z-index offset */
  zIndex?: number;
  /** Style overrides */
  style?: React.CSSProperties;
}

/**
 * WavePrism - Animated wave prism effect using WebGL shaders
 *
 * Creates a beautiful chromatic wave animation with three color channels.
 * Perfect for hero backgrounds, loading screens, or visual accents.
 *
 * @example
 * ```tsx
 * <div style={{ height: 400, position: 'relative' }}>
 *   <WavePrism
 *     speed={0.5}
 *     beamThickness={0.25}
 *     distortion={0.3}
 *     xScale={0.5}
 *     yScale={0.4}
 *     glow={1}
 *     backgroundColor="#000000"
 *   />
 * </div>
 * ```
 */
function WavePrismScene({
  speed = 0.2,
  beamThickness = 0.25,
  distortion = 0.25,
  xScale = 0.2,
  yScale = 0.25,
  glow = 1,
  backgroundColor = '',
  preview = false,
}: WavePrismProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Parse background color
  const bgRgba = useMemo(() => parseColorToRgba(backgroundColor || 'transparent'), [backgroundColor]);

  // Store refs for uniforms
  const speedRef = useRef(mapSpeedUiToInternal(speed));
  const beamThicknessRef = useRef(mapThicknessUiToInternal(beamThickness));
  const distortionRef = useRef(mapDistortionUiToInternal(distortion));
  const xScaleRef = useRef(mapFrequencyUiToInternal(xScale));
  const yScaleRef = useRef(mapAmplitudeUiToInternal(yScale));
  const glowRef = useRef(glow);
  const previewRef = useRef(preview);

  // Update refs when props change
  useEffect(() => {
    speedRef.current = mapSpeedUiToInternal(speed);
  }, [speed]);

  useEffect(() => {
    beamThicknessRef.current = mapThicknessUiToInternal(beamThickness);
  }, [beamThickness]);

  useEffect(() => {
    distortionRef.current = mapDistortionUiToInternal(distortion);
  }, [distortion]);

  useEffect(() => {
    xScaleRef.current = mapFrequencyUiToInternal(xScale);
  }, [xScale]);

  useEffect(() => {
    yScaleRef.current = mapAmplitudeUiToInternal(yScale);
  }, [yScale]);

  useEffect(() => {
    glowRef.current = glow;
  }, [glow]);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  // Vertex shader
  const vertexShader = useMemo(
    () => `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    []
  );

  // Fragment shader - ported from Framer WavePrism
  const fragmentShader = useMemo(
    () => `
      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float yOffset;
      uniform float distortion;
      uniform float beamThickness;
      uniform float glow;

      void main() {
        // Cover mapping that fills the canvas while preserving aspect
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = beamThickness / abs((p.y + yOffset) + sin((rx + time) * xScale) * yScale);
        float g = beamThickness / abs((p.y + yOffset) + sin((gx + time) * xScale) * yScale);
        float b = beamThickness / abs((p.y + yOffset) + sin((bx + time) * xScale) * yScale);

        // Split low-intensity tails (halo) from bright core; only scale the halo
        vec3 wave = vec3(r, g, b);
        float haloCap = 2.0;
        vec3 halo = min(wave, vec3(haloCap));
        vec3 core = wave - halo;
        vec3 col = clamp(core + halo * glow, 0.0, 1.0);

        // Use a soft alpha derived from intensity
        float outAlpha = clamp(max(max(col.r, col.g), col.b) / 2.5, 0.0, 1.0);

        gl_FragColor = vec4(col, outAlpha);
      }
    `,
    []
  );

  // Create geometry (full-screen quad)
  const geometry = useMemo(() => {
    const positions = new Float32Array([
      -1, -1, 0,
       1, -1, 0,
      -1,  1, 0,
       1, -1, 0,
      -1,  1, 0,
       1,  1, 0,
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      resolution: { value: new THREE.Vector2(size.width, size.height) },
      time: { value: 0 },
      xScale: { value: xScaleRef.current },
      yScale: { value: yScaleRef.current },
      yOffset: { value: -1 },
      distortion: { value: distortionRef.current },
      beamThickness: { value: beamThicknessRef.current },
      glow: { value: glowRef.current },
    }),
    []
  );

  // Create material
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
      }),
    [vertexShader, fragmentShader, uniforms]
  );

  // Animation clock
  const clockRef = useRef(new THREE.Clock());

  useFrame(() => {
    if (!materialRef.current) return;

    const isCanvas = false; // We can't detect Framer canvas in this context
    if (isCanvas && !previewRef.current) {
      return; // Skip animation in canvas mode when preview is off
    }

    const deltaTime = clockRef.current.getDelta();
    uniforms.time.value += deltaTime * speedRef.current;

    // Update uniforms from refs
    uniforms.xScale.value = xScaleRef.current;
    uniforms.yScale.value = yScaleRef.current;
    uniforms.distortion.value = distortionRef.current;
    uniforms.beamThickness.value = beamThicknessRef.current;
    uniforms.glow.value = glowRef.current;
  });

  // Handle resize
  useEffect(() => {
    uniforms.resolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  return (
    <mesh ref={meshRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

/**
 * WavePrism Wrapper Component
 *
 * Provides a React component that renders the wave prism effect
 * using @react-three/fiber.
 */
export default function WavePrism({
  speed = 0.2,
  beamThickness = 0.25,
  distortion = 0.25,
  xScale = 0.2,
  yScale = 0.25,
  glow = 1,
  backgroundColor = '',
  preview = true,
  zIndex = 0,
  style,
}: WavePrismProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse background color for CSS
  const bgRgba = useMemo(() => parseColorToRgba(backgroundColor || 'transparent'), [backgroundColor]);
  const cssBackground = backgroundColor
    ? `rgba(${Math.round(bgRgba.r * 255)}, ${Math.round(bgRgba.g * 255)}, ${Math.round(bgRgba.b * 255)}, ${bgRgba.a})`
    : 'transparent';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: cssBackground,
        ...style,
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 10 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex,
        }}
      >
        <WavePrismScene
          speed={speed}
          beamThickness={beamThickness}
          distortion={distortion}
          xScale={xScale}
          yScale={yScale}
          glow={glow}
          backgroundColor={backgroundColor}
          preview={preview}
        />
      </Canvas>
    </div>
  );
}
