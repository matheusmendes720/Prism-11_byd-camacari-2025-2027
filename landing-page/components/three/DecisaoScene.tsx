// landing-page/components/three/DecisaoScene.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { colors } from '@/lib/design-tokens';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

const AXES = [
  { label: 'Câmbio', value: 2.1, color: '#FF1A1A' },
  { label: 'Regulação', value: 1.8, color: '#FF8C00' },
  { label: 'Supply', value: 2.4, color: '#FFD700' },
  { label: 'Macro', value: 1.6, color: colors.matter.steel }
];

export function DecisaoScene({ mode }: SceneProps) {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!markerRef.current) return;
    const t = state.clock.elapsedTime;
    markerRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
  });

  const latticePoint: [number, number, number] = [
    AXES[0].value,
    AXES[1].value,
    AXES[2].value
  ];

  // Distance from origin determines color
  const distance = Math.sqrt(
    AXES.reduce((sum, a) => sum + a.value * a.value, 0)
  );
  const markerColor = distance < 2.5 ? '#FFD700' : distance < 4 ? '#FF8C00' : '#FF1A1A';

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#FFD700" intensity={0.5} />

      {/* Axis lines */}
      <axesHelper args={[3.5]} />

      {/* Axis labels */}
      {AXES.map((axis, i) => {
        const positions = [
          [3.8, 0, 0],
          [0, 3.8, 0],
          [0, 0, 3.8],
          [3.8, 3.8, 0]
        ];
        return (
          <Html key={i} position={positions[i] as [number, number, number]} center distanceFactor={10}>
            <div className="px-2 py-1 bg-bg-panel/80 rounded border border-border-subtle text-xs whitespace-nowrap">
              <span className="text-energy-yellow font-data">{axis.label}</span>
              <span className="ml-2 text-matter-white font-data">{axis.value.toFixed(1)}</span>
            </div>
          </Html>
        );
      })}

      {/* Lattice marker (current state) */}
      <mesh ref={markerRef} position={latticePoint}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#8A8A9E" />
      </mesh>

      {/* Composite score overlay */}
      <Html position={[0, -3.5, 0]} center>
        <div className="px-6 py-3 rounded-lg border border-energy-yellow/40 bg-bg-panel/80 backdrop-blur-md shadow-electric">
          <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data mb-1">
            Vulnerabilidade Agregada
          </div>
          <div className="text-3xl font-data text-energy-yellow">62 / 100</div>
          <div className="text-xs text-matter-steel mt-1">Faixa âmbar</div>
        </div>
      </Html>
    </group>
  );
}
