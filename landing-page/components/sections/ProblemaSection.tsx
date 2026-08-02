'use client';

// 3-col bento grid — per taste-skill Phase F §4.7
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

export function ProblemaSection() {
  return (
    <section id="problema" className="relative min-h-[100dvh] flex flex-col justify-center px-6 py-24 bg-bg-void">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow + header */}
        <div className="mb-10">
          <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-3">
            {content.problema.eyebrow}
          </p>
          <h2 className="font-narrative text-4xl md:text-5xl font-bold text-f5f5f5 mb-3">
            {content.problema.h2}
          </h2>
          <p className="text-base text-[#9CA3AF] max-w-xl">{content.problema.sub}</p>
        </div>

        {/* 3-col bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.problema.cards.map((card, i) => (
            <Card key={i} glow={i === 1} className="p-5">
              <h3 className="font-narrative text-lg text-f5f5f5 font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{card.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
