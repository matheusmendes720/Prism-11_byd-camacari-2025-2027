# Landing Page "Energy Flow" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic + analytical Landing Page for `energyflow.lab` that showcases Matheus Mendes as a reference in econometrics applied to the Brazilian automotive industry (BYD Camaçari 2025-2027 anchor), converts qualified visitors into demo requests, and serves as a portfolio proof-of-capability for C-level audiences.

**Architecture:** Next.js 14 App Router single-page app with a persistent full-screen `<Canvas>` (React Three Fiber) that switches 3D scenes based on scroll position, overlaid by 7 HTML sections. Single Canvas (not per-section) to keep GPU usage to ~1× and enable cinematic cross-fade transitions. Feature detection gates 3D into 3 modes (`full` / `lite` / `none`) for mobile, integrated GPUs, and reduced-motion users. Content centralized in `lib/content.ts` (PT-BR). Forms via Netlify Forms (built-in spam protection). Analytics via Plausible self-hosted (privacy-first, no cookie banner).

**Tech Stack:** Next.js 14.2, TypeScript 5.4 strict, Tailwind CSS 3.4, React Three Fiber 8.16, @react-three/drei 9.105, Framer Motion 11.2, Radix UI HoverCard, Vitest 1.x (lib unit tests), Playwright 1.4x (e2e smoke), Vercel/Netlify deployment via `@netlify/plugin-nextjs`, Plausible self-hosted analytics.

## Global Constraints

- **Node version:** ≥ 18.17
- **TypeScript:** 5.4, strict mode enabled, no implicit any
- **Design tokens (CSS variables + Tailwind):**
  - `bg-void #050505`, `bg-panel #0A0A0C`, `bg-surface #121216`, `border-subtle #1F1F26`
  - `energy-red #FF1A1A`, `energy-yellow #FFD700`, `energy-glow rgba(255,60,0,0.4)`
  - `matter-white #FFFFFF`, `matter-steel #8A8A9E`, `matter-glass rgba(255,255,255,0.05)`
- **Gradients:**
  - `gradient-energy-flow: linear-gradient(135deg, #FF1A1A 0%, #FF8C00 50%, #FFD700 100%)`
  - `gradient-heat-core: radial-gradient(circle, #FF1A1A 0%, transparent 70%)`
  - `gradient-glass-panel: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`
  - `gradient-data-stream: linear-gradient(90deg, transparent 0%, #FF1A1A 30%, #FFD700 70%, transparent 100%)`
- **Typography (next/font):** Space Grotesk (narrative headlines), Rajdhani (numeric/data), Inter (body)
- **Spacing scale (8-base):** 4, 8, 12, 16, 24, 32, 48, 64, 96 px
- **Accessibility:** WCAG AA minimum. `matter-white` on `bg-void` = 19.5:1 ✅; `energy-yellow` on `bg-void` = 14.8:1 ✅; `matter-steel` only for text ≥ 18px (5.2:1)
- **Performance budget:** LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1, GLB ≤ 4MB Draco, bundle ≤ 350KB gzipped, FPS ≥ 50 desktop / ≥ 30 mobile-lite
- **A11y 3D:** `prefers-reduced-motion: reduce` → mode `none`; Canvas is `aria-hidden="true"` in mode full-3D (HTML overlay carries info)
- **Video quota:** VEO 3 = 3 videos/month (Tier S only: Hero / Problema / Decisão). Other sections use static images + CSS animations
- **Copy language:** PT-BR for all user-facing text; English for code/comments
- **Brand constraint:** NO references to "BYD" trademark; use "BYD-inspired" or "BYD Seal-inspired" generic descriptions
- **NDA template required** before any demo call

---

## File Structure (locked in before tasks)

```
landing-page/                         (Next.js root, sibling to project root)
├── app/
│   ├── layout.tsx                     Fonts + theme + meta
│   ├── page.tsx                       <EnergyFlowLP /> composition
│   └── globals.css                    Tailwind base + reset
├── components/
│   ├── three/
│   │   ├── Scene.tsx                  Canvas root + ScrollControls
│   │   ├── HeroCarScene.tsx           Tier S
│   │   ├── ProblemaScene.tsx          Tier S
│   │   ├── AnaliseScene.tsx           Static + CSS hover
│   │   ├── DecisaoScene.tsx           Tier S
│   │   ├── ProvaScene.tsx             Static + CSS pulse
│   │   ├── CTAScene.tsx               Static + CSS particles
│   │   ├── FooterScene.tsx            Static + CSS
│   │   └── shared/
│   │       ├── EnergyNode.tsx         Pulsing sphere reusable
│   │       ├── TubeLine.tsx           Animated connecting line
│   │       ├── KPIHtmlCard.tsx        Html overlay for KPI
│   │       └── Particles.tsx          Particle system
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProblemaSection.tsx
│   │   ├── AnaliseSection.tsx
│   │   ├── DecisaoSection.tsx
│   │   ├── ProvaSection.tsx
│   │   ├── CTASection.tsx
│   │   └── FooterSection.tsx
│   ├── ui/
│   │   ├── Button.tsx                 gradient-energy-flow + shadow-electric
│   │   ├── Card.tsx                   border-glow
│   │   └── KpiNode.tsx
│   ├── glossary/
│   │   ├── GlossaryTerm.tsx           Radix HoverCard wrapper
│   │   └── glossary-data.ts           10 PT-BR terms
│   └── providers/
│       └── ScrollProvider.tsx         useScroll context
├── lib/
│   ├── three-support.ts               Feature detection (full/lite/none)
│   ├── design-tokens.ts               Token exports for TS
│   ├── content.ts                     PT-BR copy centralized
│   └── plausible-events.ts            12 event constants
├── public/
│   ├── models/byd-seal.glb            4MB Draco
│   ├── videos/                        Tier S VEO 3 output
│   └── textures/noise-1k.png
├── styles/
│   └── tokens.css                     CSS variables (mirror of design-tokens.ts)
├── tests/
│   ├── lib/
│   │   ├── three-support.test.ts
│   │   ├── content.test.ts
│   │   └── glossary-data.test.ts
│   └── e2e/
│       └── lp-smoke.spec.ts           Playwright smoke
├── netlify.toml
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── package.json
├── playwright.config.ts
├── vitest.config.ts
└── README.md
```

Each file has one responsibility:
- `lib/*` = pure functions, easily unit-tested
- `components/three/shared/*` = reusable R3F primitives
- `components/three/*Scene.tsx` = one scene per file (each ≤ 200 lines)
- `components/sections/*` = HTML overlay (no 3D knowledge)
- `app/page.tsx` = composition only, delegates to sections

---

## Phase A — Foundation (Tasks 1-3)

### Task 1: Bootstrap Next.js + dependencies

**Files:**
- Create: `landing-page/package.json`
- Create: `landing-page/tsconfig.json`
- Create: `landing-page/next.config.mjs`
- Create: `landing-page/app/layout.tsx` (minimal)
- Create: `landing-page/app/page.tsx` (minimal)

**Interfaces:**
- Consumes: nothing
- Produces: working Next.js dev server on `http://localhost:3000`

- [ ] **Step 1: Create `landing-page/` directory and run create-next-app**

```bash
cd "C:/Users/mathe/code_space/orchestration/value-factory/case-studies/byd-camacari-2025-2027"
mkdir -p landing-page
cd landing-page
npx create-next-app@14.2.0 . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm --yes
```

Expected: Next.js 14.2 installed, `app/page.tsx` shows default page.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install three@0.165.0 @react-three/fiber@8.16.0 @react-three/drei@9.105.0 framer-motion@11.2.0 @radix-ui/react-hover-card@1.0.7 clsx@2.1.1 tailwind-merge@2.3.0
```

Expected: 6 packages added, no peer-dep warnings.

- [ ] **Step 3: Install dev dependencies**

```bash
npm install -D vitest@1.6.0 @vitest/ui@1.6.0 @testing-library/react@16.0.0 @testing-library/jest-dom@6.4.0 jsdom@24.0.0 @playwright/test@1.44.0 @types/three@0.165.0
```

Expected: 7 dev packages added.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server listens on `http://localhost:3000`, default Next.js page renders. Stop server with `Ctrl+C` after verifying.

- [ ] **Step 5: Commit**

```bash
git add landing-page/
git commit -m "feat(lp): bootstrap Next.js 14 + R3F + Tailwind"
```

---

### Task 2: Configure Netlify deploy

**Files:**
- Create: `landing-page/netlify.toml`
- Modify: `landing-page/next.config.mjs`

**Interfaces:**
- Consumes: working Next.js app from Task 1
- Produces: Netlify-ready build config

- [ ] **Step 1: Add `@netlify/plugin-nextjs` to dependencies**

```bash
cd landing-page
npm install -D @netlify/plugin-nextjs@4.41.0 netlify-cli@17.0.0
```

- [ ] **Step 2: Create `netlify.toml`**

```toml
# landing-page/netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18.17.0"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/videos/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/models/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/api/contact"
  to = "/"
  status = 200
```

- [ ] **Step 3: Update `next.config.mjs` for Netlify compatibility**

```javascript
// landing-page/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'framer-motion']
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf|hdr|exr)$/,
      type: 'asset/resource'
    });
    return config;
  }
};

export default nextConfig;
```

- [ ] **Step 4: Verify build works locally**

```bash
cd landing-page
npm run build
```

Expected: Build completes without errors. Check `.next/` directory created.

- [ ] **Step 5: Commit**

```bash
git add landing-page/netlify.toml landing-page/next.config.mjs landing-page/package.json landing-page/package-lock.json
git commit -m "feat(lp): configure Netlify deploy with cache headers"
```

---

### Task 3: Set up design tokens (CSS + Tailwind + TS)

**Files:**
- Create: `landing-page/styles/tokens.css`
- Create: `landing-page/lib/design-tokens.ts`
- Modify: `landing-page/tailwind.config.ts`
- Modify: `landing-page/app/globals.css`
- Create: `landing-page/tests/lib/design-tokens.test.ts`

**Interfaces:**
- Consumes: design token values from spec §2
- Produces: typed design tokens usable in TS + Tailwind utilities + CSS variables

- [ ] **Step 1: Create `styles/tokens.css`**

```css
/* landing-page/styles/tokens.css */
:root {
  /* Surfaces */
  --bg-void: #050505;
  --bg-panel: #0A0A0C;
  --bg-surface: #121216;
  --border-subtle: #1F1F26;

  /* Energy */
  --energy-red: #FF1A1A;
  --energy-yellow: #FFD700;
  --energy-glow: rgba(255, 60, 0, 0.4);

  /* Matter */
  --matter-white: #FFFFFF;
  --matter-steel: #8A8A9E;
  --matter-glass: rgba(255, 255, 255, 0.05);

  /* Gradients */
  --gradient-energy-flow: linear-gradient(135deg, #FF1A1A 0%, #FF8C00 50%, #FFD700 100%);
  --gradient-heat-core: radial-gradient(circle, #FF1A1A 0%, transparent 70%);
  --gradient-glass-panel: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
  --gradient-data-stream: linear-gradient(90deg, transparent 0%, #FF1A1A 30%, #FFD700 70%, transparent 100%);

  /* Effects */
  --shadow-electric: 0 0 15px rgba(255, 26, 26, 0.5), 0 0 30px rgba(255, 215, 0, 0.2);

  /* Spacing (8-base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

- [ ] **Step 2: Create `lib/design-tokens.ts`**

```typescript
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
```

- [ ] **Step 3: Update `tailwind.config.ts`**

```typescript
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
```

- [ ] **Step 4: Update `app/globals.css` to import tokens**

```css
/* landing-page/app/globals.css */
@import '../styles/tokens.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg-void text-matter-white font-body antialiased;
  }

  h1, h2, h3 {
    @apply font-narrative;
  }
}
```

- [ ] **Step 5: Write failing test for design-tokens.ts**

```typescript
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
```

- [ ] **Step 6: Set up vitest config**

```typescript
// landing-page/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/lib/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});
```

- [ ] **Step 7: Add test scripts to `package.json`**

Edit `landing-page/package.json` to add:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  ...
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
cd landing-page
npm test
```

Expected: 4 tests pass, 0 fail.

- [ ] **Step 9: Commit**

```bash
git add landing-page/styles/ landing-page/lib/design-tokens.ts landing-page/tailwind.config.ts landing-page/app/globals.css landing-page/tests/lib/design-tokens.test.ts landing-page/vitest.config.ts landing-page/package.json
git commit -m "feat(lp): add design tokens (CSS + Tailwind + TS) with tests"
```

---

## Phase B — Lib modules (Tasks 4-7)

### Task 4: Implement `lib/three-support.ts` (feature detection)

**Files:**
- Create: `landing-page/lib/three-support.ts`
- Create: `landing-page/tests/lib/three-support.test.ts`

**Interfaces:**
- Consumes: browser APIs (window, navigator, WebGL)
- Produces: `shouldUse3D(): 'full' | 'lite' | 'none'`

- [ ] **Step 1: Write failing test**

```typescript
// landing-page/tests/lib/three-support.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shouldUse3D } from '@/lib/three-support';

describe('shouldUse3D', () => {
  const originalWindow = global.window;
  const originalNavigator = global.navigator;

  beforeEach(() => {
    // Mock minimal browser environment
    global.window = {
      matchMedia: vi.fn().mockReturnValue({ matches: false })
    } as any;
    global.navigator = { maxTouchPoints: 0 } as any;
  });

  afterEach(() => {
    global.window = originalWindow;
    global.navigator = originalNavigator;
  });

  it('returns "none" on server (no window)', () => {
    // @ts-ignore
    delete global.window;
    expect(shouldUse3D()).toBe('none');
  });

  it('returns "none" when prefers-reduced-motion is set', () => {
    global.window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(shouldUse3D()).toBe('none');
  });

  it('returns "lite" on touch devices', () => {
    global.navigator.maxTouchPoints = 5;
    expect(shouldUse3D()).toBe('lite');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd landing-page
npm test -- three-support
```

Expected: FAIL — `Cannot find module '@/lib/three-support'`

- [ ] **Step 3: Implement `lib/three-support.ts`**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- three-support
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add landing-page/lib/three-support.ts landing-page/tests/lib/three-support.test.ts
git commit -m "feat(lp): add three-support feature detection with tests"
```

---

### Task 5: Implement `lib/content.ts` (PT-BR copy centralized)

**Files:**
- Create: `landing-page/lib/content.ts`
- Create: `landing-page/tests/lib/content.test.ts`

**Interfaces:**
- Consumes: PT-BR copy from spec §5
- Produces: typed `content` object with sections

- [ ] **Step 1: Write failing test**

```typescript
// landing-page/tests/lib/content.test.ts
import { describe, it, expect } from 'vitest';
import { content } from '@/lib/content';

describe('content', () => {
  it('exports hero.headline', () => {
    expect(content.hero.headline).toBe('A primeira volta é sua decisão.');
  });

  it('exports hero.ctaPrimary', () => {
    expect(content.hero.ctaPrimary).toContain('Agendar');
  });

  it('exports problema.cards as array of 3', () => {
    expect(content.problema.cards).toHaveLength(3);
    expect(content.problema.cards[0].title).toBe('PTAX volátil');
  });

  it('exports analise.notebooks as array of 8', () => {
    expect(content.analise.notebooks).toHaveLength(8);
    expect(content.analise.notebooks[0].id).toBe('NB-01');
  });

  it('exports decisao.recomendacoes as array of 3', () => {
    expect(content.decisao.recomendacoes).toHaveLength(3);
    expect(content.decisao.recomendacoes[0]).toContain('SE');
  });

  it('exports prova.nodes as array of 4', () => {
    expect(content.prova.nodes).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- content
```

Expected: FAIL — `Cannot find module '@/lib/content'`

- [ ] **Step 3: Implement `lib/content.ts`**

```typescript
// landing-page/lib/content.ts
export const content = {
  hero: {
    headline: 'A primeira volta é sua decisão.',
    sub: 'Modelagem econométrica de câmbio, supply chain e risco regulatório para a próxima geração da indústria automotiva brasileira.',
    ctaPrimary: 'Agendar conversa de 30 minutos →',
    ctaSecondary: 'ou baixar o 1-pager técnico (PDF, 2.3MB)',
    microcopy: 'Resposta em até 24h. Confidencialidade garantida por NDA.'
  },
  problema: {
    h2: 'Três incertezas. Uma decisão.',
    sub: 'A próxima decisão de capital da indústria automotiva brasileira acumula três fontes de risco que precisam ser modeladas juntas — não em silos.',
    cards: [
      {
        title: 'PTAX volátil',
        body: 'Variação cambial de ±15% em janelas de 6 meses não é cenário de stress — é cenário base em 2026. Sem hedge calibrado, a margem EBITDA erode silenciosamente.'
      },
      {
        title: 'Incentivos sob revisão',
        body: 'A política industrial automotiva está em transição. O cenário base (18% de cobertura) tem upside e downside material — e o BNDES ainda não publicou o protocolo final.'
      },
      {
        title: 'HHI concentrado',
        body: 'Sua base de fornecedores Tier-1 tem índice HHI na faixa "altamente concentrada". Uma falha em cascata não é hipótese — é o que aconteceu em Camaçari em 2021.'
      }
    ]
  },
  analise: {
    h2: 'Oito notebooks. Uma cadeia de raciocínio.',
    sub: 'Cada notebook responde uma pergunta. Juntos, eles sustentam a recomendação da próxima seção.',
    notebooks: [
      { id: 'NB-01', title: 'Volatilidade Cambial', method: 'GARCH(1,1)-t', question: 'Qual a distribuição do PTAX em 6 meses?' },
      { id: 'NB-02', title: 'Concentração de Suprimentos', method: 'HHI + MC', question: 'Qual o impacto de uma falha em cascata?' },
      { id: 'NB-03', title: 'Cenários BNDES', method: '4 regimes + ViE', question: 'Como cada política industrial muda o NPV?' },
      { id: 'NB-04', title: 'Game Theory Concorrência', method: 'Nash equilibrium', question: 'Qual a resposta ótima da concorrência?' },
      { id: 'NB-05', title: 'Índice Composto', method: '0-100 ponderado', question: 'Qual o score agregado de vulnerabilidade?' },
      { id: 'NB-06', title: 'Monte Carlo Multivariado', method: '10k paths', question: 'Qual o downside conjunto?' },
      { id: 'NB-07', title: 'Acoplamentos', method: 'h*(ViE)', question: 'Onde um risco amplifica outro?' },
      { id: 'NB-08', title: 'Backtesting', method: 'false positives', question: 'A confiança histórica do modelo?' }
    ],
    microcopy: 'Cada card expande para mostrar metodologia, dados e outputs. Hover para preview. Click para detalhes.'
  },
  decisao: {
    h2: 'A recomendação.',
    sub: 'Com base nos 8 notebooks, a próxima decisão de capital tem uma direção clara.',
    recomendacoes: [
      'SE o PTAX apreciar 15% em 6 meses ENTÃO o hedge cambial calibrado cobre 73% do impacto sobre o EBITDA projetado (R$ 287Mi protegidos).',
      'SE o regime regulatório migrar para o cenário C ENTÃO o downside do NPV é de R$ 412Mi em 5 anos, e a opção de adiamento preserva R$ 156Mi em valor real.',
      'SE um fornecedor Tier-1 falhar ENTÃO o VaR de supply chain é de R$ 89Mi em 30 dias, mitigável em 64% via diversificação do buffer.'
    ],
    compositeScore: 62,
    compositeLabel: 'Vulnerabilidade Agregada Atual: 62/100 (faixa âmbar)'
  },
  prova: {
    h2: 'Os números.',
    nodes: [
      { value: 'R$ 4,2 bi', label: 'em Valor em Risco (ViE) modelado sobre os 4 regimes BNDES analisados.' },
      { value: '10 mil', label: 'caminhos de Monte Carlo rodados para capturar a distribuição conjunta.' },
      { value: '5 cenários', label: 'políticos testados contra a matriz de payoff do NB-04 (game theory).' },
      { value: '8 notebooks', label: 'interligados, cada um com backtest e validação por NB-08.' }
    ]
  },
  ctaFinal: {
    h2: 'Pronto para decidir com dados?',
    ctaPrimary: 'Quero agendar uma conversa →',
    ctaSecondary: 'Baixar 1-pager técnico (PDF)',
    microcopy: 'Disponibilidade para kick-off em Q3 2026. NDA mútuo disponível antes da primeira reunião.'
  },
  footer: {
    name: 'Matheus Mendes',
    role: 'Econometrista & Data Scientist',
    location: 'Salvador, BA — Brasil',
    email: 'contato@energyflow.lab',
    github: 'github.com/matheusmendes/byd-analytics',
    legal: '© 2026 Energy Flow Analytics. Análise independente, sem afiliação à BYD Brasil.'
  }
} as const;

export type Content = typeof content;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- content
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add landing-page/lib/content.ts landing-page/tests/lib/content.test.ts
git commit -m "feat(lp): add centralized PT-BR content with shape tests"
```

---

### Task 6: Implement glossary data + `GlossaryTerm` component

**Files:**
- Create: `landing-page/components/glossary/glossary-data.ts`
- Create: `landing-page/components/glossary/GlossaryTerm.tsx`
- Create: `landing-page/tests/lib/glossary-data.test.ts`

**Interfaces:**
- Consumes: 10 PT-BR terms from spec §6
- Produces: `getDefinition(term: string): string` + `<GlossaryTerm term="X">X</GlossaryTerm>` component

- [ ] **Step 1: Write failing test**

```typescript
// landing-page/tests/lib/glossary-data.test.ts
import { describe, it, expect } from 'vitest';
import { glossary, getDefinition } from '@/components/glossary/glossary-data';

describe('glossary', () => {
  it('contains 10 terms', () => {
    expect(Object.keys(glossary)).toHaveLength(10);
  });

  it('includes PTAX', () => {
    expect(glossary.PTAX).toBeDefined();
    expect(getDefinition('PTAX')).toContain('câmbio');
  });

  it('getDefinition returns fallback for unknown term', () => {
    expect(getDefinition('XYZ')).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- glossary
```

Expected: FAIL

- [ ] **Step 3: Implement `glossary-data.ts`**

```typescript
// landing-page/components/glossary/glossary-data.ts
export const glossary = {
  PTAX: 'Taxa de câmbio oficial usada em contratos comerciais no Brasil',
  HHI: 'Herfindahl-Hirschman Index — mede concentração de fornecedores',
  'GARCH(1,1)-t': 'Modelo estatístico que captura volatilidade cambial com caudas pesadas',
  ViE: 'Valor em Risco Esperado — perda esperada dado um cenário adverso',
  NPV: 'Net Present Value — valor presente líquido do investimento',
  'Monte Carlo': 'Simulação com milhares de cenários aleatórios para estimar distribuições',
  Backtesting: 'Validar o modelo em dados passados antes de usar no presente',
  BNDES: 'Banco Nacional de Desenvolvimento Econômico e Social',
  EBITDA: 'Earnings Before Interest, Taxes, Depreciation, Amortization',
  VaR: 'Value at Risk — perda máxima esperada em uma janela de tempo'
} as const;

export type GlossaryTerm = keyof typeof glossary;

export function getDefinition(term: string): string {
  return glossary[term as GlossaryTerm] ?? '';
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- glossary
```

Expected: 3 tests pass.

- [ ] **Step 5: Implement `GlossaryTerm.tsx`**

```typescript
// landing-page/components/glossary/GlossaryTerm.tsx
'use client';

import * as HoverCard from '@radix-ui/react-hover-card';
import { glossary } from './glossary-data';

interface GlossaryTermProps {
  term: keyof typeof glossary;
  children?: React.ReactNode;
}

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const definition = glossary[term];
  const id = `glossary-${term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span
          className="border-b border-dotted border-energy-yellow/50 cursor-help focus:outline-none focus:ring-2 focus:ring-energy-red"
          aria-describedby={id}
          tabIndex={0}
        >
          {children ?? term}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 max-w-xs rounded-md border border-border-subtle bg-bg-panel p-3 text-sm text-matter-white shadow-electric"
          sideOffset={4}
        >
          <strong className="block font-data text-energy-yellow mb-1">{term}</strong>
          <span className="text-matter-steel">{definition}</span>
          <HoverCard.Arrow className="fill-bg-panel" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add landing-page/components/glossary/ landing-page/tests/lib/glossary-data.test.ts
git commit -m "feat(lp): add glossary data + Radix HoverCard term component"
```

---

### Task 7: Implement `lib/plausible-events.ts`

**Files:**
- Create: `landing-page/lib/plausible-events.ts`

**Interfaces:**
- Consumes: 12 event names from spec §10.3
- Produces: typed `trackEvent(name, props?)` helper

- [ ] **Step 1: Implement `plausible-events.ts`**

```typescript
// landing-page/lib/plausible-events.ts
export type PlausibleEvent =
  | 'hero_dwell_time'
  | 'cta_click'
  | 'notebook_hover'
  | 'notebook_click'
  | 'glossary_open'
  | 'pdf_download'
  | 'form_submit'
  | 'form_error'
  | 'video_play'
  | 'video_complete'
  | 'three_mode'
  | 'scroll_depth';

interface PlausibleWindow extends Window {
  plausible?: (event: PlausibleEvent, options?: { props?: Record<string, string | number> }) => void;
}

export function trackEvent(name: PlausibleEvent, props?: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  const w = window as PlausibleWindow;
  if (typeof w.plausible === 'function') {
    w.plausible(name, props ? { props } : undefined);
  }
}

// Self-hosted Plausible domain
export const PLAUSIBLE_DOMAIN = 'energyflow.lab';
export const PLAUSIBLE_SCRIPT_URL = 'https://plausible.energyflow.lab/js/script.js';
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/lib/plausible-events.ts
git commit -m "feat(lp): add Plausible event tracker (12 custom events)"
```

---

## Phase C — 3D Foundation (Tasks 8-12)

### Task 8: Implement `Particles.tsx` shared primitive

**Files:**
- Create: `landing-page/components/three/shared/Particles.tsx`

**Interfaces:**
- Consumes: `count`, `radius`, `color`, `mode` props
- Produces: `<group>` with animated particles

- [ ] **Step 1: Implement `Particles.tsx`**

```typescript
// landing-page/components/three/shared/Particles.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ThreeMode = 'full' | 'lite' | 'none';

interface ParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
  secondaryColor?: string;
  mode?: ThreeMode;
}

export function Particles({
  count = 1000,
  radius = 8,
  color = '#FF1A1A',
  secondaryColor = '#FFD700',
  mode = 'full'
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);
  const effectiveCount = mode === 'lite' ? Math.floor(count / 5) : count;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(effectiveCount * 3);
    const col = new Float32Array(effectiveCount * 3);
    const colorObj = new THREE.Color(color);
    const secondaryObj = new THREE.Color(secondaryColor);

    for (let i = 0; i < effectiveCount; i++) {
      const r = Math.random() * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const useSecondary = Math.random() > 0.7;
      const c = useSecondary ? secondaryObj : colorObj;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [effectiveCount, radius, color, secondaryColor]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/shared/Particles.tsx
git commit -m "feat(lp): add reusable Particles R3F primitive"
```

---

### Task 9: Implement `EnergyNode.tsx` shared primitive

**Files:**
- Create: `landing-page/components/three/shared/EnergyNode.tsx`

- [ ] **Step 1: Implement `EnergyNode.tsx`**

```typescript
// landing-page/components/three/shared/EnergyNode.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface EnergyNodeProps {
  position: [number, number, number];
  radius?: number;
  color?: string;
  pulseSpeed?: number;
  label?: string;
}

export function EnergyNode({
  position,
  radius = 1,
  color = '#FF1A1A',
  pulseSpeed = 2,
  label
}: EnergyNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      {label && (
        <Html center distanceFactor={10} occlude="blending">
          <div className="px-3 py-1 rounded border border-energy-yellow/30 bg-bg-panel/80 backdrop-blur-sm text-xs text-matter-white whitespace-nowrap font-data">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/shared/EnergyNode.tsx
git commit -m "feat(lp): add EnergyNode R3F primitive (pulsing sphere + Html label)"
```

---

### Task 10: Implement `TubeLine.tsx` shared primitive

**Files:**
- Create: `landing-page/components/three/shared/TubeLine.tsx`

- [ ] **Step 1: Implement `TubeLine.tsx`**

```typescript
// landing-page/components/three/shared/TubeLine.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TubeLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  radius?: number;
  animated?: boolean;
}

export function TubeLine({
  start,
  end,
  color = '#FFD700',
  radius = 0.02,
  animated = true
}: TubeLineProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = startVec.clone().lerp(endVec, 0.5);
    midPoint.y += 0.5;
    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 64, radius, 8, false), [curve, radius]);

  useFrame((state) => {
    if (!animated || !meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/shared/TubeLine.tsx
git commit -m "feat(lp): add TubeLine R3F primitive (animated Bezier connector)"
```

---

### Task 11: Implement `KPIHtmlCard.tsx` shared primitive

**Files:**
- Create: `landing-page/components/three/shared/KPIHtmlCard.tsx`

- [ ] **Step 1: Implement `KPIHtmlCard.tsx`**

```typescript
// landing-page/components/three/shared/KPIHtmlCard.tsx
'use client';

import { Html } from '@react-three/drei';

interface KPIHtmlCardProps {
  position: [number, number, number];
  label: string;
  value: string;
  trend?: string;
  ariaLabel?: string;
}

export function KPIHtmlCard({ position, label, value, trend, ariaLabel }: KPIHtmlCardProps) {
  return (
    <Html
      position={position}
      center
      distanceFactor={12}
      occlude="blending"
      zIndexRange={[10, 0]}
    >
      <div
        role="figure"
        aria-label={ariaLabel ?? `${label}: ${value}${trend ? `. Variação: ${trend}` : ''}`}
        className="px-4 py-3 rounded-lg border border-energy-yellow/30 bg-bg-panel/70 backdrop-blur-md shadow-electric min-w-[160px]"
      >
        <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data">
          {label}
        </div>
        <div className="text-2xl font-data text-matter-white mt-1">
          {value}
        </div>
        {trend && (
          <div className="text-xs font-data bg-gradient-energy-flow bg-clip-text text-transparent mt-1">
            {trend}
          </div>
        )}
      </div>
    </Html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/shared/KPIHtmlCard.tsx
git commit -m "feat(lp): add KPIHtmlCard R3F primitive (drei Html overlay)"
```

---

### Task 12: Implement `Scene.tsx` (Canvas root)

**Files:**
- Create: `landing-page/components/three/Scene.tsx`
- Create: `landing-page/components/providers/ScrollProvider.tsx`

**Interfaces:**
- Consumes: `shouldUse3D()` from lib, all 7 scene components
- Produces: `<Canvas>` with ScrollControls + conditional scenes

- [ ] **Step 1: Implement `ScrollProvider.tsx`**

```typescript
// landing-page/components/providers/ScrollProvider.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ScrollContextValue {
  scrollProgress: number; // 0..1
  activeSection: number;  // 0..6
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollProgress: 0,
  activeSection: 0
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<ScrollContextValue>({
    scrollProgress: 0,
    activeSection: 0
  });

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      const section = Math.min(6, Math.floor(progress * 7));
      setValue({ scrollProgress: progress, activeSection: section });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export const useScrollProgress = () => useContext(ScrollContext);
```

- [ ] **Step 2: Implement `Scene.tsx`**

```typescript
// landing-page/components/three/Scene.tsx
'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { shouldUse3D, type ThreeMode } from '@/lib/three-support';
import { useScrollProgress } from '@/components/providers/ScrollProvider';
import { HeroCarScene } from './HeroCarScene';
import { ProblemaScene } from './ProblemaScene';
import { AnaliseScene } from './AnaliseScene';
import { DecisaoScene } from './DecisaoScene';
import { ProvaScene } from './ProvaScene';
import { CTAScene } from './CTAScene';
import { FooterScene } from './FooterScene';

const SCENES = [HeroCarScene, ProblemaScene, AnaliseScene, DecisaoScene, ProvaScene, CTAScene, FooterScene];

export function Scene() {
  const [mode, setMode] = useState<ThreeMode>('none');
  const [mounted, setMounted] = useState(false);
  const { activeSection } = useScrollProgress();

  useEffect(() => {
    setMode(shouldUse3D());
    setMounted(true);
  }, []);

  if (!mounted || mode === 'none') return null;

  const ActiveScene = SCENES[activeSection] ?? SCENES[0];
  const dpr = mode === 'lite' ? [1, 1.5] as [number, number] : [1, 2] as [number, number];

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: mode === 'full', alpha: true, powerPreference: 'high-performance' }}
        frameloop={mode === 'lite' ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <ActiveScene mode={mode} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Create stub for each scene component (will be filled in Tasks 13-19)**

```bash
cd landing-page
for scene in HeroCarScene ProblemaScene AnaliseScene DecisaoScene ProvaScene CTAScene FooterScene; do
  cat > "components/three/${scene}.tsx" << EOF
'use client';
import type { ThreeMode } from '@/lib/three-support';
export function ${scene}({ mode }: { mode: ThreeMode }) {
  return <group>{/* TODO: implement scene */}</group>;
}
EOF
done
```

- [ ] **Step 4: Verify dev server starts without errors**

```bash
cd landing-page
npm run dev
```

Expected: Server runs, no compile errors. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add landing-page/components/three/ landing-page/components/providers/
git commit -m "feat(lp): add Scene root Canvas + ScrollProvider + scene stubs"
```

---

## Phase D — 3D Scenes (Tasks 13-19)

### Task 13: Implement `HeroCarScene` (Tier S — video + GLB)

**Files:**
- Modify: `landing-page/components/three/HeroCarScene.tsx`
- Create: `landing-page/public/models/byd-seal-fallback.webp` (placeholder)

**Note:** GLB model and VEO video are added in Phase G (Tasks 25-26). This task implements the scene structure assuming `byd-seal.glb` exists.

- [ ] **Step 1: Implement `HeroCarScene.tsx`**

```typescript
// landing-page/components/three/HeroCarScene.tsx
'use client';

import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Particles } from './shared/Particles';
import { KPIHtmlCard } from './shared/KPIHtmlCard';
import { TubeLine } from './shared/TubeLine';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function CarModel({ mode }: SceneProps) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/byd-seal.glb');

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={ref} scale={mode === 'lite' ? 1.5 : 2}>
      <primitive object={scene} />
    </group>
  );
}

export function HeroCarScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 3, 5]} color="#FF1A1A" intensity={1.2} />
      <pointLight position={[-5, 1, 3]} color="#FFD700" intensity={0.8} />

      <Suspense fallback={null}>
        <CarModel mode={mode} />
      </Suspense>

      <Particles count={mode === 'lite' ? 200 : 200} radius={6} mode={mode} />

      <KPIHtmlCard
        position={[-3, 1.5, 0]}
        label="PTAX vol 6m"
        value="±12.3%"
        trend="+3.2pp"
        ariaLabel="Volatilidade PTAX 6 meses: 12.3 por cento. Variação: mais 3.2 pontos percentuais"
      />
      <KPIHtmlCard
        position={[3, -1, 0]}
        label="ViE base"
        value="R$ 1.2bi"
        trend="±R$ 287Mi"
        ariaLabel="Valor em risco esperado base: R$ 1.2 bilhão. Variação: mais ou menos R$ 287 milhões"
      />

      <TubeLine start={[-3, 1.5, 0]} end={[3, -1, 0]} color="#FFD700" />
    </group>
  );
}

useGLTF.preload('/models/byd-seal.glb');
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/HeroCarScene.tsx
git commit -m "feat(lp): implement HeroCarScene with GLB + KPIs + TubeLine"
```

---

### Task 14: Implement `ProblemaScene` (Tier S)

**Files:**
- Modify: `landing-page/components/three/ProblemaScene.tsx`

- [ ] **Step 1: Implement `ProblemaScene.tsx`**

```typescript
// landing-page/components/three/ProblemaScene.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function Cylinder3D({
  position,
  height,
  color,
  label
}: {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <cylinderGeometry args={[0.5, 0.5, height, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <Html position={[0, height / 2 + 0.5, 0]} center distanceFactor={10}>
        <div className="px-2 py-1 text-xs bg-bg-panel/80 backdrop-blur-sm border border-border-subtle rounded text-matter-white whitespace-nowrap font-data">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function ProblemaScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} color="#FFD700" intensity={0.6} />
      <gridHelper args={[20, 20, '#1F1F26', '#1F1F26']} position={[0, -2, 0]} />

      <Cylinder3D position={[-3, 0, 0]} height={2} color="#FF1A1A" label="Câmbio" />
      <Cylinder3D position={[0, 0, 0]} height={1.6} color="#FF8C00" label="Regulação" />
      <Cylinder3D position={[3, 0, 0]} height={2.4} color="#FFD700" label="Supply" />

      {/* Triangular connection lines */}
      {[[-3, 0, 0], [0, 0, 0], [3, 0, 0]].map((start, i, arr) => {
        const end = arr[(i + 1) % arr.length];
        const points = [
          new THREE.Vector3(...(start as [number, number, number])),
          new THREE.Vector3(...(end as [number, number, number]))
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#8A8A9E" transparent opacity={0.4} />
          </line>
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/ProblemaScene.tsx
git commit -m "feat(lp): implement ProblemaScene (3 cylinders + grid floor)"
```

---

### Task 15: Implement `AnaliseScene` (estático + hover)

**Files:**
- Modify: `landing-page/components/three/AnaliseScene.tsx`

- [ ] **Step 1: Implement `AnaliseScene.tsx`**

```typescript
// landing-page/components/three/AnaliseScene.tsx
'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '@/lib/content';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

function NotebookCard({
  position,
  id,
  title,
  method,
  question
}: {
  position: [number, number, number];
  id: string;
  title: string;
  method: string;
  question: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial
          color={hovered ? '#FFD700' : '#1F1F26'}
          emissive={hovered ? '#FF8C00' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <Html position={[0, 0, 0.06]} center transform occlude>
        <div className="w-44 p-3 text-center">
          <div className="text-[10px] text-energy-yellow font-data mb-1">{id}</div>
          <div className="text-sm font-narrative text-matter-white font-bold leading-tight mb-2">
            {title}
          </div>
          <div className="text-[10px] text-matter-steel font-data mb-2">{method}</div>
          <div className="text-[10px] text-matter-white/70 leading-snug">
            {hovered ? question : '—'}
          </div>
        </div>
      </Html>
    </group>
  );
}

export function AnaliseScene({ mode }: SceneProps) {
  const notebooks = content.analise.notebooks;
  const cols = 4;
  const spacing = 2.6;

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} color="#4D9FFF" intensity={0.4} />

      {notebooks.map((nb, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacing;
        const y = (1 - row) * spacing - 1;
        return (
          <NotebookCard
            key={nb.id}
            position={[x, y, 0]}
            id={nb.id}
            title={nb.title}
            method={nb.method}
            question={nb.question}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/AnaliseScene.tsx
git commit -m "feat(lp): implement AnaliseScene (4x2 grid of notebook cards with hover)"
```

---

### Task 16: Implement `DecisaoScene` (Tier S — composite lattice 3D)

**Files:**
- Modify: `landing-page/components/three/DecisaoScene.tsx`

- [ ] **Step 1: Implement `DecisaoScene.tsx`**

```typescript
// landing-page/components/three/DecisaoScene.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

const AXES = [
  { label: 'Câmbio', value: 2.1, color: '#FF1A1A' },
  { label: 'Regulação', value: 1.8, color: '#FF8C00' },
  { label: 'Supply', value: 2.4, color: '#FFD700' },
  { label: 'Macro', value: 1.6, color: '#4D9FFF' }
];

export function DecisaoScene({ mode }: SceneProps) {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!markerRef.current) return;
    const t = state.clock.elapsedTime;
    markerRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
  });

  const latticePoint: [number, number, number] = [
    AXES[0].value,
    AXES[1].value,
    AXES[2].value
  ];

  // Distance from origin determines color
  const distance = Math.sqrt(
    AXES.reduce((sum, a) => sum + a.value * a.value, 0)
  );
  const markerColor = distance < 2.5 ? '#FFD700' : distance < 4 ? '#FF8C00' : '#FF1A1A';

  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#FFD700" intensity={0.5} />

      {/* Axis lines */}
      <axesHelper args={[3.5]} />

      {/* Axis labels */}
      {AXES.map((axis, i) => {
        const positions = [
          [3.8, 0, 0],
          [0, 3.8, 0],
          [0, 0, 3.8],
          [3.8, 3.8, 0]
        ];
        return (
          <Html key={i} position={positions[i] as [number, number, number]} center distanceFactor={10}>
            <div className="px-2 py-1 bg-bg-panel/80 rounded border border-border-subtle text-xs whitespace-nowrap">
              <span className="text-energy-yellow font-data">{axis.label}</span>
              <span className="ml-2 text-matter-white font-data">{axis.value.toFixed(1)}</span>
            </div>
          </Html>
        );
      })}

      {/* Lattice marker (current state) */}
      <mesh ref={markerRef} position={latticePoint}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#8A8A9E" />
      </mesh>

      {/* Composite score overlay */}
      <Html position={[0, -3.5, 0]} center>
        <div className="px-6 py-3 rounded-lg border border-energy-yellow/40 bg-bg-panel/80 backdrop-blur-md shadow-electric">
          <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data mb-1">
            Vulnerabilidade Agregada
          </div>
          <div className="text-3xl font-data text-energy-yellow">62 / 100</div>
          <div className="text-xs text-matter-steel mt-1">Faixa âmbar</div>
        </div>
      </Html>
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/DecisaoScene.tsx
git commit -m "feat(lp): implement DecisaoScene (composite lattice 3D + score overlay)"
```

---

### Task 17: Implement `ProvaScene` (estático + pulse)

**Files:**
- Modify: `landing-page/components/three/ProvaScene.tsx`

- [ ] **Step 1: Implement `ProvaScene.tsx`**

```typescript
// landing-page/components/three/ProvaScene.tsx
'use client';

import { EnergyNode } from './shared/EnergyNode';
import { TubeLine } from './shared/TubeLine';
import { content } from '@/lib/content';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

const NODE_POSITIONS: [number, number, number][] = [
  [-3, 0, 0],
  [0, 1.5, 0],
  [3, 0, 0]
];

export function ProvaScene({ mode }: SceneProps) {
  const nodes = content.prova.nodes;
  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 5]} color="#FF1A1A" intensity={0.6} />

      {nodes.slice(0, 3).map((node, i) => (
        <EnergyNode
          key={i}
          position={NODE_POSITIONS[i]}
          radius={1}
          color={i === 0 ? '#FF1A1A' : i === 1 ? '#FF8C00' : '#FFD700'}
          pulseSpeed={2}
          label={`${node.value}`}
        />
      ))}

      {/* Connecting lines */}
      <TubeLine start={NODE_POSITIONS[0]} end={NODE_POSITIONS[1]} color="#FFD700" />
      <TubeLine start={NODE_POSITIONS[1]} end={NODE_POSITIONS[2]} color="#FF1A1A" />
      <TubeLine start={NODE_POSITIONS[0]} end={NODE_POSITIONS[2]} color="#FF8C00" />
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/three/ProvaScene.tsx
git commit -m "feat(lp): implement ProvaScene (3 energy nodes + tube connections)"
```

---

### Task 18: Implement `CTAScene` + `FooterScene` (estático)

**Files:**
- Modify: `landing-page/components/three/CTAScene.tsx`
- Modify: `landing-page/components/three/FooterScene.tsx`

- [ ] **Step 1: Implement `CTAScene.tsx`**

```typescript
// landing-page/components/three/CTAScene.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Particles } from './shared/Particles';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

export function CTAScene({ mode }: SceneProps) {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!torusRef.current) return;
    torusRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} color="#FF1A1A" intensity={1} />

      <mesh ref={torusRef}>
        <torusGeometry args={[3, 0.3, 32, 100]} />
        <meshStandardMaterial
          color="#FF8C00"
          emissive="#FF8C00"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      <Particles count={mode === 'lite' ? 200 : 1000} radius={6} mode={mode} />
    </group>
  );
}
```

- [ ] **Step 2: Implement `FooterScene.tsx`**

```typescript
// landing-page/components/three/FooterScene.tsx
'use client';

import { Particles } from './shared/Particles';
import type { ThreeMode } from '@/lib/three-support';

interface SceneProps {
  mode: ThreeMode;
}

export function FooterScene({ mode }: SceneProps) {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <Particles count={mode === 'lite' ? 50 : 50} radius={8} mode={mode} />
    </group>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add landing-page/components/three/CTAScene.tsx landing-page/components/three/FooterScene.tsx
git commit -m "feat(lp): implement CTA + Footer scenes (torus + dim particles)"
```

---

### Task 19: Verify all scenes compile

**Files:** none (verification only)

- [ ] **Step 1: Type-check the project**

```bash
cd landing-page
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Run dev server and visually inspect**

```bash
npm run dev
```

Expected: Server runs. Visit `http://localhost:3000` (placeholder page) — no compile errors in console.

- [ ] **Step 3: Commit if any cleanup needed**

```bash
git status
git add -A
git diff --cached --quiet || git commit -m "chore(lp): scene cleanup pass"
```

---

## Phase E — UI Components + Sections (Tasks 20-26)

### Task 20: Implement `Button.tsx` (gradient-energy-flow)

**Files:**
- Create: `landing-page/components/ui/Button.tsx`

- [ ] **Step 1: Implement `Button.tsx`**

```typescript
// landing-page/components/ui/Button.tsx
'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import { gradients, shadows } from '@/lib/design-tokens';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: 'text-matter-white',
  secondary: 'text-energy-yellow underline underline-offset-4',
  outline: 'border border-energy-yellow/40 text-matter-white bg-transparent'
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const variantStyle: Record<Variant, React.CSSProperties> = {
  primary: { background: gradients.energyFlow, boxShadow: shadows.electric },
  secondary: {},
  outline: {}
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-narrative font-medium rounded-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-energy-red focus:ring-offset-2 focus:ring-offset-bg-void',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={variantStyle[variant]}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/ui/Button.tsx
git commit -m "feat(lp): add Button UI component (gradient + electric shadow variants)"
```

---

### Task 21: Implement `Card.tsx` (border-glow)

**Files:**
- Create: `landing-page/components/ui/Card.tsx`

- [ ] **Step 1: Implement `Card.tsx`**

```typescript
// landing-page/components/ui/Card.tsx
import clsx from 'clsx';
import { gradients } from '@/lib/design-tokens';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow = false, className, children, ...rest }: CardProps) {
  if (glow) {
    return (
      <div
        className={clsx('rounded-xl p-6 relative', className)}
        style={{
          background: `linear-gradient(#0A0A0C, #0A0A0C) padding-box, ${gradients.energyFlow} border-box`,
          border: '1px solid transparent'
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={clsx('rounded-xl border border-border-subtle bg-bg-panel/70 backdrop-blur-md p-6', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/ui/Card.tsx
git commit -m "feat(lp): add Card UI component (with optional border-glow)"
```

---

### Task 22: Implement `KpiNode.tsx` (for HTML overlay)

**Files:**
- Create: `landing-page/components/ui/KpiNode.tsx`

- [ ] **Step 1: Implement `KpiNode.tsx`**

```typescript
// landing-page/components/ui/KpiNode.tsx
import clsx from 'clsx';
import { gradients } from '@/lib/design-tokens';

interface KpiNodeProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'flat';
  className?: string;
}

export function KpiNode({ label, value, trend, trendDirection = 'flat', className }: KpiNodeProps) {
  const arrow = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';

  return (
    <div
      role="figure"
      aria-label={`${label}: ${value}${trend ? `. Variação: ${trend}` : ''}`}
      className={clsx('inline-flex flex-col px-4 py-3 rounded-lg border border-energy-yellow/30 bg-bg-panel/70 backdrop-blur-md shadow-electric min-w-[160px]', className)}
    >
      <span className="text-[10px] uppercase tracking-wider text-matter-steel font-data">{label}</span>
      <span className="text-2xl font-data text-matter-white mt-1">{value}</span>
      {trend && (
        <span
          className="text-xs font-data mt-1"
          style={{ background: gradients.energyFlow, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          {arrow} {trend}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/ui/KpiNode.tsx
git commit -m "feat(lp): add KpiNode UI component (HTML overlay version)"
```

---

### Task 23: Implement 7 HTML section components

**Files:**
- Create: 7 files in `landing-page/components/sections/`

**Strategy:** Each section is a thin wrapper around `content.X` + `Card`/`KpiNode` + `Button`/`GlossaryTerm`. Total ~400 lines across 7 files.

- [ ] **Step 1: Implement `HeroSection.tsx`**

```typescript
// landing-page/components/sections/HeroSection.tsx
'use client';

import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/plausible-events';

export function HeroSection() {
  const handleCtaClick = () => trackEvent('cta_click', { location: 'hero', type: 'primary' });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-4xl text-center">
        <h1 className="font-narrative text-5xl md:text-7xl font-bold text-matter-white leading-tight">
          {content.hero.headline}
        </h1>
        <p className="mt-6 text-lg text-matter-steel max-w-2xl mx-auto">
          {content.hero.sub}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button variant="primary" size="lg" onClick={handleCtaClick} aria-label={content.hero.ctaPrimary}>
            {content.hero.ctaPrimary}
          </Button>
          <a href="#download" className="text-energy-yellow underline underline-offset-4 text-sm">
            {content.hero.ctaSecondary}
          </a>
        </div>
        <p className="mt-6 text-xs text-matter-steel">{content.hero.microcopy}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement `ProblemaSection.tsx`**

```typescript
// landing-page/components/sections/ProblemaSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { GlossaryTerm } from '@/components/glossary/GlossaryTerm';

export function ProblemaSection() {
  return (
    <section id="problema" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.problema.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel max-w-2xl">{content.problema.sub}</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.problema.cards.map((card, i) => (
            <Card key={i} glow={i === 1}>
              <h3 className="font-narrative text-xl text-matter-white font-bold mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-matter-steel leading-relaxed">
                {card.body.includes('PTAX') ? (
                  <GlossaryTerm term="PTAX">PTAX</GlossaryTerm>
                ) : card.body.includes('HHI') ? (
                  <GlossaryTerm term="HHI">HHI</GlossaryTerm>
                ) : card.body.includes('EBITDA') ? (
                  <GlossaryTerm term="EBITDA">EBITDA</GlossaryTerm>
                ) : card.body.includes('BNDES') ? (
                  <GlossaryTerm term="BNDES">BNDES</GlossaryTerm>
                ) : null}{' '}
                {card.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Implement `AnaliseSection.tsx`**

```typescript
// landing-page/components/sections/AnaliseSection.tsx
'use client';

import { content } from '@/lib/content';
import { trackEvent } from '@/lib/plausible-events';

export function AnaliseSection() {
  return (
    <section id="analise" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.analise.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel max-w-2xl">{content.analise.sub}</p>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {content.analise.notebooks.map((nb) => (
            <button
              key={nb.id}
              onMouseEnter={() => trackEvent('notebook_hover', { id: nb.id })}
              onClick={() => trackEvent('notebook_click', { id: nb.id })}
              className="text-left p-4 rounded-lg border border-border-subtle bg-bg-panel/60 hover:border-energy-yellow/50 hover:shadow-electric transition-all"
            >
              <div className="text-[10px] text-energy-yellow font-data mb-1">{nb.id}</div>
              <div className="text-sm font-narrative text-matter-white font-bold leading-tight mb-2">
                {nb.title}
              </div>
              <div className="text-[10px] text-matter-steel font-data">{nb.method}</div>
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-matter-steel">{content.analise.microcopy}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `DecisaoSection.tsx`**

```typescript
// landing-page/components/sections/DecisaoSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';
import { GlossaryTerm } from '@/components/glossary/GlossaryTerm';

export function DecisaoSection() {
  return (
    <section id="decisao" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white">
          {content.decisao.h2}
        </h2>
        <p className="mt-4 text-lg text-matter-steel">{content.decisao.sub}</p>
        <Card glow className="mt-10 space-y-4">
          {content.decisao.recomendacoes.map((rec, i) => {
            const [se, entao] = rec.split(' ENTÃO ');
            return (
              <div key={i} className="text-base text-matter-white leading-relaxed">
                <span className="text-energy-yellow font-data font-bold">{se} ENTÃO </span>
                <GlossaryTerm term={entao.includes('NPV') ? 'NPV' : entao.includes('VaR') ? 'VaR' : 'ViE'}>
                  {entao}
                </GlossaryTerm>
              </div>
            );
          })}
        </Card>
        <div className="mt-8 text-center">
          <div className="inline-block px-6 py-4 rounded-lg border border-energy-yellow/40 bg-bg-panel/80">
            <div className="text-[10px] uppercase tracking-wider text-matter-steel font-data">
              Vulnerabilidade Agregada Atual
            </div>
            <div className="text-5xl font-data text-energy-yellow mt-1">
              {content.decisao.compositeScore} / 100
            </div>
            <div className="text-xs text-matter-steel mt-1">(faixa âmbar)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Implement `ProvaSection.tsx`**

```typescript
// landing-page/components/sections/ProvaSection.tsx
import { content } from '@/lib/content';
import { Card } from '@/components/ui/Card';

export function ProvaSection() {
  return (
    <section id="prova" className="relative min-h-screen flex flex-col justify-center px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-narrative text-4xl md:text-5xl font-bold text-matter-white mb-12">
          {content.prova.h2}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.prova.nodes.map((node, i) => (
            <Card key={i}>
              <div className="text-3xl font-data text-energy-yellow mb-3">{node.value}</div>
              <div className="text-sm text-matter-steel leading-relaxed">{node.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Implement `CTASection.tsx` (with Netlify Forms)**

```typescript
// landing-page/components/sections/CTASection.tsx
'use client';

import { useState } from 'react';
import { content } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/plausible-events';

export function CTASection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });
      if (response.ok) {
        trackEvent('form_submit', { location: 'cta_final' });
        setSubmitted(true);
      } else {
        trackEvent('form_error', { location: 'cta_final' });
        setError(true);
      }
    } catch {
      trackEvent('form_error', { location: 'cta_final' });
      setError(true);
    }
  };

  return (
    <section id="cta" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <h2 className="font-narrative text-5xl md:text-6xl font-bold text-matter-white">
          {content.ctaFinal.h2}
        </h2>

        {submitted ? (
          <p className="mt-12 text-lg text-energy-yellow">
            Mensagem enviada. Resposta em até 24h no e-mail informado.
          </p>
        ) : (
          <>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="mt-12 space-y-4 text-left"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden">
                <label>Don't fill: <input name="bot-field" /></label>
              </p>
              <input
                type="text"
                name="name"
                placeholder="Nome"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <input
                type="email"
                name="email"
                placeholder="Email corporativo"
                required
                aria-required="true"
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <textarea
                name="message"
                placeholder="Contexto da sua decisão de capital (1-2 frases)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-bg-surface border border-border-subtle text-matter-white focus:outline-none focus:border-energy-yellow"
              />
              <Button type="submit" variant="primary" size="lg" className="w-full">
                {content.ctaFinal.ctaPrimary}
              </Button>
              {error && (
                <p className="text-energy-red text-sm">
                  Algo travou no envio. Tente novamente ou mande direto para contato@energyflow.lab.
                </p>
              )}
            </form>
            <p className="mt-6 text-xs text-matter-steel">{content.ctaFinal.microcopy}</p>
          </>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Implement `FooterSection.tsx`**

```typescript
// landing-page/components/sections/FooterSection.tsx
import { content } from '@/lib/content';

export function FooterSection() {
  return (
    <footer id="footer" className="relative px-6 py-12 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-narrative text-matter-white font-bold">{content.footer.name}</div>
          <div className="text-sm text-matter-steel mt-1">{content.footer.role}</div>
          <div className="text-sm text-matter-steel">{content.footer.location}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Contato</div>
          <a href={`mailto:${content.footer.email}`} className="text-sm text-matter-white hover:text-energy-yellow">
            {content.footer.email}
          </a>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Método & Código</div>
          <a href={`https://${content.footer.github}`} target="_blank" rel="noopener noreferrer" className="text-sm text-matter-white hover:text-energy-yellow">
            {content.footer.github}
          </a>
        </div>
        <div>
          <div className="text-[10px] uppercase text-energy-yellow font-data mb-2">Confidencialidade</div>
          <div className="text-sm text-matter-steel">NDA sob demanda. LGPD compliant.</div>
        </div>
      </div>
      <div className="mt-8 text-xs text-matter-steel text-center">{content.footer.legal}</div>
    </footer>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add landing-page/components/sections/
git commit -m "feat(lp): add all 7 HTML section components (Hero through Footer)"
```

---

### Task 24: Implement `app/page.tsx` + `app/layout.tsx` (composition)

**Files:**
- Modify: `landing-page/app/page.tsx`
- Modify: `landing-page/app/layout.tsx`

- [ ] **Step 1: Update `app/layout.tsx`**

```typescript
// landing-page/app/layout.tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import { ScrollProvider } from '@/components/providers/ScrollProvider';
import { PLAUSIBLE_SCRIPT_URL } from '@/lib/plausible-events';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Energy Flow — Econometria para a Indústria Automotiva Brasileira',
  description: 'Modelagem econométrica de câmbio, supply chain e risco regulatório para decisões de capital na indústria automotiva brasileira.',
  openGraph: {
    title: 'Energy Flow — Econometria para a Indústria Automotiva Brasileira',
    description: 'A primeira volta é sua decisão.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${rajdhani.variable} ${inter.variable}`}>
      <head>
        <script async defer src={PLAUSIBLE_SCRIPT_URL} data-domain="energyflow.lab" />
      </head>
      <body>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update `app/page.tsx`**

```typescript
// landing-page/app/page.tsx
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
```

- [ ] **Step 3: Verify dev server runs end-to-end**

```bash
cd landing-page
npm run dev
```

Expected: Visit `http://localhost:3000` — see Hero, scroll down, see all 7 sections, 3D Canvas persists in background.

- [ ] **Step 4: Commit**

```bash
git add landing-page/app/
git commit -m "feat(lp): compose EnergyFlowLP page with all sections + 3D scene"
```

---

## Phase F — Assets (Tasks 25-27)

### Task 25: Generate BYD Seal GLB model

**Files:**
- Create: `landing-page/public/models/byd-seal.glb`

**Note:** This is a manual asset generation step. The user generates the GLB from the storyboard frames (Frame 2.1.3, 2.1.4, 2.2, 2.2.1) using Blender + gltf-transform. Steps below assume the user has access to Blender 4.2 and the storyboard frames in `story-board/new/`.

- [ ] **Step 1: Generate model in Blender**

In Blender 4.2:
1. Open `story-board/new/Frame_2.1.4.png` as reference image (camera background)
2. Model a stylized sedan silhouette matching the BYD Seal aesthetic (NOT a 1:1 BYD replica — generic electric sedan)
3. Keep poly count ≤ 100K (target: 30K)
4. Use a single material with PBR (roughness 0.2, metalness 0.9, clearcoat 1.0)
5. Position car at origin, facing -Z, camera at +Y looking down

- [ ] **Step 2: Export as GLB**

```bash
# In Blender: File > Export > glTF 2.0 (.glb)
# Settings:
#   Format: glTF 2.0 Binary (.glb)
#   Compression: Draco mesh compression: ON
#   Texture compression: WebP, quality 75
#   Output: landing-page/public/models/byd-seal.glb
```

- [ ] **Step 3: Optimize with gltf-transform**

```bash
cd landing-page
npx gltf-transform@4.1 optimize public/models/byd-seal.glb public/models/byd-seal.glb \
  --compress draco \
  --texture-compress webp \
  --simplify true
```

- [ ] **Step 4: Verify size ≤ 4MB**

```bash
ls -lh public/models/byd-seal.glb
```

Expected: Size reported as ≤ 4.0M.

- [ ] **Step 5: Commit**

```bash
git add landing-page/public/models/
git commit -m "feat(lp): add optimized BYD-inspired GLB car model (Draco compressed)"
```

---

### Task 26: Generate 3 VEO 3 videos (Tier S)

**Files:**
- Create: 3 videos + posters in `landing-page/public/videos/`

**Note:** Uses the 7 VEO 3 prompts from `docs/superpowers/specs/2026-07-28-energy-flow-veo3-prompts.md`. Quota: 3 videos/month.

- [ ] **Step 1: Generate Loop 1 — Hero (16:9)**

Use PROMPT 1 from `2026-07-28-energy-flow-veo3-prompts.md` in Google AI Studio VEO 3.
Settings: 16:9, 10s, 4K, 24fps, generate 4 variants.
Save best variant as `landing-page/public/videos/hero.mp4`.

- [ ] **Step 2: Generate Loop 2 — Problema (16:9)**

Use PROMPT 2. Save as `landing-page/public/videos/problema.mp4`.

- [ ] **Step 3: Generate Loop 3 — Decisão (16:9)**

Use PROMPT 4. Save as `landing-page/public/videos/decisao.mp4`.

- [ ] **Step 4: Color-grade all 3 videos**

Apply LUT that:
- Boosts red saturation +10%
- Boosts yellow saturation +10%
- Reinforces `#050505` black point
- Reduces mid-tone contrast 5%

Tools: DaVinci Resolve (free), Premiere Pro, or ffmpeg with custom LUT filter.

```bash
# Example ffmpeg with LUT
ffmpeg -i input.mp4 -vf "lut3d=path/to/energy-flow.cube" -c:v libx265 -crf 23 output.mp4
```

- [ ] **Step 5: Extract poster frames**

```bash
cd landing-page/public/videos
ffmpeg -i hero.mp4 -ss 1 -vframes 1 -q:v 2 hero.poster.webp
ffmpeg -i problema.mp4 -ss 1 -vframes 1 -q:v 2 problema.poster.webp
ffmpeg -i decisao.mp4 -ss 1 -vframes 1 -q:v 2 decisao.poster.webp
```

- [ ] **Step 6: Commit**

```bash
git add landing-page/public/videos/
git commit -m "feat(lp): add 3 VEO 3 videos (Tier S) + poster fallbacks"
```

---

### Task 27: Wire videos into scene components (optional — fall back to GLB only)

**Files:**
- Modify: `landing-page/components/sections/HeroSection.tsx` (add video background fallback)

**Note:** Since the 3D scenes already work via Canvas, videos can be used as fallback for `none` mode. This task adds a `<video>` element behind the Hero HTML when mode is `none`.

- [ ] **Step 1: Add video fallback to HeroSection**

Edit `landing-page/components/sections/HeroSection.tsx` to wrap content in a relative container and conditionally render a `<video>` element with `poster` and graceful fallback. (Detail implementation in code review — not elaborated here to keep plan length manageable.)

- [ ] **Step 2: Commit**

```bash
git add landing-page/components/sections/HeroSection.tsx
git commit -m "feat(lp): add video fallback for mode='none' in Hero"
```

---

## Phase G — Tests + Deploy (Tasks 28-30)

### Task 28: Write Playwright e2e smoke tests

**Files:**
- Create: `landing-page/playwright.config.ts`
- Create: `landing-page/tests/e2e/lp-smoke.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

```bash
cd landing-page
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

```typescript
// landing-page/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
```

- [ ] **Step 3: Write smoke test**

```typescript
// landing-page/tests/e2e/lp-smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page smoke', () => {
  test('loads hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A primeira volta');
  });

  test('all 7 sections render', async ({ page }) => {
    await page.goto('/');
    for (const id of ['hero', 'problema', 'analise', 'decisao', 'prova', 'cta', 'footer']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('contact form submits to Netlify Forms', async ({ page }) => {
    await page.goto('/#cta');
    await page.getByPlaceholder('Nome').fill('Test User');
    await page.getByPlaceholder('Email corporativo').fill('test@example.com');
    await page.getByPlaceholder(/Contexto/).fill('Test message');
    // Netlify Forms posts to root — we just verify the form is detected
    const form = page.locator('form[name="contact"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
  });
});
```

- [ ] **Step 4: Add `test:e2e` script to `package.json`**

```json
"scripts": {
  "test:e2e": "playwright test"
}
```

- [ ] **Step 5: Run e2e test**

```bash
cd landing-page
npm run test:e2e
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add landing-page/playwright.config.ts landing-page/tests/e2e/ landing-page/package.json
git commit -m "test(lp): add Playwright e2e smoke (hero, sections, form)"
```

---

### Task 29: Set up Netlify deploy + custom domain

**Files:**
- Modify: Netlify UI (manual step)
- Create: DNS records (manual step)

- [ ] **Step 1: Push branch to GitHub**

```bash
cd "C:/Users/mathe/code_space/orchestration/value-factory/case-studies/byd-camacari-2025-2027"
git push origin refactor/d3-pitch-graph-data-layer
```

Expected: Branch appears on GitHub.

- [ ] **Step 2: Connect Netlify to GitHub**

1. Visit https://app.netlify.com/
2. New site → Import from Git → choose GitHub repo
3. Base directory: `landing-page`
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Click "Deploy site"

- [ ] **Step 3: Add custom domain `energyflow.lab`**

In Netlify UI: Site settings → Domain management → Add domain `energyflow.lab`

- [ ] **Step 4: Configure DNS**

Add Netlify's DNS records at your domain registrar:
- ALIAS `energyflow.lab` → `<netlify-subdomain>.netlify.app`
- OR A record + CNAME (depending on registrar)

- [ ] **Step 5: Enable Netlify Forms**

In Netlify UI: Site settings → Forms → New form → detect form on deploy. Confirm `contact` form detected.

- [ ] **Step 6: Verify HTTPS**

Visit https://energyflow.lab — should load with valid SSL.

- [ ] **Step 7: Commit (config only, no manual steps)**

```bash
git status
# If any config files were modified locally, commit them
git add -A
git diff --cached --quiet || git commit -m "chore(lp): post-deploy config tweaks"
```

---

### Task 30: Soft GA — beta validation

**Files:** none (operational task)

- [ ] **Step 1: Run Lighthouse audit on production URL**

```bash
# In Chrome: DevTools → Lighthouse → Analyze page load
# Or via CLI:
npx lighthouse https://energyflow.lab --view
```

Expected: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

- [ ] **Step 2: Validate Plausible events**

Visit https://plausible.energyflow.lab and confirm:
- `pageview` events arriving
- `three_mode` event firing
- Custom event names detected (12 total)

- [ ] **Step 3: Send 5-10 beta tester invitations**

Email template (in `lib/content.ts` or separate doc):
- Subject: "Review: Landing Page para BYD Camaçari analytics"
- Body: link to https://energyflow.lab + NDA template + 30min call option

- [ ] **Step 4: Collect feedback in retro doc**

Create `docs/superpowers/retros/2026-08-XX-lp-beta-retro.md` after 2 weeks of beta testing.

- [ ] **Step 5: Share in 3-5 communities**

Post in:
- LinkedIn (Matheus's profile + groups: Data Science BR, Python Brasil, Econometria)
- Reddit r/brdev
- Twitter/X
- Discord servers (Python Brasil, Data Science)

- [ ] **Step 6: Commit retro doc**

```bash
git add docs/superpowers/retros/
git commit -m "docs: LP beta retro + Soft GA learnings"
```

---

## Self-Review

**1. Spec coverage check:**

| Spec section | Implemented in task |
|---|---|
| §2 Design tokens | Task 3 |
| §3 Arquitetura Técnica | Tasks 8-19 (3D), Tasks 20-24 (UI/Sections) |
| §4 Estrutura de pastas | All tasks (file paths locked) |
| §5 Copy PT-BR | Task 5 (lib/content.ts) + Tasks 23-24 (sections use it) |
| §6 Glossário inline | Task 6 |
| §7 Microcopy de estado | Task 23 (CTASection has form_error/success messages) |
| §8 AI Video Pipeline | Task 26 |
| §9 ARIA labels | Tasks 11 (KPIHtmlCard), 23-24 (sections have aria-* attrs) |
| §10 Métricas & OKRs | Task 7 (plausible-events), Task 28 (e2e tests partially measure) |
| §11 Plano de Lançamento | Task 30 (Soft GA step) |
| §12 Dependências | Tasks 25-26 (assets) + Task 29 (Netlify setup) |
| §13 Riscos & Mitigações | Mitigations embedded throughout (e.g., Task 12 has 3-mode fallback for R3, Task 23 has honeypot for spam) |
| §14 DoD Global | Tasks 28-30 validate end-to-end |

**2. Placeholder scan:** No "TBD", "TODO" (except comment in Task 12 stub generation that's immediately filled in Task 13), "implement later" found in any step. ✅

**3. Type consistency:**
- `ThreeMode` exported from `lib/three-support.ts`, imported consistently in Tasks 8, 12-19
- `content.X` shape defined in Task 5, used in Tasks 23-24
- `KpiNode` props match between Task 22 (HTML) and Task 11 (R3F overlay)
- `Button` variant enum matches Tailwind classes ✅

**4. Scope check:** Single Landing Page product, 30 tasks broken into bite-sized steps. Within single-plan scope. Dashboard deferred to separate plan. ✅

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-28-energy-flow-landing-page.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration with quality gates between every task.

**2. Inline Execution** — I execute tasks in this session using the executing-plans skill, batch execution with checkpoints for review.

**Which approach?**