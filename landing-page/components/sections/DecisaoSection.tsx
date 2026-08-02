'use client';

// 3-col: 2 recommendation cards + radial SVG score gauge
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { colors } from '@/lib/design-tokens';

function ScoreGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 40; // r=40 → 251.2
  const filled = (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 65 ? colors.energy.yellow : colors.energy.red;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#1F1F26" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data text-5xl font-bold text-f5f5f5">{score}</span>
        <span className="text-[10px] text-[#52525B] font-mono mt-1">/100</span>
      </div>
    </div>
  );
}

export function DecisaoSection() {
  const { recomendacoes, compositeScore } = content.decisao;

  return (
    <section id="decisao" className="relative min-h-[100dvh] flex flex-col justify-center px-6 py-24 bg-bg-void">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow + header */}
        <div className="mb-10">
          <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-3">
            {content.decisao.eyebrow}
          </p>
          <h2 className="font-narrative text-4xl md:text-5xl font-bold text-f5f5f5 mb-3">
            {content.decisao.h2}
          </h2>
          <p className="text-base text-[#9CA3AF] max-w-xl">{content.decisao.sub}</p>
        </div>

        {/* 3-col grid: 2 rec cards (col-span-2) + score gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {recomendacoes.map((rec, i) => {
              const [se, entao] = rec.split(' ENTÃO ');
              const borderColor = i === 0 ? colors.energy.red : colors.energy.yellow;
              return (
                <Card key={i} className="p-5" style={{ borderLeft: `4px solid ${borderColor}` }}>
                  <p className="text-xs font-mono text-[#52525B] mb-2">
                    {i === 0 ? 'SE...' : i === 1 ? 'OU...' : 'E SE...'}
                  </p>
                  <p className="font-narrative text-f5f5f5 leading-relaxed">
                    <span className="text-energy-yellow font-bold">{se}</span>
                    <span className="text-[#9CA3AF]"> Então: </span>
                    <span>{entao}</span>
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Score gauge */}
          <Card className="flex flex-col items-center justify-center p-6">
            <ScoreGauge score={compositeScore} />
            <p className="mt-4 text-xs text-[#52525B] text-center font-mono">
              {content.decisao.compositeLabel}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
