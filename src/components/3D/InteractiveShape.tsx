// @ts-nocheck
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveShapeProps {
  scrollY: number;
  position?: [number, number, number];
  color?: string;
}

function MorphingShape({ scrollY, color = '#06b6d4' }: InteractiveShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // Use scrollY value for distortion
  const distortion = useMemo(() => {
    return 0.4 + Math.abs(Math.sin(scrollY * 0.01)) * 0.6;
  }, [scrollY]);

  // Morph based on scroll
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distortion}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function RotatingTorus({ scrollY, color = '#8b5cf6' }: InteractiveShapeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      // Add scroll-based rotation
      groupRef.current.rotation.z = scrollY * 0.002;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <Torus args={[1, 0.3, 32, 100]}>
          <meshStandardMaterial
            color={color}
            roughness={0.1}
            metalness={0.9}
            wireframe={false}
          />
        </Torus>
      </Float>
    </group>
  );
}

function WireframeBox({ scrollY, color = '#ec4899' }: InteractiveShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.8}>
      <Box ref={meshRef} args={[1.8, 1.8, 1.8]}>
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.6}
        />
      </Box>
    </Float>
  );
}

export default function InteractiveShape({ scrollY = 0 }: { scrollY: number }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <spotLight
          position={[5, 5, 5]}
          angle={0.5}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <MorphingShape scrollY={scrollY} color="#06b6d4" />
        <RotatingTorus scrollY={scrollY} color="#8b5cf6" />
        <WireframeBox scrollY={scrollY} color="#ec4899" />

        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#0a0a0a', 8, 15]} />
      </Canvas>
    </div>
  );
}
