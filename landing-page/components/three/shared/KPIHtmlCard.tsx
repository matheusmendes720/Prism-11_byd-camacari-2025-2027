'use client';

import { Html } from '@react-three/drei';

interface KPIHtmlCardProps {
  position: [number, number, number];
  label: string;
  value: string;
  trend?: string;
  ariaLabel?: string;
}

export function KPIHtmlCard({ position, label, value, trend, ariaLabel }: KPIHtmlCardProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      occlude="blending"
      zIndexRange={[10, 0]}
    >
      <div
        role="figure"
        aria-label={ariaLabel ?? `${label}: ${value}${trend ? `. Variação: ${trend}` : ''}`}
        className="px-4 py-3 rounded-lg border border-energy-yellow/30 bg-bg-panel/70 backdrop-blur-md shadow-electric min-w-[160px]"
      >
        <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data">
          {label}
        </div>
        <div className="text-2xl font-data text-matter-white mt-1">
          {value}
        </div>
        {trend && (
          <div className="text-xs font-data bg-gradient-energy-flow bg-clip-text text-transparent mt-1">
            {trend}
          </div>
        )}
      </div>
    </Html>
  );
}
