// landing-page/tests/lib/three-support.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shouldUse3D } from '@/lib/three-support';

describe('shouldUse3D', () => {
  let mockNavigator: { maxTouchPoints: number };

  beforeEach(() => {
    mockNavigator = { maxTouchPoints: 0 };

    // Override navigator.maxTouchPoints using Object.defineProperty
    Object.defineProperty(navigator, 'maxTouchPoints', {
      get: () => mockNavigator.maxTouchPoints,
      configurable: true
    });

    // Mock matchMedia to return no preference by default
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    // Mock canvas.getContext for WebGL2 (jsdom doesn't implement this)
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'canvas') {
        element.getContext = vi.fn().mockReturnValue({
          getParameter: vi.fn().mockReturnValue('NVIDIA GeForce RTX 3080')
        });
      }
      return element;
    });
  });

  afterEach(() => {
    // Reset matchMedia
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    // Reset maxTouchPoints
    mockNavigator.maxTouchPoints = 0;
    // Reset document.createElement
    document.createElement = document.createElement.bind(document);
  });

  it('returns "none" on server (no window)', () => {
    // Temporarily set window to undefined to simulate server
    const originalWindow = global.window;
    (global as any).window = undefined;
    expect(shouldUse3D()).toBe('none');
    global.window = originalWindow;
  });

  it('returns "none" when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(shouldUse3D()).toBe('none');
  });

  it('returns "lite" on touch devices', () => {
    mockNavigator.maxTouchPoints = 5;
    expect(shouldUse3D()).toBe('lite');
  });
});
