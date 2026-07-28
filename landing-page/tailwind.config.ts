// landing-page/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#050505',
        'bg-panel': '#0A0A0C',
        'bg-surface': '#121216',
        'border-subtle': '#1F1F26',
        'energy-red': '#FF1A1A',
        'energy-yellow': '#FFD700',
        'matter-white': '#FFFFFF',
        'matter-steel': '#8A8A9E'
      },
      fontFamily: {
        narrative: ['var(--font-space-grotesk)', 'sans-serif'],
        data: ['var(--font-rajdhani)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif']
      },
      backgroundImage: {
        'gradient-energy-flow': 'linear-gradient(135deg, #FF1A1A 0%, #FF8C00 50%, #FFD700 100%)',
        'gradient-heat-core': 'radial-gradient(circle, #FF1A1A 0%, transparent 70%)',
        'gradient-glass-panel': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-data-stream': 'linear-gradient(90deg, transparent 0%, #FF1A1A 30%, #FFD700 70%, transparent 100%)'
      },
      boxShadow: {
        'electric': '0 0 15px rgba(255, 26, 26, 0.5), 0 0 30px rgba(255, 215, 0, 0.2)'
      }
    }
  },
  plugins: []
};

export default config;
