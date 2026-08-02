'use client';

// 4-col notebook selector grid
import { content } from '@/lib/content';

export function AnaliseSection() {
  return (
    <section id="analise" className="relative min-h-[100dvh] flex flex-col justify-center px-6 py-24 bg-bg-void">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow + header */}
        <div className="mb-10">
          <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-3">
            {content.analise.eyebrow}
          </p>
          <h2 className="font-narrative text-4xl md:text-5xl font-bold text-f5f5f5 mb-3">
            {content.analise.h2}
          </h2>
          <p className="text-base text-[#9CA3AF] max-w-xl">{content.analise.sub}</p>
        </div>

        {/* 4-col notebook selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {content.analise.notebooks.map((nb) => (
            <button
              key={nb.id}
              className="text-left p-4 rounded-xl border bg-bg-panel/60 hover:border-energy-yellow/60 transition-all group"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-energy-yellow font-mono">{nb.id}</span>
                <span className="text-[10px] text-energy-yellow font-mono opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              </div>
              <div className="text-sm font-narrative text-f5f5f5 font-bold leading-tight mb-1">
                {nb.title}
              </div>
              <div className="text-[10px] text-[#52525B] font-mono mb-2">{nb.method}</div>
              <div className="text-[10px] text-[#52525B] leading-snug">{nb.question}</div>
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs text-[#52525B]">{content.analise.microcopy}</p>
      </div>
    </section>
  );
}
