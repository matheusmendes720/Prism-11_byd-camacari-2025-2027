// landing-page/components/three/shared/Particles.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ThreeMode = 'full' | 'lite' | 'none';

interface ParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
  secondaryColor?: string;
  mode?: ThreeMode;
}

export function Particles({
  count = 1000,
  radius = 8,
  color = '#FF1A1A',
  secondaryColor = '#FFD700',
  mode = 'full'
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);
  const effectiveCount = mode === 'lite' ? Math.floor(count / 5) : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(effectiveCount * 3);
    const col = new Float32Array(effectiveCount * 3);
    const colorObj = new THREE.Color(color);
    const secondaryObj = new THREE.Color(secondaryColor);

    for (let i = 0; i < effectiveCount; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const useSecondary = Math.random() > 0.7;
      const c = useSecondary ? secondaryObj : colorObj;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [effectiveCount, radius, color, secondaryColor]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
