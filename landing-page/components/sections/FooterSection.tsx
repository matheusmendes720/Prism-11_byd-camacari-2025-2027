// landing-page/components/sections/FooterSection.tsx
import { content } from '@/lib/content';

export function FooterSection() {
  return (
    <footer id="footer" className="relative px-6 py-12 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-narrative text-matter-white font-bold">{content.footer.name}</div>
          <div className="text-sm text-matter-steel mt-1">{content.footer.role}</div>
          <div className="text-sm text-matter-steel">{content.footer.location}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Contato</div>
          <a href={`mailto:${content.footer.email}`} className="text-sm text-matter-white hover:text-energy-yellow">
            {content.footer.email}
          </a>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Método & Código</div>
          <a href={`https://${content.footer.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-matter-white hover:text-energy-yellow">
            {content.footer.github}
          </a>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Confidencialidade</div>
          <div className="text-sm text-matter-steel">NDA sob demanda. LGPD compliant.</div>
        </div>
      </div>
      <div className="mt-8 text-xs text-matter-steel text-center">{content.footer.legal}</div>
    </footer>
  );
}
