// landing-page/components/sections/ProvaSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

export function ProvaSection() {
  return (
    <section id="prova" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white mb-12">
          {content.prova.h2}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.prova.nodes.map((node, i) => (
            <Card key={i}>
              <div className="text-3xl font-data text-energy-yellow mb-3">{node.value}</div>
              <div className="text-sm text-matter-steel leading-relaxed">{node.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
