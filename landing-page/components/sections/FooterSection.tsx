'use client';

import { content } from '@/lib/content';

export function FooterSection() {
  return (
    <footer id="footer" className="relative px-6 py-12 border-t bg-bg-void" style={{ borderColor: '#1F1F26' }}>
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Identity */}
          <div>
            <div className="font-narrative text-f5f5f5 font-bold">{content.footer.name}</div>
            <div className="text-sm text-[#9CA3AF] mt-1">{content.footer.role}</div>
            <div className="text-sm text-[#52525B]">{content.footer.location}</div>
          </div>

          {/* Contato */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-energy-yellow font-mono mb-2">
              Contato
            </div>
            <a
              href={`mailto:${content.footer.email}`}
              className="text-sm text-f5f5f5 hover:text-energy-yellow transition-colors"
            >
              {content.footer.email}
            </a>
          </div>

          {/* Método */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-energy-yellow font-mono mb-2">
              Método e Código
            </div>
            <a
              href={`https://${content.footer.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-f5f5f5 hover:text-energy-yellow transition-colors"
            >
              {content.footer.github}
            </a>
          </div>

          {/* Legal */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-energy-yellow font-mono mb-2">
              Confidentialidade
            </div>
            <div className="text-sm text-[#52525B]">NDA sob demanda. LGPD compliant.</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t text-center" style={{ borderColor: '#1F1F26' }}>
          <p className="text-xs text-[#52525B]">{content.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
