// landing-page/components/sections/ProblemaSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { GlossaryTerm } from '@/components/glossary/GlossaryTerm';

export function ProblemaSection() {
  return (
    <section id="problema" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.problema.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel max-w-2xl">{content.problema.sub}</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.problema.cards.map((card, i) => (
            <Card key={i} glow={i === 1}>
              <h3 className="font-narrative text-xl text-matter-white font-bold mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-matter-steel leading-relaxed">
                {card.body.includes('PTAX') ? (
                  <GlossaryTerm term="PTAX">PTAX</GlossaryTerm>
                ) : card.body.includes('HHI') ? (
                  <GlossaryTerm term="HHI">HHI</GlossaryTerm>
                ) : card.body.includes('EBITDA') ? (
                  <GlossaryTerm term="EBITDA">EBITDA</GlossaryTerm>
                ) : card.body.includes('BNDES') ? (
                  <GlossaryTerm term="BNDES">BNDES</GlossaryTerm>
                ) : null}{' '}
                {card.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
