import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticleBackgroundProps {
  count?: number
  color?: string
  size?: number
  speed?: number
}

function Particles({ count = 2000, color = '#06b6d4', size = 0.02, speed = 1 }) {
  const points = useRef<THREE.Points>(null)
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      velocities[i3] = (Math.random() - 0.5) * 0.001 * speed
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.001 * speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001 * speed
    }

    return [positions, velocities]
  }, [count, speed])

  useFrame(() => {
    if (points.current) {
      const positions = points.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]

        // Wrap around
        if (Math.abs(positions[i3]) > 5) velocities[i3] *= -1
        if (Math.abs(positions[i3 + 1]) > 5) velocities[i3 + 1] *= -1
        if (Math.abs(positions[i3 + 2]) > 5) velocities[i3 + 2] *= -1
      }

      points.current.geometry.attributes.position.needsUpdate = true
      points.current.rotation.y += 0.0005 * speed
    }
  })

  return (
    <Points ref={points} positions={positions}>
      <PointMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function ParticleBackground({ count = 2000, color = '#06b6d4', size = 0.03, speed = 1 }: ParticleBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles count={count} color={color} size={size} speed={speed} />
      </Canvas>
    </div>
  )
}
