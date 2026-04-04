import { useRef, useEffect, useMemo } from 'react';
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
  const clamped = Math.max(0.1, Math.min(1, ui));
  return mapLinear(clamped, 0.1, 1, 1, 10);
}

function mapBandWidthUiToInternal(ui: number): number {
  const clamped = Math.max(0.1, Math.min(1, ui));
  return mapLinear(clamped, 0.1, 1, 2, 60);
}

function mapFlowToSign(flow: 'in-out' | 'out-in'): number {
  return flow === 'out-in' ? -1 : 1;
}

interface ShaderLinesProps {
  /** Animation speed (0.1 to 1) */
  speed?: number;
  /** Band width (0.1 to 1) */
  bandWidth?: number;
  /** Flow direction */
  flow?: 'in-out' | 'out-in';
  /** Color mode */
  colorMode?: 'single' | 'spectrum';
  /** Single color (used when colorMode is "single") */
  color?: string;
  /** Spectrum color 1 (red channel) */
  color1?: string;
  /** Spectrum color 2 (green channel) */
  color2?: string;
  /** Spectrum color 3 (blue channel) */
  color3?: string;
  /** Background color */
  backgroundColor?: string;
  /** Blend mode */
  blendMode?: 'alpha' | 'additive';
  /** Preview mode (for Framer canvas) */
  preview?: boolean;
  /** Z-index offset */
  zIndex?: number;
  /** Style overrides */
  style?: React.CSSProperties;
}

/**
 * ShaderLines - An animated WebGL background with flowing colored lines
 *
 * Uses Three.js with custom GLSL shaders to create a dynamic noise-based
 * animated line effect. Perfect for hero backgrounds or visual interest.
 *
 * @example
 * ```tsx
 * <div style={{ height: 500, position: 'relative' }}>
 *   <ShaderLines
 *     speed={0.5}
 *     colorMode="spectrum"
 *     backgroundColor="#000000"
 *   />
 * </div>
 * ```
 */
function ShaderLinesScene({
  speed = 0.5,
  bandWidth = 0.5,
  flow = 'in-out',
  colorMode = 'single',
  color = '#ffffff',
  color1 = '#0008FF',
  color2 = '#000000',
  color3 = '#70EAFF',
  backgroundColor = '#000000',
  blendMode = 'additive',
  preview = false,
}: ShaderLinesProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Convert colors to RGBA arrays
  const bgRgba = useMemo(() => parseColorToRgba(backgroundColor), [backgroundColor]);
  const colorRgba = useMemo(() => parseColorToRgba(color), [color]);
  const color1Rgba = useMemo(() => parseColorToRgba(color1), [color1]);
  const color2Rgba = useMemo(() => parseColorToRgba(color2), [color2]);
  const color3Rgba = useMemo(() => parseColorToRgba(color3), [color3]);

  // Store refs for uniforms that need to be updated
  const speedRef = useRef(mapSpeedUiToInternal(speed));
  const bandWidthRef = useRef(mapBandWidthUiToInternal(bandWidth));
  const flowSignRef = useRef(mapFlowToSign(flow));
  const colorModeRef = useRef(colorMode);
  const blendModeRef = useRef(blendMode);
  const previewRef = useRef(preview);

  const backgroundColorRef = useRef<[number, number, number, number]>([bgRgba.r, bgRgba.g, bgRgba.b, bgRgba.a]);
  const colorRef = useRef<[number, number, number, number]>([colorRgba.r, colorRgba.g, colorRgba.b, colorRgba.a]);
  const color1Ref = useRef<[number, number, number, number]>([color1Rgba.r, color1Rgba.g, color1Rgba.b, color1Rgba.a]);
  const color2Ref = useRef<[number, number, number, number]>([color2Rgba.r, color2Rgba.g, color2Rgba.b, color2Rgba.a]);
  const color3Ref = useRef<[number, number, number, number]>([color3Rgba.r, color3Rgba.g, color3Rgba.b, color3Rgba.a]);

  // Update refs when props change
  useEffect(() => {
    speedRef.current = mapSpeedUiToInternal(speed);
  }, [speed]);

  useEffect(() => {
    bandWidthRef.current = mapBandWidthUiToInternal(bandWidth);
  }, [bandWidth]);

  useEffect(() => {
    flowSignRef.current = mapFlowToSign(flow);
  }, [flow]);

  useEffect(() => {
    colorModeRef.current = colorMode;
  }, [colorMode]);

  useEffect(() => {
    blendModeRef.current = blendMode;
  }, [blendMode]);

  useEffect(() => {
    previewRef.current = preview;
  }, [preview]);

  useEffect(() => {
    backgroundColorRef.current = [bgRgba.r, bgRgba.g, bgRgba.b, bgRgba.a];
  }, [bgRgba]);

  useEffect(() => {
    colorRef.current = [colorRgba.r, colorRgba.g, colorRgba.b, colorRgba.a];
  }, [colorRgba]);

  useEffect(() => {
    color1Ref.current = [color1Rgba.r, color1Rgba.g, color1Rgba.b, color1Rgba.a];
  }, [color1Rgba]);

  useEffect(() => {
    color2Ref.current = [color2Rgba.r, color2Rgba.g, color2Rgba.b, color2Rgba.a];
  }, [color2Rgba]);

  useEffect(() => {
    color3Ref.current = [color3Rgba.r, color3Rgba.g, color3Rgba.b, color3Rgba.a];
  }, [color3Rgba]);

  // Vertex shader
  const vertexShader = useMemo(
    () => `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    []
  );

  // Fragment shader - ported from the Framer component
  const fragmentShader = useMemo(
    () => `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform float bandWidthPx;
      uniform vec4 backgroundColor;
      uniform vec4 color;
      uniform vec4 color1;
      uniform vec4 color2;
      uniform vec4 color3;
      uniform float colorMode;
      uniform float blendMode;

      float random (in float x) {
        return fract(sin(x) * 1e4);
      }

      float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        // Quantize X in DEVICE pixels for consistent visual width across resolutions
        float bandCenterPx = floor(gl_FragCoord.x / bandWidthPx) * bandWidthPx + bandWidthPx * 0.5;
        uv.x = (bandCenterPx * 2.0 - resolution.x) / min(resolution.x, resolution.y);

        float t = time * 0.06 + random(uv.x) * 0.4;
        float lineWidth = 0.0008;

        vec3 colorIntensity = vec3(0.0);
        for (int j = 0; j < 3; j++) {
          for (int i = 0; i < 5; i++) {
            colorIntensity[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 1.0 - length(uv));
          }
        }

        vec3 finalColor;
        float finalAlpha;

        if (colorMode < 0.5) {
          // Single color mode
          finalColor = colorIntensity * color.rgb;
          finalAlpha = color.a;
        } else {
          // Spectrum mode
          finalColor = vec3(0.0);
          finalColor += colorIntensity.r * color1.rgb;
          finalColor += colorIntensity.g * color2.rgb;
          finalColor += colorIntensity.b * color3.rgb;
          finalAlpha = (color1.a + color2.a + color3.a) / 3.0;
        }

        // Calculate ray intensity for alpha blending
        float rayIntensity = max(max(finalColor.r, finalColor.g), finalColor.b);

        // Ensure minimum visibility
        if (rayIntensity < 0.01) {
          finalColor = color.rgb * 0.1;
          rayIntensity = 0.1;
        }

        vec3 bgColor = backgroundColor.rgb;
        float bgAlpha = backgroundColor.a;

        vec3 blendedColor;
        float outputAlpha;

        if (blendMode < 0.5) {
          // Alpha blending
          blendedColor = finalColor.rgb * rayIntensity + bgColor * bgAlpha * (1.0 - rayIntensity);
          outputAlpha = rayIntensity + bgAlpha * (1.0 - rayIntensity);
        } else {
          // Additive blending
          blendedColor = finalColor.rgb + bgColor * bgAlpha;
          outputAlpha = 1.0;
        }

        gl_FragColor = vec4(blendedColor, outputAlpha);
      }
    `,
    []
  );

  // Create geometry and material
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(size.width, size.height) },
      bandWidthPx: { value: bandWidthRef.current * (window.devicePixelRatio || 1) },
      backgroundColor: { value: new THREE.Vector4(...backgroundColorRef.current) },
      color: { value: new THREE.Vector4(...colorRef.current) },
      color1: { value: new THREE.Vector4(...color1Ref.current) },
      color2: { value: new THREE.Vector4(...color2Ref.current) },
      color3: { value: new THREE.Vector4(...color3Ref.current) },
      colorMode: { value: colorModeRef.current === 'single' ? 0 : 1 },
      blendMode: { value: blendModeRef.current === 'alpha' ? 0 : 1 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
    [uniforms, vertexShader, fragmentShader]
  );

  // Animation loop
  const clockRef = useRef(new THREE.Clock());
  const lastTimeRef = useRef(0);

  useFrame(() => {
    if (!materialRef.current) return;

    const currentTime = clockRef.current.getElapsedTime();
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Skip animation in Framer canvas when preview is off
    // (We can't detect Framer canvas here, so we always animate)

    // Update time uniform
    uniforms.time.value += deltaTime * speedRef.current * flowSignRef.current;

    // Update band width in device pixels
    const pixelRatio = window.devicePixelRatio || 1;
    uniforms.bandWidthPx.value = bandWidthRef.current * pixelRatio;

    // Update color uniforms
    uniforms.backgroundColor.value.set(...backgroundColorRef.current);
    uniforms.color.value.set(...colorRef.current);
    uniforms.color1.value.set(...color1Ref.current);
    uniforms.color2.value.set(...color2Ref.current);
    uniforms.color3.value.set(...color3Ref.current);
    uniforms.colorMode.value = colorModeRef.current === 'single' ? 0 : 1;
    uniforms.blendMode.value = blendModeRef.current === 'alpha' ? 0 : 1;
  });

  // Handle resize
  useEffect(() => {
    if (!materialRef.current) return;

    uniforms.resolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
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
 * ShaderLines Wrapper Component
 *
 * Provides a React component that renders the WebGL shader background
 * using @react-three/fiber.
 */
export default function ShaderLines({
  speed = 0.5,
  bandWidth = 0.5,
  flow = 'in-out',
  colorMode = 'single',
  color = '#ffffff',
  color1 = '#0008FF',
  color2 = '#000000',
  color3 = '#70EAFF',
  backgroundColor = '#000000',
  blendMode = 'additive',
  preview = true,
  zIndex = 0,
  style,
}: ShaderLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex,
        }}
      >
        <ShaderLinesScene
          speed={speed}
          bandWidth={bandWidth}
          flow={flow}
          colorMode={colorMode}
          color={color}
          color1={color1}
          color2={color2}
          color3={color3}
          backgroundColor={backgroundColor}
          blendMode={blendMode}
          preview={preview}
        />
      </Canvas>
    </div>
  );
}
