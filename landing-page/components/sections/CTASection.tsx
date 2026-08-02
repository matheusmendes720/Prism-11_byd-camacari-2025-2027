'use client';

// Asymmetric 2-col CTA — copy left, contact form right
import { useState } from 'react';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/design-tokens';

export function CTASection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="cta" className="relative min-h-[100dvh] flex items-center px-6 py-24 bg-bg-void">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div>
          <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-4">
            {content.ctaFinal.eyebrow}
          </p>
          <h2 className="font-narrative text-4xl md:text-5xl font-bold text-f5f5f5 leading-tight">
            {content.ctaFinal.h2}
          </h2>
          <p className="mt-4 text-base text-[#9CA3AF] leading-relaxed">
            {content.ctaFinal.microcopy}
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${content.footer.email}`}
              className="flex items-center gap-2 text-sm text-f5f5f5 hover:text-energy-yellow transition-colors"
            >
              <span className="text-energy-yellow font-mono">[</span>
              {content.footer.email}
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-energy-yellow transition-colors"
            >
              <span className="text-energy-yellow font-mono">[</span>
              {content.ctaFinal.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div>
          {submitted ? (
            <div
              className="p-8 rounded-xl border text-center"
              style={{ borderColor: 'rgba(255,215,0,0.3)', background: colors.bg.panel }}
            >
              <div className="text-4xl mb-4 text-energy-yellow">+</div>
              <p className="text-f5f5f5 font-narrative text-lg">Mensagem enviada.</p>
              <p className="mt-2 text-sm text-[#9CA3AF]">Resposta em até 24h no e-mail informado.</p>
            </div>
          ) : (
            <form name="contact" method="POST" onSubmit={handleSubmit} className="space-y-4">
              <p className="hidden">
                <label>Não preencher: <input name="bot-field" /></label>
              </p>
              <input type="hidden" name="form-name" value="contact" />

              <input
                type="text"
                name="name"
                placeholder="Nome"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border text-f5f5f5 placeholder-[#52525B] focus:outline-none transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email corporativo"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border text-f5f5f5 placeholder-[#52525B] focus:outline-none transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />
              <textarea
                name="message"
                placeholder="Contexto da sua decisão de capital (1-2 frases)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border text-f5f5f5 placeholder-[#52525B] focus:outline-none transition-colors resize-none"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {content.ctaFinal.ctaPrimary}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
