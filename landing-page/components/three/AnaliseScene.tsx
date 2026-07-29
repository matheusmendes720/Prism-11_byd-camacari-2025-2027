'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '@/lib/content';
import { colors } from '@/lib/design-tokens';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function NotebookCard({
  position,
  id,
  title,
  method,
  question
}: {
  position: [number, number, number];
  id: string;
  title: string;
  method: string;
  question: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#FFD700' : '#1F1F26'}
          emissive={hovered ? '#FF8C00' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <Html position={[0, 0, 0.06]} center transform occlude>
        <div className="w-44 p-3 text-center">
          <div className="text-[10px] text-energy-yellow font-data mb-1">{id}</div>
          <div className="text-sm font-narrative text-matter-white font-bold leading-tight mb-2">
            {title}
          </div>
          <div className="text-[10px] text-matter-steel font-data mb-2">{method}</div>
          <div className="text-[10px] text-matter-white/70 leading-snug">
            {hovered ? question : '—'}
          </div>
        </div>
      </Html>
    </group>
  );
}

export function AnaliseScene({ mode }: SceneProps) {
  const notebooks = content.analise.notebooks;
  const cols = 4;
  const spacing = 2.6;

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} color={colors.matter.steel} intensity={0.4} />

      {notebooks.map((nb, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacing;
        const y = (1 - row) * spacing - 1;
        return (
          <NotebookCard
            key={nb.id}
            position={[x, y, 0]}
            id={nb.id}
            title={nb.title}
            method={nb.method}
            question={nb.question}
          />
        );
      })}
    </group>
  );
}
