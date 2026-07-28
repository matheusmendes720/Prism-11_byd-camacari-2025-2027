// landing-page/tests/lib/design-tokens.test.ts
import { describe, it, expect } from 'vitest';
import { colors, gradients, shadows } from '@/lib/design-tokens';

describe('design-tokens', () => {
  it('exports bg.void as #050505', () => {
    expect(colors.bg.void).toBe('#050505');
  });

  it('exports energy.red as #FF1A1A', () => {
    expect(colors.energy.red).toBe('#FF1A1A');
  });

  it('exports gradients.energyFlow with 135deg angle', () => {
    expect(gradients.energyFlow).toContain('135deg');
    expect(gradients.energyFlow).toContain('#FF1A1A');
    expect(gradients.energyFlow).toContain('#FFD700');
  });

  it('exports shadows.electric with dual red+yellow glow', () => {
    expect(shadows.electric).toContain('255, 26, 26');
    expect(shadows.electric).toContain('255, 215, 0');
  });
});
