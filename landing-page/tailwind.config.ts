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
        'bg-surface': '#111114',
        'border-subtle': '#1F1F26',
        'border-energy': 'rgba(255, 26, 26, 0.3)',
        'energy-red': '#FF1A1A',
        'energy-yellow': '#FFD700',
        'energy-glow': 'rgba(255, 60, 0, 0.35)',
        'energy-glow-yellow': 'rgba(255, 215, 0, 0.2)',
        'matter-white': '#F5F5F5',
        'matter-steel': '#9CA3AF',
        'matter-muted': '#52525B'
      },
      fontFamily: {
        narrative: ['var(--font-space-grotesk)', 'sans-serif'],
        data: ['var(--font-rajdhani)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif']
      },
      backgroundImage: {
        'gradient-energy-flow': 'linear-gradient(135deg, #FF1A1A 0%, #FF8C00 55%, #FFD700 100%)',
        'gradient-panel': 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-energy-halo': 'radial-gradient(ellipse at center, rgba(255,26,26,0.25) 0%, transparent 70%)',
        'gradient-data-stream': 'linear-gradient(90deg, transparent 0%, rgba(255,26,26,0.6) 30%, rgba(255,215,0,0.6) 70%, transparent 100%)'
      },
      boxShadow: {
        'electric': '0 0 20px rgba(255, 26, 26, 0.45), 0 0 40px rgba(255, 215, 0, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
