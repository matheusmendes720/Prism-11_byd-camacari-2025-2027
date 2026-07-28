'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { shouldUse3D, type ThreeMode } from '@/lib/three-support';
import { useScrollProgress } from '@/components/providers/ScrollProvider';
import { HeroCarScene } from './HeroCarScene';
import { ProblemaScene } from './ProblemaScene';
import { AnaliseScene } from './AnaliseScene';
import { DecisaoScene } from './DecisaoScene';
import { ProvaScene } from './ProvaScene';
import { CTAScene } from './CTAScene';
import { FooterScene } from './FooterScene';

const SCENES = [HeroCarScene, ProblemaScene, AnaliseScene, DecisaoScene, ProvaScene, CTAScene, FooterScene];

export function Scene() {
  const [mode, setMode] = useState<ThreeMode>('none');
  const [mounted, setMounted] = useState(false);
  const { activeSection } = useScrollProgress();

  useEffect(() => {
    setMode(shouldUse3D());
    setMounted(true);
  }, []);

  if (!mounted || mode === 'none') return null;

  const ActiveScene = SCENES[activeSection] ?? SCENES[0];
  const dpr = mode === 'lite' ? [1, 1.5] as [number, number] : [1, 2] as [number, number];

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: mode === 'full', alpha: true, powerPreference: 'high-performance' }}
        frameloop={mode === 'lite' ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <ActiveScene mode={mode} />
      </Canvas>
    </div>
  );
}
