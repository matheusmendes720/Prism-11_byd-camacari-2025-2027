'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Particles } from './shared/Particles';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

export function CTAScene({ mode }: SceneProps) {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!torusRef.current) return;
    torusRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} color="#FF1A1A" intensity={1} />

      <mesh ref={torusRef}>
        <torusGeometry args={[3, 0.3, 32, 100]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      <Particles count={mode === 'lite' ? 200 : 1000} radius={6} mode={mode} />
    </group>
  );
}
