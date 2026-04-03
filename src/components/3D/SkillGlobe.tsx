// @ts-nocheck
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SkillData {
  name: string;
  level: number;
  category: string;
}

interface SkillGlobeProps {
  skills: SkillData[];
  size?: number;
  onSkillClick?: (skill: string, level: number) => void;
}

interface SkillNodeProps {
  position: [number, number, number];
  color: string;
  label: string;
  level: number;
  onClick?: (skill: string, level: number) => void;
}

function SkillNode({ position, color, label, level, onClick }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e: any) => {
          e.stopPropagation();
          onClick?.(label, level);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Label line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0.3, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} opacity={0.5} transparent />
      </line>
    </group>
  );
}

function SkillGlobeInner({ skills, size = 3, onSkillClick }: SkillGlobeProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const globeRef = useRef<THREE.Mesh>(null);

  // Generate skill nodes positioned on a sphere
  const skillPositions = useMemo(() => {
    const positions: Array<{ pos: [number, number, number]; skill: string; level: number; color: string }> = [];
    const categories: Record<string, string> = {
      Frontend: '#00ffff',
      Backend: '#ff00ff',
      Creative: '#ffff00',
      DevOps: '#00ff00',
    };

    skills.forEach((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const radius = (size ?? 3) * 0.9;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions.push({
        pos: [x, y, z],
        skill: skill.name,
        level: skill.level,
        color: categories[skill.category] || '#ffffff',
      });
    });

    return positions;
  }, [skills, size]);

  // Generate connecting lines between nearby skills
  const linesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const s = size ?? 3;

    for (let i = 0; i < skillPositions.length; i++) {
      for (let j = i + 1; j < skillPositions.length; j++) {
        const dist = Math.sqrt(
          Math.pow(skillPositions[i].pos[0] - skillPositions[j].pos[0], 2) +
          Math.pow(skillPositions[i].pos[1] - skillPositions[j].pos[1], 2) +
          Math.pow(skillPositions[i].pos[2] - skillPositions[j].pos[2], 2)
        );

        if (dist < s * 0.4) {
          positions.push(
            ...skillPositions[i].pos,
            ...skillPositions[j].pos
          );
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [skillPositions, size]);

  // Mouse movement parallax
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    // Smooth rotation based on mouse
    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.3;

    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
      globeRef.current.rotation.x += (targetY - globeRef.current.rotation.x) * 0.05;
      globeRef.current.rotation.z += (targetX - globeRef.current.rotation.z) * 0.05;
    }

    // Particle animation
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= 0.0005;
    }
  });

  const s = size ?? 3;
  return (
    <group>
      {/* Wireframe globe */}
      <sphere ref={globeRef} args={[s, 32, 32]} scale={0.95}>
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.1}
        />
      </sphere>

      {/* Inner glow sphere */}
      <Sphere args={[s * 0.95, 64, 64]}>
        <meshBasicMaterial
          color="#001a33"
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Connecting lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#00ffff" opacity={0.2} transparent />
      </lineSegments>

      {/* Skill nodes */}
      {skillPositions.map((item, i) => (
        <SkillNode
          key={i}
          position={item.pos}
          color={item.color}
          label={item.skill}
          level={item.level}
          onClick={onSkillClick}
        />
      ))}

      {/* Atmospheric particles */}
      <Points ref={pointsRef} positions={new Float32Array(500).map(() => Math.random() * s * 1.5)}>
        <PointMaterial
          color="#00ffff"
          size={0.02}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </Points>
    </group>
  );
}

export default function SkillGlobe({ skills, size = 3, onSkillClick }: SkillGlobeProps) {
  // Skills are already flat array, just pass them through
  const displaySkills = useMemo(() => skills.slice(0, 30), [skills]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />

        <SkillGlobeInner
          skills={flattenedSkills.slice(0, 30)}
          size={size}
          onSkillClick={onSkillClick}
        />

        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
