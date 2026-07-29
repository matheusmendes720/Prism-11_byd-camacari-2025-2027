import clsx from 'clsx';
import { gradients } from '@/lib/design-tokens';

interface KpiNodeProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  className?: string;
}

export function KpiNode({ label, value, trend, trendDirection = 'flat', className }: KpiNodeProps) {
  const arrow = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';

  return (
    <div
      role="figure"
      aria-label={`${label}: ${value}${trend ? `. Variação: ${trend}` : ''}`}
      className={clsx('inline-flex flex-col px-4 py-3 rounded-lg border border-energy-yellow/30 bg-bg-panel/70 backdrop-blur-md shadow-electric min-w-[160px]', className)}
    >
      <span className="text-[10px] uppercase tracking-wider text-matter-steel font-data">{label}</span>
      <span className="text-2xl font-data text-matter-white mt-1">{value}</span>
      {trend && (
        <span
          className="text-xs font-data mt-1"
          style={{ background: gradients.energyFlow, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          {arrow} {trend}
        </span>
      )}
    </div>
  );
}
