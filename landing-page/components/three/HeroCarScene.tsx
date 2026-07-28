// landing-page/components/three/HeroCarScene.tsx
'use client';

import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Particles } from './shared/Particles';
import { KPIHtmlCard } from './shared/KPIHtmlCard';
import { TubeLine } from './shared/TubeLine';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function CarModel({ mode }: SceneProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/byd-seal.glb');

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={ref} scale={mode === 'lite' ? 1.5 : 2}>
      <primitive object={scene} />
    </group>
  );
}

export function HeroCarScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 3, 5]} color="#FF1A1A" intensity={1.2} />
      <pointLight position={[-5, 1, 3]} color="#FFD700" intensity={0.8} />

      <Suspense fallback={null}>
        <CarModel mode={mode} />
      </Suspense>

      <Particles count={mode === 'lite' ? 200 : 200} radius={6} mode={mode} />

      <KPIHtmlCard
        position={[-3, 1.5, 0]}
        label="PTAX vol 6m"
        value="±12.3%"
        trend="+3.2pp"
        ariaLabel="Volatilidade PTAX 6 meses: 12.3 por cento. Variação: mais 3.2 pontos percentuais"
      />
      <KPIHtmlCard
        position={[3, -1, 0]}
        label="ViE base"
        value="R$ 1.2bi"
        trend="±R$ 287Mi"
        ariaLabel="Valor em risco esperado base: R$ 1.2 bilhão. Variação: mais ou menos R$ 287 milhões"
      />

      <TubeLine start={[-3, 1.5, 0]} end={[3, -1, 0]} color="#FFD700" />
    </group>
  );
}

useGLTF.preload('/models/byd-seal.glb');
