// landing-page/components/sections/HeroSection.tsx
'use client';

import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/plausible-events';

export function HeroSection() {
  const handleCtaClick = () => trackEvent('cta_click', { location: 'hero', type: 'primary' });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-4xl text-center">
        <h1 className="font-narrative text-5xl md:text-7xl font-bold text-matter-white leading-tight">
          {content.hero.headline}
        </h1>
        <p className="mt-6 text-lg text-matter-steel max-w-2xl mx-auto">
          {content.hero.sub}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button variant="primary" size="lg" onClick={handleCtaClick} aria-label={content.hero.ctaPrimary}>
            {content.hero.ctaPrimary}
          </Button>
          <a href="#cta" className="text-energy-yellow underline underline-offset-4 text-sm">
            {content.hero.ctaSecondary}
          </a>
        </div>
        <p className="mt-6 text-xs text-matter-steel">{content.hero.microcopy}</p>
      </div>
    </section>
  );
}
