// landing-page/lib/three-support.ts
export type ThreeMode = 'full' | 'lite' | 'none';

/**
 * Detects whether the browser should render 3D, and at what fidelity.
 * Used to gate <Canvas> rendering and select appropriate fallback.
 */
export function shouldUse3D(): ThreeMode {
  if (typeof window === 'undefined') return 'none';

  // Reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return 'none';

  // WebGL2 support check
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'none';

  // Touch device → lite mode
  if (navigator.maxTouchPoints > 0) return 'lite';

  // Integrated GPU → lite mode
  const renderer = gl.getParameter(gl.RENDERER);
  const rendererStr = typeof renderer === 'string' ? renderer : '';
  const isIntegrated = /Intel|Microsoft Basic|llvmpipe|swiftshader/i.test(rendererStr);
  if (isIntegrated) return 'lite';

  return 'full';
}
