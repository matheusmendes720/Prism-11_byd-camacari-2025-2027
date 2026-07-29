import { Scene } from '@/components/three/Scene';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemaSection } from '@/components/sections/ProblemaSection';
import { AnaliseSection } from '@/components/sections/AnaliseSection';
import { DecisaoSection } from '@/components/sections/DecisaoSection';
import { ProvaSection } from '@/components/sections/ProvaSection';
import { CTASection } from '@/components/sections/CTASection';
import { FooterSection } from '@/components/sections/FooterSection';

export default function EnergyFlowLP() {
  return (
    <main className="relative">
      <Scene />
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
