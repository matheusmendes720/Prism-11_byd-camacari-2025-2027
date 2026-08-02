'use client';

// Asymmetric split-screen Hero — per taste-skill Phase F §4.3
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Z } from '@/lib/design-tokens';

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 70% 50%, rgba(255,26,26,0.08) 0%, transparent 60%), #050505',
        zIndex: Z.base
      }}
    >
      {/* Copy column — left-anchored asymmetric */}
      <div className="relative w-full lg:w-1/2 px-6 py-24 lg:px-16 z-10">
        <p className="text-energy-yellow font-mono text-xs tracking-[0.25em] uppercase mb-4">
          {content.hero.eyebrow}
        </p>
        <h1 className="font-narrative text-5xl md:text-6xl xl:text-7xl font-bold text-f5f5f5 leading-[1.05] mb-6">
          {content.hero.headline}
        </h1>
        <p className="text-base md:text-lg text-[#9CA3AF] max-w-lg leading-relaxed mb-8">
          {content.hero.sub}
        </p>
        {/* Dual CTA cluster */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg">
            {content.hero.ctaPrimary}
          </Button>
          <Button variant="outline" size="lg">
            {content.hero.ctaSecondary}
          </Button>
        </div>
        <p className="mt-4 text-xs text-[#52525B]">{content.hero.microcopy}</p>
      </div>

      {/* Right column: canvas placeholder (handled by HeroCanvas) */}
      <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full" />
    </section>
  );
}
