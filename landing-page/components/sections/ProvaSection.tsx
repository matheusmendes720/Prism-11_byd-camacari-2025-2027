'use client';

// Asymmetric KPI bento — per taste-skill Phase F §4.9
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

export function ProvaSection() {
  return (
    <section id="prova" className="relative min-h-[100dvh] flex flex-col justify-center px-6 py-24 bg-bg-void">
      <div className="max-w-6xl mx-auto w-full">
        {/* Eyebrow + header */}
        <div className="mb-10">
          <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-3">
            {content.prova.eyebrow}
          </p>
          <h2 className="font-narrative text-4xl md:text-5xl font-bold text-f5f5f5">
            {content.prova.h2}
          </h2>
        </div>

        {/* Asymmetric KPI bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {/* Large cell — R$ 8.21 bi */}
          <Card glow className="md:col-span-2 lg:col-span-2 p-8 flex flex-col justify-between">
            <div className="font-data text-6xl md:text-7xl font-bold text-f5f5f5 leading-none">
              {content.prova.nodes[0].value}
            </div>
            <p className="mt-4 text-sm text-[#9CA3AF]">{content.prova.nodes[0].label}</p>
          </Card>

          {/* 10 mil paths */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="font-data text-5xl font-bold text-f5f5f5 leading-none">
              {content.prova.nodes[1].value}
            </div>
            <p className="mt-4 text-xs text-[#52525B]">{content.prova.nodes[1].label}</p>
          </Card>

          {/* 5 cenários */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="font-data text-5xl font-bold text-f5f5f5 leading-none">
              {content.prova.nodes[2].value}
            </div>
            <p className="mt-4 text-xs text-[#52525B]">{content.prova.nodes[2].label}</p>
          </Card>

          {/* 8 notebooks */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div className="font-data text-5xl font-bold text-f5f5f5 leading-none">
              {content.prova.nodes[3].value}
            </div>
            <p className="mt-4 text-xs text-[#52525B]">{content.prova.nodes[3].label}</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
