'use client';

import { EnergyNode } from './shared/EnergyNode';
import { TubeLine } from './shared/TubeLine';
import { content } from '@/lib/content';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

const NODE_POSITIONS: [number, number, number][] = [
  [-3, 0, 0],
  [0, 1.5, 0],
  [3, 0, 0]
];

export function ProvaScene({ mode }: SceneProps) {
  const nodes = content.prova.nodes;
  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} color="#FF1A1A" intensity={0.6} />

      {nodes.slice(0, 3).map((node, i) => (
        <EnergyNode
          key={i}
          position={NODE_POSITIONS[i]}
          radius={1}
          color={i === 0 ? '#FF1A1A' : i === 1 ? '#FF8C00' : '#FFD700'}
          pulseSpeed={2}
          label={`${node.value}`}
        />
      ))}

      {/* Connecting lines */}
      <TubeLine start={NODE_POSITIONS[0]} end={NODE_POSITIONS[1]} color="#FFD700" />
      <TubeLine start={NODE_POSITIONS[1]} end={NODE_POSITIONS[2]} color="#FF1A1A" />
      <TubeLine start={NODE_POSITIONS[0]} end={NODE_POSITIONS[2]} color="#FF8C00" />
    </group>
  );
}
