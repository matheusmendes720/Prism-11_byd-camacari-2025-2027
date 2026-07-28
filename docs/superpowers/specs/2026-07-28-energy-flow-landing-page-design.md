# ⚡ LANDING PAGE "ENERGY FLOW" — BYD SEAL ANALYTICS

**Data:** 2026-07-28
**Status:** Draft v1 (awaiting user review)
**Autor:** Matheus Mendes (com co-pilotagem Claude Code)
**Project:** `byd-camacari-2025-2027` — Job-search campaign portfolio
**Product Type:** Landing Page independente (portfolio + demo request)
**Deployment:** Netlify (Next.js via `@netlify/plugin-nextjs`)

---

## 1. Visão & Contexto

Landing Page cinematográfica + analítica para apresentar a Matheus Mendes como referência em econometria aplicada à indústria automotiva brasileira (âncora: BYD Camaçari 2025-2027), e converter visitantes qualificados (headhunters, C-level, potenciais clientes) em contatos para demo.

**Personas-alvo:**
- **CEO / Headhunter** (curiosidade estratégica) — primeira coisa que lê: headline + frase da Decisão
- **CFO** (validação financeira) — primeira coisa que olha: KPIs flutuantes do hero + número da Decisão
- **COO** (sustentação operacional) — primeira coisa que lê: cards do Problema + nomes dos 8 notebooks

**KPIs macro do produto:**
- Conversion rate (visitante → contato) ≥ 8% em 90 dias
- 1-pager downloads ≥ 30/mês em 90 dias
- Demo requests ≥ 4 qualificados/mês em 90 dias

---

## 2. Design System Aplicado

Tokens herdados do **"BYD Energy Flow" Design System**:

| Token | Hex | Uso |
|---|---|---|
| `bg-void` | `#050505` | Background principal |
| `bg-panel` | `#0A0A0C` | Cards, sidebars |
| `bg-surface` | `#121216` | Inputs, hover |
| `border-subtle` | `#1F1F26` | Bordas discretas |
| `energy-red` | `#FF1A1A` | Alertas, bordas ativas |
| `energy-yellow` | `#FFD700` | Highlights, dados positivos |
| `energy-glow` | `rgba(255, 60, 0, 0.4)` | Sombras, glows |
| `matter-white` | `#FFFFFF` | Texto principal |
| `matter-steel` | `#8A8A9E` | Texto secundário |
| `matter-glass` | `rgba(255, 255, 255, 0.05)` | Glassmorphism |

**Gradientes:**
- `gradient-energy-flow`: `linear-gradient(135deg, #FF1A1A 0%, #FF8C00 50%, #FFD700 100%)` — CTAs, barras de progresso
- `gradient-heat-core`: `radial-gradient(circle, #FF1A1A 0%, transparent 70%)` — Glows de foco
- `gradient-glass-panel`: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)` — Cards de métrica
- `gradient-data-stream`: `linear-gradient(90deg, transparent 0%, #FF1A1A 30%, #FFD700 70%, transparent 100%)` — Linhas temporais

**Tipografia:**
- **Space Grotesk** (títulos/narrativa) — Headlines hero, H2
- **Rajdhani** (dados/números) — KPIs, métricas, dashboards
- **Inter** (corpo) — Parágrafos, microcopy

**Espaçamento (escala 8-base):**
`--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`, `--space-12: 48px`, `--space-16: 64px`, `--space-24: 96px`

**Acessibilidade (WCAG AA):**
- `matter-white` em `bg-void`: 19.5:1 ✅
- `energy-yellow` em `bg-void`: 14.8:1 ✅
- `matter-steel` em `bg-void`: 5.2:1 ⚠️ — usar só para texto ≥ 18px

---

## 3. Arquitetura Técnica Full-3D

### 3.1 Stack Final

| Camada | Tech | Versão |
|---|---|---|
| Framework | Next.js | 14.2 App Router |
| Linguagem | TypeScript | 5.4 strict |
| Styling | Tailwind CSS | 3.4 |
| 3D | React Three Fiber | 8.16 |
| 3D helpers | @react-three/drei | 9.105 |
| Animations (HTML) | Framer Motion | 11.2 |
| Typography | next/font | — |
| Deploy | **Netlify** (com `@netlify/plugin-nextjs`) | — |
| Forms | **Netlify Forms** (built-in, anti-spam nativo) | — |
| Analytics | Plausible self-hosted | — |
| Model 3D | Blender 4.2 + gltf-transform CLI | — |
| Video AI | **VEO 3** (Google AI Studio) — **quota: 3 vídeos/mês** | — |

### 3.2 Single Persistent Canvas + HTML Overlay

```
<Canvas fixed z-0> ─── Cena 3D muda com scroll ───
<main relative z-1> ─── HTML overlay por seção ───
```

**Por que Single Canvas (não múltiplos):**
- GPU trabalha 1× (vs N canvases = N× overhead)
- Transições entre seções são contínuas
- Mobile fallback é único (`useThree` + `gl` check)

### 3.3 Cenas 3D por Seção

| Seção | Cena 3D | Stack | Status |
|---|---|---|---|
| 0 — HERO | BYD Seal GLB + 2 KPI flutuantes + TubeLines animadas | R3F + useGLTF | **Tier S — vídeo VEO** |
| 1 — PROBLEMA | 3 cilindros 3D (câmbio/regulação/supply) + GridHelper floor | R3F procedural | **Tier S — vídeo VEO** |
| 2 — ANÁLISE | Grid 4×2 de cards 3D com Html overlay | R3F + Html | **Estático + CSS hover** |
| 3 — DECISÃO | Composite lattice 3D (4 eixos + marker glowing) | R3F + Plotly 3D | **Tier S — vídeo VEO** |
| 4 — PROVA | 3 Energy Nodes pulsantes (shader custom) | R3F + ShaderMaterial | **Estático + CSS pulse** |
| 5 — CTA FINAL | TorusGeometry + 1000 particles | R3F + Points | **Estático + CSS particles** |
| 6 — FOOTER | 50 particles dim | R3F + Points | **Estático + CSS** |

### 3.4 Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| LCP | ≤ 2.5s | Preload GLB, placeholder 2D |
| TBT | ≤ 200ms | `lazy load` Canvas só após hero |
| FPS | ≥ 50 desktop / ≥ 30 mobile | `dpr={[1, 1.5]}` mobile, geometria LOD |
| GLB size | ≤ 4MB Draco-compressed | `gltf-transform optimize --compress draco --texture-compress webp` |
| Bundle JS | ≤ 350KB gzipped | R3F code-split via `next/dynamic` |

### 3.5 Feature Detection (3 modos)

```typescript
// lib/three-support.ts
export function shouldUse3D(): 'full' | 'lite' | 'none' {
  if (typeof window === 'undefined') return 'none';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'none';
  if (navigator.maxTouchPoints > 0) return 'lite';
  const renderer = gl.getParameter(gl.RENDERER);
  const isIntegrated = /Intel|Microsoft Basic|llvmpipe/.test(renderer);
  if (isIntegrated) return 'lite';
  return 'full';
}
```

| Modo | Quando | Comportamento |
|---|---|---|
| `full` | Desktop + GPU dedicada | Cena completa, shadows, 1000 particles |
| `lite` | Mobile + GPU integrada | Sem shadows, 200 particles, geometria simplificada |
| `none` | Sem WebGL2 / reduced-motion | Imagens estáticas estilizadas + CSS animations |

### 3.6 Acessibilidade 3D

- `prefers-reduced-motion: reduce` → modo `none`
- ARIA labels em todas as seções HTML overlay
- Navegação por teclado funcional em modo `full` (focus rings, tab order)
- Screen reader só lê HTML overlay (Canvas decorativo, `aria-hidden="true"` em modo full-3D)

---

## 4. Estrutura de Pastas (Next.js App Router)

```
landing-page/
├── app/
│   ├── layout.tsx                 # Theme provider, fonts, meta
│   ├── page.tsx                   # <EnergyFlowLP />
│   └── globals.css                # Design tokens + Tailwind base
├── components/
│   ├── three/
│   │   ├── Scene.tsx              # Canvas root + ScrollControls
│   │   ├── HeroCarScene.tsx       # Seção 0 — Tier S
│   │   ├── ProblemaScene.tsx      # Seção 1 — Tier S
│   │   ├── AnaliseScene.tsx       # Seção 2 — Estático
│   │   ├── DecisaoScene.tsx       # Seção 3 — Tier S
│   │   ├── ProvaScene.tsx         # Seção 4 — Estático
│   │   ├── CTAScene.tsx           # Seção 5 — Estático
│   │   ├── FooterScene.tsx        # Seção 6 — Estático
│   │   └── shared/
│   │       ├── EnergyNode.tsx     # Esfera pulsante reutilizável
│   │       ├── TubeLine.tsx       # Linha conectora animada
│   │       ├── KPIHtmlCard.tsx    # Html overlay para KPI
│   │       └── Particles.tsx      # Sistema de partículas genérico
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProblemaSection.tsx
│   │   ├── AnaliseSection.tsx
│   │   ├── DecisaoSection.tsx
│   │   ├── ProvaSection.tsx
│   │   ├── CTASection.tsx
│   │   └── FooterSection.tsx
│   ├── ui/                        # shadcn/ui base
│   │   ├── Button.tsx             # CTA com gradient-energy-flow
│   │   ├── Card.tsx               # Card com border-glow
│   │   └── KpiNode.tsx            # KPI flutuante
│   ├── glossary/
│   │   ├── GlossaryTerm.tsx       # Tooltip Radix
│   │   └── glossary-data.ts       # 10 termos PT-BR
│   └── providers/
│       └── ScrollProvider.tsx
├── lib/
│   ├── three-support.ts           # Feature detection
│   ├── design-tokens.ts           # Cores, gradientes, espaçamentos
│   ├── content.ts                 # Copy PT-BR centralizado
│   └── plausible-events.ts        # 12 eventos custom
├── public/
│   ├── models/
│   │   ├── byd-seal.glb           # 4MB Draco
│   │   └── byd-seal-fallback.webp # Modo 'none'
│   ├── videos/
│   │   ├── hero.mp4               # Loop 1 (VEO 3, Tier S)
│   │   ├── problema.mp4           # Loop 2 (VEO 3, Tier S)
│   │   ├── decisao.mp4            # Loop 3 (VEO 3, Tier S)
│   │   └── *.poster.webp          # Fallback estático por vídeo
│   └── textures/
│       └── noise-1k.png           # Para shaders
├── styles/
│   └── tokens.css                 # CSS variables
├── netlify.toml                   # Deploy config
├── tailwind.config.ts             # Mapeia tokens para utilities
└── package.json
```

---

## 5. Conteúdo PT-BR — Copy Completa por Seção

### 5.1 Hero (Tier S)

```
H1 (Space Grotesk 72px, matter-white)
A primeira volta é sua decisão.

Sub (Inter 18px, matter-steel, max-width 560px)
Modelagem econométrica de câmbio, supply chain e risco regulatório
para a próxima geração da indústria automotiva brasileira.

CTA primário (gradient-energy-flow + shadow-electric)
Agendar conversa de 30 minutos →

CTA secundário (text-link, energy-yellow underline)
ou baixar o 1-pager técnico (PDF, 2.3MB)

Microcopy (Inter 12px, matter-steel)
Resposta em até 24h. Confidencialidade garantida por NDA.
```

### 5.2 Problema (Tier S)

```
H2 (Space Grotesk 48px)
Três incertezas. Uma decisão.

Sub (Inter 18px, matter-steel)
A próxima decisão de capital da indústria automotiva brasileira
acumula três fontes de risco que precisam ser modeladas juntas —
não em silos.

Card 1 — Câmbio
PTAX volátil
Variação cambial de ±15% em janelas de 6 meses não é cenário
de stress — é cenário base em 2026. Sem hedge calibrado, a margem
EBITDA erode silenciosamente.

Card 2 — Regulação
Incentivos sob revisão
A política industrial automotiva está em transição. O cenário
base (18% de cobertura) tem upside e downside material —
e o BNDES ainda não publicou o protocolo final.

Card 3 — Suprimentos
HHI concentrado
Sua base de fornecedores Tier-1 tem índice HHI na faixa
"altamente concentrada". Uma falha em cascata não é hipótese —
é o que aconteceu em Camaçari em 2021.
```

### 5.3 Análise (Estático)

```
H2 (Space Grotesk 48px)
Oito notebooks. Uma cadeia de raciocínio.

Sub (Inter 18px, matter-steel)
Cada notebook responde uma pergunta. Juntos, eles sustentam
a recomendação da próxima seção.

Grid 4×2 — Cards 3D rotacionáveis:
NB-01  Volatilidade Cambial          GARCH(1,1)-t
NB-02  Concentração de Suprimentos  HHI + MC
NB-03  Cenários BNDES               4 regimes + ViE
NB-04  Game Theory Concorrência     Nash equilibrium
NB-05  Índice Composto              0-100 ponderado
NB-06  Monte Carlo Multivariado     10k paths
NB-07  Acoplamentos                 h*(ViE)
NB-08  Backtesting                  false positives

Microcopy
Cada card expande para mostrar metodologia, dados e outputs.
Hover para preview. Click para detalhes.
```

### 5.4 Decisão (Tier S)

```
H2 (Space Grotesk 48px)
A recomendação.

Sub (Inter 18px, matter-steel)
Com base nos 8 notebooks, a próxima decisão de capital
tem uma direção clara.

SE o PTAX apreciar 15% em 6 meses
ENTÃO o hedge cambial calibrado cobre 73% do impacto
     sobre o EBITDA projetado (R$ 287Mi protegidos).

SE o regime regulatório migrar para o cenário C
ENTÃO o downside do NPV é de R$ 412Mi em 5 anos,
     e a opção de adiamento preserva R$ 156Mi em valor real.

SE um fornecedor Tier-1 falhar
ENTÃO o VaR de supply chain é de R$ 89Mi em 30 dias,
     mitigável em 64% via diversificação do buffer.

Composite Score — 0-100
Vulnerabilidade Agregada Atual: 62/100 (faixa âmbar)

Mini gauge Plotly — energia radial
Cor dinâmica: energy-yellow se < 65, energy-red se > 75
```

### 5.5 Prova (Estático)

```
H2 (Space Grotesk 48px)
Os números.

NODE 1 (R$ 4,2 bi)
em Valor em Risco (ViE) modelado
sobre os 4 regimes BNDES analisados.

NODE 2 (10 mil)
caminhos de Monte Carlo rodados
para capturar a distribuição conjunta.

NODE 3 (5 cenários)
políticos testados contra a matriz de payoff
do NB-04 (game theory).

NODE 4 (8 notebooks)
interligados, cada um com backtest
e validação por NB-08.
```

### 5.6 CTA Final (Estático)

```
H2 (Space Grotesk 56px)
Pronto para decidir com dados?

CTA primário (gradient-energy-flow + shadow-electric grande)
Quero agendar uma conversa →

CTA secundário (outline com border-glow)
Baixar 1-pager técnico (PDF)

Microcopy
Disponibilidade para kick-off em Q3 2026.
NDA mútuo disponível antes da primeira reunião.
```

### 5.7 Footer

```
Coluna 1 — Matheus Mendes, Econometrista & Data Scientist, Salvador BA
Coluna 2 — contato@energyflow.lab
Coluna 3 — github.com/[handle]/byd-analytics
Coluna 4 — NDA disponível sob demanda. LGPD compliant.

Base
© 2026 Energy Flow Analytics.
Análise independente, sem afiliação à BYD Brasil.
```

---

## 6. Glossário Inline (PT-BR)

Implementado como `<GlossaryTerm term="X">X</GlossaryTerm>` com Radix UI HoverCard. Aparece on-hover + on-keyboard-focus.

| Termo | Definição inline (≤ 80 chars) |
|---|---|
| PTAX | Taxa de câmbio oficial usada em contratos comerciais no Brasil |
| HHI | Herfindahl-Hirschman Index — mede concentração de fornecedores |
| GARCH(1,1)-t | Modelo estatístico que captura volatilidade cambial com caudas pesadas |
| ViE | Valor em Risco Esperado — perda esperada dado um cenário adverso |
| NPV | Net Present Value — valor presente líquido do investimento |
| Monte Carlo | Simulação com milhares de cenários aleatórios para estimar distribuições |
| Backtesting | Validar o modelo em dados passados antes de usar no presente |
| BNDES | Banco Nacional de Desenvolvimento Econômico e Social |
| EBITDA | Earnings Before Interest, Taxes, Depreciation, Amortization |
| VaR | Value at Risk — perda máxima esperada em uma janela de tempo |

---

## 7. Microcopy de Estado

| Estado | Microcopy |
|---|---|
| Loading 3D (GLB) | "Aquecendo o motor..." (com progress %) |
| Loading Canvas | "Carregando cena energética..." |
| Reduced motion detectado | "Modo performance ativado. Algumas animações 3D foram simplificadas para melhor experiência." |
| WebGL não suportado | "Seu navegador não suporta WebGL 2. Estamos mostrando a versão 2D — mesma informação, menos imersão." |
| Formulário enviado | "Mensagem enviada. Resposta em até 24h no e-mail informado." |
| Erro de envio | "Algo travou no envio. Tente novamente ou mande direto para contato@energyflow.lab." |

---

## 8. AI Video Pipeline (VEO 3 — quota 3/mês)

### 8.1 Alocação Estratégica

| Tier | Vídeo | Justificativa |
|---|---|---|
| **S** | **Loop 1 — Hero** (8-12s) | 5s decisivos de primeira impressão |
| **S** | **Loop 2 — Problema** (6-8s) | Peak emocional (deconstruction) |
| **S** | **Loop 3 — Decisão** (8-10s) | Resolução/confiança (awakening) |
| B | Loop 5 — CTA background | Pode ser substituído por CSS+SVG |
| B | Loop 6 — Footer ambient | Pode ser substituído por CSS puro |

### 8.2 Cronograma de Geração

| Mês | Vídeos | Justificativa |
|---|---|---|
| **M1** | Loop 1 + Loop 2 + Loop 3 (16:9 desktop) | Cobertura completa da narrativa |
| **M2** | 1 versão mobile 9:16 do top-performer + 2 A/B tests de headline | Otimização baseada em dados |
| **M3+** | 1 refresh/mês do vídeo de pior performance OU novo case study | Iteração contínua |

### 8.3 Master Prompts VEO 3

Os 7 prompts completos (Master Anchor + 6 Loops + 1 Mobile Vertical) estão em `docs/superpowers/specs/2026-07-28-energy-flow-veo3-prompts.md` (anexo separado). Cada prompt tem 4 blocos estruturados: cena, câmera, lighting, negative.

**Aspect ratio:** 16:9 desktop / 9:16 mobile
**Duration:** 6-15s conforme tabela
**Resolution:** 1080p mínimo, 4K ideal
**Frame rate:** 24fps
**Outputs por prompt:** 4 variantes (VEO 3 gera 4)

### 8.4 Pós-Processamento (checklist)

- [ ] Color grade unificado (LUT reforça `#050505`, bumps red/yellow +10%)
- [ ] Trim 0.5s início/fim (instabilidade típica)
- [ ] Loop seam check (crossfade 4-6 frames se necessário)
- [ ] Fallback poster JPG/WebP extraído em t=1s
- [ ] Compressão H.265 (50% menor) ou VP9
- [ ] Mobile variant 720p 9:16 (se quota permitir)
- [ ] Reduced-motion variant = frame estático

---

## 9. ARIA Labels & Acessibilidade da Copy

| Elemento | ARIA |
|---|---|
| Canvas 3D | `role="img" aria-label="Cena 3D interativa representando BYD Seal com indicadores de vulnerabilidade"` |
| KPI flutuantes | `role="figure" aria-label="[KPI name]: [valor]. Variação: [+/-X%] em relação ao baseline"` |
| CTA primário | `aria-label="Agendar conversa de 30 minutos com Matheus Mendes"` |
| Glossário tooltip | `aria-describedby="glossary-[term]" tabindex="0"` |
| Formulário | Labels visíveis + `aria-required="true"` em obrigatórios |
| Canvas decorativo | `aria-hidden="true"` em modo full-3D |

---

## 10. Métricas & OKRs

### 10.1 OKRs em 3 Camadas

**Estratégica (12 meses):**
- OE1: Posicionar Matheus como referência em econometria aplicada à indústria automotiva BR
  - KR1: ≥ 3 reuniões de discovery com heads de BYD, Volkswagen, GM em 12 meses
  - KR2: ≥ 1 projeto-piloto de analytics contratado em 12 meses
    - **Definição de "projeto-piloto":** contrato de 30-90 dias com escopo fechado (ViE/hedge/scenario/CFO advisory), fee ≥ R$ 5k, NDA assinado
  - KR3: LP ranqueando top-3 em "analista de dados Salvador BA" no Google

**Definição de "demo request qualificado" (KR3 da OP1):**
formulário preenchido + reply ao auto-respond em 24h + call agendada em cal.com + prospect atende 2 de 3 critérios: (a) cargo C-level/head, (b) empresa indústria automotiva ou supply chain, (c) budget aprovado para analytics > R$ 10k.

**Produto (90 dias):**
- OP1: LP converte visitantes qualificados em contatos reais
  - KR1: ≥ 8% conversion rate
  - KR2: ≥ 30 downloads do 1-pager técnico/mês
  - KR3: ≥ 4 demo requests qualificados/mês
- OP2: LP funciona como prova de capacidade técnica
  - KR1: ≥ 60% dos visitantes veem 3+ seções (scroll depth)
  - KR2: ≥ 12s tempo médio no hero
  - KR3: ≥ 50% dos visitantes veem a seção Decisão

**Operacional (30 dias):**
- Hero: ≥ 60% visitantes veem +12s; ≥ 18% click-through CTA primário
- Problema: ≥ 75% scroll-depth até Seção 1
- Análise: ≥ 35% hover em ≥ 1 card; ≥ 12% click em ≥ 1 card
- Decisão: ≥ 50% scroll-depth até Seção 3
- Prova: ≥ 40% scroll-depth até Seção 4
- CTA Final: ≥ 25% click em qualquer CTA
- Formulário: ≥ 8% submissão completa

### 10.2 Funil de Aquisição

```
AWARENESS (1.200 → 3.000 visitantes/mês)
   ↓ bounce ≤ 35%
INTEREST (65% — tempo ≥ 90s, scroll ≥ 50%)
   ↓ engajamento
CONSIDERATION (30% — CTA click + notebook hover)
   ↓ intenção
CONVERSION (8% — form submit OR pdf download)
   ↓ vendas
QUALIFIED LEAD (4 qualified/mês — demo agendada 30min)
```

### 10.3 Eventos Plausible Custom (12)

`pageview`, `hero_dwell_time`, `cta_click`, `notebook_hover`, `notebook_click`, `glossary_open`, `pdf_download`, `form_submit`, `form_error`, `video_play`, `video_complete`, `three_mode` (`full`/`lite`/`none`)

---

## 11. Plano de Lançamento em 4 Fases

### Fase 0 — ALPHA INTERNA (Semanas 1-2, dev only)
- LP navegável em localhost com stub de dados
- Single Canvas com 1 seção 3D (Hero)
- Performance budget validado em Mac M2 + Windows laptop integrado
- Mobile fallback testado em iOS Safari + Android Chrome
- Acessibilidade WCAG AA validada com axe-core
- Lighthouse ≥ 90 em Performance, A11y, Best Practices, SEO

### Fase 1 — BETA FECHADA (Semanas 3-4, 5-10 testers)
- LP deployada em `staging.energyflow.lab` (Netlify preview)
- Vídeos VEO 3 gerados, color-graded, com poster fallback
- 8 notebooks integrados com previews Plotly inline
- Copy PT-BR finalizada com glossário inline
- Plausible configurado com 12 eventos custom
- Netlify Forms integrado com auto-reply
- NDA template pronto

**Perfil dos testers:** 2 headhunters, 1 head dados indústria auto, 1 CFO/COO mid-cap, 2 data scientists, 2-3 potenciais clientes.

**DoD:** ≥ 5 testers completam fluxo até CTA Final; ≥ 3 articulam em 1 frase o que a LP vende; conversion ≥ 5%; zero bugs bloqueantes; NPS ≥ 30.

### Fase 2 — SOFT GA (Semanas 5-6, audiência restrita)
- LP deployada em `energyflow.lab` (domínio final)
- Compartilhamento em 3-5 comunidades técnicas (LinkedIn, Reddit r/brdev, Twitter/X)
- Email outreach para 20 prospects (com NDA pre-attach)
- 1-2 demos agendadas e executadas
- Heatmap (Plausible insights ou Hotjar) instalado

**DoD:** ≥ 100 visitantes únicos; ≥ 8% conversion sustentado 2 semanas; ≥ 5 demo requests; insights qualitativos compilados.

### Fase 3 — GA + ITERAÇÃO (Semana 7+, ongoing)
- Review semanal de Plausible dashboard
- A/B test de headlines (1/mês)
- Iteração de copy baseado em heatmap
- Adicionar 1 seção ou 1 case study/mês
- Refresh trimestral de vídeos (1 quota VEO 3/mês)

**Critérios de pivot:** conversion < 3% por 2 meses → revisar narrativa; bounce > 50% → problema técnico/narrativo; 0 demo requests em 30 dias → revisar público.

---

## 12. Dependências

### Técnicas (bloqueiam dev)

| Dep | Status | Deadline |
|---|---|---|
| Next.js 14.2 stable | ✅ | — |
| React Three Fiber 8.16+ | ✅ | — |
| BYD Seal GLB model | ⚠️ converter de storyboard | Semana 1 |
| VEO 3 access (Google AI Studio) | ⚠️ quota 3/mês confirmada | Semana 1 |
| **Netlify Pro account** ($19/mês) | ⚠️ confirmar | Semana 2 |
| Plausible self-hosted | ✅ | Semana 3 |
| **Netlify Forms** (built-in) | ✅ substitui Resend | Semana 3 |
| Cal.com (free tier) | ✅ | Semana 3 |

### Conteúdo (bloqueiam copy)

| Dep | Status | Deadline |
|---|---|---|
| 8 notebooks completos (NB-01..08) | ✅ outputs em `analise-prescritiva/outputs/` | — |
| 1-pager-summary.md (D2) | ✅ em `d2-econometric-vulnerability/outputs/` | — |
| Glossário técnico PT-BR | ⚠️ revisar final | Semana 2 |
| Master prompts VEO 3 | ✅ definido nesta spec | — |
| 3 vídeos VEO 3 (Tier S) | ⚠️ gerar + color-grade | Semana 3 |
| BYD Seal fotos de referência | ⚠️ storyboard frames existentes | Semana 1 |

---

## 13. Riscos & Mitigações

| # | Risco | P | I | Mitigação |
|---|---|---|---|---|
| R1 | VEO 3 gera vídeos inconsistentes entre takes | A | M | 4 variantes por prompt, seed fixo, escolher melhor |
| R2 | BYD Seal GLB > 4MB | M | A | Draco+WebP+LOD; fallback imagem estática |
| R3 | Canvas 3D causa jank em GPU integrada | A | A | Modo `lite` via feature detection; CTA 2D sempre visível |
| R4 | Copy não convence CFO | M | A | Beta com 1 CFO/COO; revisão por nativos PT-BR |
| R5 | LGPD/cookies: Plausible self-hosted resolve | B | M | Plausible é privacy-first, sem banner |
| R6 | Vídeo distrai do copy | M | M | Overlay `bg-void` 60%; opção pause após 8s |
| R7 | Custo total (Netlify + VEO + domínio) | B | M | **$387/90 dias** (ver §15), viável com 1 cliente |
| R8 | BYD não responde ao outreach | A | B | Diversificar: VW, GM, Stellantis, Tier-1 |
| R9 | Navegadores antigos não suportam WebGL2 | M | B | Modo `none` cobre IE11 e Chrome < 90 |
| R10 | Métricas demo_request não confiáveis | M | M | Dupla confirmação: form + email reply + cal.com |
| R11 | **Quota VEO 3 esgotada antes de cobertura completa** | M | M | Fallback estático + CSS é aceitável; 1 refresh/mês por quota |

---

## 14. Definition of Done (DoD) Global

### Funcional
- [ ] 7 seções navegáveis com scroll-snap suave
- [ ] Single Canvas 3D renderiza em modo `full` sem erros
- [ ] Fallback `lite` ativa automaticamente em mobile
- [ ] Fallback `none` ativa em reduced-motion e sem WebGL2
- [ ] 8 notebooks com preview Plotly inline
- [ ] Glossário inline on-hover em todos os termos técnicos
- [ ] **Netlify Forms** envia email + cria evento em Plausible
- [ ] 1-pager PDF baixa corretamente
- [ ] Mobile 9:16 alternativo funcional (crop + letterbox CSS)

### Performance
- [ ] LCP ≤ 2.5s (4G simulado, Moto G4)
- [ ] TBT ≤ 200ms
- [ ] CLS ≤ 0.1
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] FPS Canvas ≥ 50 desktop / ≥ 30 mobile lite

### Conteúdo
- [ ] Copy PT-BR revisada por 2+ nativos
- [ ] 3 vídeos VEO 3 (Tier S) color-graded com poster fallback
- [ ] 8 notebooks com mini-thumbnail gerado
- [ ] Glossário validado por 1 profissional técnico externo
- [ ] NDA template pronto

### Analytics & Tracking
- [ ] Plausible configurado com 12 eventos custom
- [ ] Funil Plausible dashboard criado
- [ ] Heatmap ativo
- [ ] Alertas para queda > 20% em conversion rate

### Operacional
- [ ] Domínio `energyflow.lab` registrado e SSL ativo (Netlify)
- [ ] Email `contato@energyflow.lab` com forward configurado
- [ ] Backup semanal do conteúdo + analytics
- [ ] Runbook de incidente (LP down, form quebrado, vídeo falha)

---

## 15. Orçamento 90 dias

| Item | Custo/mês | 90 dias |
|---|---|---|
| **Netlify Pro** | $19 | $57 |
| Domínio .lab | $30/ano | $30 (one-time) |
| **Netlify Forms** (built-in) | $0 | $0 |
| Plausible self-hosted | $0 (self-host) | $0 |
| **VEO 3 quota (3 vídeos/mês)** | ~$30 | $270 |
| Cal.com (free tier) | $0 | $0 |
| Stock images fallback (se necessário) | $30 | $30 |
| **Total** | | **~$387** |

**Break-even:** 1 projeto-piloto de analytics de R$ 2-3k cobre o ano inteiro.

---

## 16. Próximos Passos (após aprovação)

1. **Spec self-review** (esta seção já passada inline)
2. **User review** desta spec escrita
3. **Spec 2 — Dashboard** (Product 2): iniciar novo ciclo de brainstorming
4. **Writing-plans skill** → plano de implementação detalhado
5. **Implementação**: scaffolding → IA assets → copy → analytics → deploy beta

---

**Anexo:** Prompts VEO 3 completos em `docs/superpowers/specs/2026-07-28-energy-flow-veo3-prompts.md`