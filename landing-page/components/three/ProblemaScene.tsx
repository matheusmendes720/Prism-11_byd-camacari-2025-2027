'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function Cylinder3D({
  position,
  height,
  color,
  label
}: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <cylinderGeometry args={[0.5, 0.5, height, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <Html position={[0, height / 2 + 0.5, 0]} center distanceFactor={10}>
        <div className="px-2 py-1 text-xs bg-bg-panel/80 backdrop-blur-sm border border-border-subtle rounded text-matter-white whitespace-nowrap font-data">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function ProblemaScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} color="#FFD700" intensity={0.6} />
      <gridHelper args={[20, 20, '#1F1F26', '#1F1F26']} position={[0, -2, 0]} />

      <Cylinder3D position={[-3, 0, 0]} height={2} color="#FF1A1A" label="Câmbio" />
      <Cylinder3D position={[0, 0, 0]} height={1.6} color="#FF8C00" label="Regulação" />
      <Cylinder3D position={[3, 0, 0]} height={2.4} color="#FFD700" label="Supply" />

      {/* Triangular connection lines */}
      {[[-3, 0, 0], [0, 0, 0], [3, 0, 0]].map((start, i, arr) => {
        const end = arr[(i + 1) % arr.length];
        const points = [
          new THREE.Vector3(...(start as [number, number, number])),
          new THREE.Vector3(...(end as [number, number, number]))
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#8A8A9E" transparent opacity={0.4} />
          </line>
        );
      })}
    </group>
  );
}
