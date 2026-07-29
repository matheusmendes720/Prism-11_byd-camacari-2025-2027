// landing-page/components/sections/DecisaoSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { GlossaryTerm } from '@/components/glossary/GlossaryTerm';

export function DecisaoSection() {
  return (
    <section id="decisao" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.decisao.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel">{content.decisao.sub}</p>
        <Card glow className="mt-10 space-y-4">
          {content.decisao.recomendacoes.map((rec, i) => {
            const [se, entao] = rec.split(' ENTÃO ');
            return (
              <div key={i} className="text-base text-matter-white leading-relaxed">
                <span className="text-energy-yellow font-data font-bold">{se} ENTÃO </span>
                <GlossaryTerm term={entao.includes('NPV') ? 'NPV' : entao.includes('VaR') ? 'VaR' : 'ViE'}>
                  {entao}
                </GlossaryTerm>
              </div>
            );
          })}
        </Card>
        <div className="mt-8 text-center">
          <div className="inline-block px-6 py-4 rounded-lg border border-energy-yellow/40 bg-bg-panel/80">
            <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data">
              Vulnerabilidade Agregada Atual
            </div>
            <div className="text-5xl font-data text-energy-yellow mt-1">
              {content.decisao.compositeScore} / 100
            </div>
            <div className="text-xs text-matter-steel mt-1">(faixa âmbar)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
