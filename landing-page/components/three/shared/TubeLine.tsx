'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  radius?: number;
  animated?: boolean;
}

export function TubeLine({
  start,
  end,
  color = '#FFD700',
  radius = 0.02,
  animated = true
}: TubeLineProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = startVec.clone().lerp(endVec, 0.5);
    midPoint.y += 0.5;
    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, radius, 8, false), [curve, radius]);

  useFrame((state) => {
    if (!animated || !meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}
