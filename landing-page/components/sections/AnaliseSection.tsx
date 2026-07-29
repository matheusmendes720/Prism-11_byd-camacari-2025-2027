// landing-page/components/sections/AnaliseSection.tsx
'use client';

import { content } from '@/lib/content';
import { trackEvent } from '@/lib/plausible-events';

export function AnaliseSection() {
  return (
    <section id="analise" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.analise.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel max-w-2xl">{content.analise.sub}</p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.analise.notebooks.map((nb) => (
            <button
              key={nb.id}
              onMouseEnter={() => trackEvent('notebook_hover', { id: nb.id })}
              onClick={() => trackEvent('notebook_click', { id: nb.id })}
              className="text-left p-4 rounded-lg border border-border-subtle bg-bg-panel/60 hover:border-energy-yellow/50 hover:shadow-electric transition-all"
            >
              <div className="text-[10px] text-energy-yellow font-data mb-1">{nb.id}</div>
              <div className="text-sm font-narrative text-matter-white font-bold leading-tight mb-2">
                {nb.title}
              </div>
              <div className="text-[10px] text-matter-steel font-data">{nb.method}</div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-matter-steel">{content.analise.microcopy}</p>
      </div>
    </section>
  );
}
