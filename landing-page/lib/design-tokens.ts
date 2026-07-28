// landing-page/lib/design-tokens.ts
export const colors = {
  bg: {
    void: '#050505',
    panel: '#0A0A0C',
    surface: '#121216'
  },
  border: {
    subtle: '#1F1F26'
  },
  energy: {
    red: '#FF1A1A',
    yellow: '#FFD700',
    glow: 'rgba(255, 60, 0, 0.4)'
  },
  matter: {
    white: '#FFFFFF',
    steel: '#8A8A9E',
    glass: 'rgba(255, 255, 255, 0.05)'
  }
} as const;

export const gradients = {
  energyFlow: 'linear-gradient(135deg, #FF1A1A 0%, #FF8C00 50%, #FFD700 100%)',
  heatCore: 'radial-gradient(circle, #FF1A1A 0%, transparent 70%)',
  glassPanel: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
  dataStream: 'linear-gradient(90deg, transparent 0%, #FF1A1A 30%, #FFD700 70%, transparent 100%)'
} as const;

export const shadows = {
  electric: '0 0 15px rgba(255, 26, 26, 0.5), 0 0 30px rgba(255, 215, 0, 0.2)'
} as const;

export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px'
} as const;

export type ColorToken = keyof typeof colors.bg | keyof typeof colors.energy | keyof typeof colors.matter;
