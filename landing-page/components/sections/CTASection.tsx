// landing-page/components/sections/CTASection.tsx
'use client';

import { useState } from 'react';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/plausible-events';

export function CTASection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });
      if (response.ok) {
        trackEvent('form_submit', { location: 'cta_final' });
        setSubmitted(true);
      } else {
        trackEvent('form_error', { location: 'cta_final' });
        setError(true);
      }
    } catch {
      trackEvent('form_error', { location: 'cta_final' });
      setError(true);
    }
  };

  return (
    <section id="cta" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <h2 className="font-narrative text-5xl md:text-6xl font-bold text-matter-white">
          {content.ctaFinal.h2}
        </h2>

        {submitted ? (
          <p className="mt-12 text-lg text-energy-yellow">
            Mensagem enviada. Resposta em até 24h no e-mail informado.
          </p>
        ) : (
          <>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="mt-12 space-y-4 text-left"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>Don't fill: <input name="bot-field" /></label>
              </p>
              <input
                type="text"
                name="name"
                placeholder="Nome"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <input
                type="email"
                name="email"
                placeholder="Email corporativo"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <textarea
                name="message"
                placeholder="Contexto da sua decisão de capital (1-2 frases)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {content.ctaFinal.ctaPrimary}
              </Button>
              {error && (
                <p className="text-energy-red text-sm">
                  Algo travou no envio. Tente novamente ou mande direto para contato@energyflow.lab.
                </p>
              )}
            </form>
            <p className="mt-6 text-xs text-matter-steel">{content.ctaFinal.microcopy}</p>
          </>
        )}
      </div>
    </section>
  );
}
