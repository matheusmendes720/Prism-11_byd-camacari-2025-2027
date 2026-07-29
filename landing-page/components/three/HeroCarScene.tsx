// landing-page/components/three/HeroCarScene.tsx
'use client';

import { Component, Suspense, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { colors } from '@/lib/design-tokens';
import { Particles } from './shared/Particles';
import { KPIHtmlCard } from './shared/KPIHtmlCard';
import { TubeLine } from './shared/TubeLine';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

/**
 * Catches GLB load failures (404, parse errors) so a missing model doesn't
 * take down the whole Canvas. Renders a stylized placeholder instead.
 */
class GLBErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    /* swallow — fallback already in state */
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function PlaceholderCar({ mode }: SceneProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });
  // Wireframe silhouette + emissive sphere — keeps the hero alive
  // until Task 25 lands the real GLB.
  return (
    <group ref={ref} scale={mode === 'lite' ? 1.5 : 2}>
      <mesh>
        <boxGeometry args={[1.6, 0.5, 3.2]} />
        <meshStandardMaterial
          color={colors.matter.steel}
          emissive={colors.energy.red}
          emissiveIntensity={0.15}
          wireframe
        />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial
          color={colors.energy.yellow}
          emissive={colors.energy.yellow}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
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

      <GLBErrorBoundary fallback={<PlaceholderCar mode={mode} />}>
        <Suspense fallback={<PlaceholderCar mode={mode} />}>
          <CarModel mode={mode} />
        </Suspense>
      </GLBErrorBoundary>

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
