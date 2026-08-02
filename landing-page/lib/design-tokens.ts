// Design tokens — per taste-skill Phase F
// All color values as CSS custom-property-ready strings

export const Z = {
  base: 0,
  canvas: 10,
  video: 0,
  card: 10,
  stickyNav: 20,
  overlayCopy: 30,
  modal: 40,
  grain: 50,
} as const;

export const colors = {
  bg: {
    void: '#050505',
    panel: '#0A0A0C',
    surface: '#111114',
  },
  energy: {
    red: '#FF1A1A',
    yellow: '#FFD700',
    glow: 'rgba(255, 60, 0, 0.35)',
    glowYellow: 'rgba(255, 215, 0, 0.2)',
  },
  matter: {
    white: '#F5F5F5',
    steel: '#9CA3AF',
    muted: '#52525B',
  },
  border: {
    subtle: '#1F1F26',
    energy: 'rgba(255, 26, 26, 0.3)',
  },
} as const;

export const gradients = {
  energyFlow:
    'linear-gradient(135deg, #FF1A1A 0%, #FF8C00 55%, #FFD700 100%)',
  panel:
    'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
  energyHalo:
    'radial-gradient(ellipse at center, rgba(255,26,26,0.25) 0%, transparent 70%)',
  dataStream:
    'linear-gradient(90deg, transparent 0%, rgba(255,26,26,0.6) 30%, rgba(255,215,0,0.6) 70%, transparent 100%)',
} as const;

export const shadows = {
  electric: '0 0 20px rgba(255, 26, 26, 0.45), 0 0 40px rgba(255, 215, 0, 0.15)',
  card: '0 2px 12px rgba(0, 0, 0, 0.4)',
  cardHover: '0 4px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.08)',
} as const;
