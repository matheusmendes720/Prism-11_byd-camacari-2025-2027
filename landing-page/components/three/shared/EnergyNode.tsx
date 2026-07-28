'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface EnergyNodeProps {
  position: [number, number, number];
  radius?: number;
  color?: string;
  pulseSpeed?: number;
  label?: string;
}

export function EnergyNode({
  position,
  radius = 1,
  color = '#FF1A1A',
  pulseSpeed = 2,
  label
}: EnergyNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {label && (
        <Html center distanceFactor={10} occlude="blending">
          <div className="px-3 py-1 rounded border border-energy-yellow/30 bg-bg-panel/80 backdrop-blur-sm text-xs text-matter-white whitespace-nowrap font-data">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
