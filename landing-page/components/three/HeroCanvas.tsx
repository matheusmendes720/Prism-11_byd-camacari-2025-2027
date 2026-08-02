'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Z } from '@/lib/design-tokens';

function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Slow ambient rotation
  useMemo(() => {
    // nothing to memoize — Three.js handles this
  }, []);

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#FF1A1A"
        emissive="#FF1A1A"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export function HeroCanvas() {
  return (
    <div
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: Z.canvas }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: '#050505' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#FFD700" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#FF1A1A" />
        <HeroScene />
      </Canvas>
    </div>
  );
}
