import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingShapeProps {
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
}

function FloatingSphere({ position, color, scale = 1, speed = 1 }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.rotation.x += 0.005 * speed
      meshRef.current.rotation.y += 0.005 * speed
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function FloatingTorus({ position, color, scale = 1, speed = 1 }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * speed) * 0.3
      meshRef.current.rotation.x += 0.003 * speed
      meshRef.current.rotation.z += 0.003 * speed
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

export default function FloatingGeometry() {
  return (
    <>
      <FloatingSphere position={[-4, 2, -3]} color="#06b6d4" scale={0.8} speed={0.5} />
      <FloatingSphere position={[4, -1, -2]} color="#8b5cf6" scale={1.2} speed={0.7} />
      <FloatingTorus position={[3, 3, -4]} color="#ec4899" scale={0.6} speed={0.4} />
      <FloatingTorus position={[-3, -2, -3]} color="#10b981" scale={0.9} speed={0.6} />
    </>
  )
}
