'use client';

import { Particles } from './shared/Particles';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

export function FooterScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <Particles count={mode === 'lite' ? 50 : 50} radius={8} mode={mode} />
    </group>
  );
}
