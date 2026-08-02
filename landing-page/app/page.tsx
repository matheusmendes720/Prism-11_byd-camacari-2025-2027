import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemaSection } from '@/components/sections/ProblemaSection';
import { AnaliseSection } from '@/components/sections/AnaliseSection';
import { DecisaoSection } from '@/components/sections/DecisaoSection';
import { ProvaSection } from '@/components/sections/ProvaSection';
import { CTASection } from '@/components/sections/CTASection';
import { FooterSection } from '@/components/sections/FooterSection';

// R3F Hero canvas — client-only, no SSR
const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas').then(m => ({ default: m.HeroCanvas })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-bg-panel" />
});

export default function EnergyFlowLP() {
  return (
    <main className="relative">
      {/* Grain overlay is in globals.css via body::before */}
      <HeroCanvas />
      <div className="relative z-10">
        <HeroSection />
        <ProblemaSection />
        <AnaliseSection />
        <DecisaoSection />
        <ProvaSection />
        <CTASection />
        <FooterSection />
      </div>
    </main>
  );
}
