# D3-Understand-Anything — Grafo de Conhecimento Interativo

**Princípio**: "Graphs that teach > graphs that impress" (Egonex-AI/Understand-Anything)
**Data**: 25/jul/2026
**Localização**: `6_pitch/D3-UNDERSTAND-ANYTHING.html` + `6_pitch/D3-KNOWLEDGE-GRAPH.json`

---

## O que é

Um **grafo de conhecimento interativo** do framework D3 BYD Camaçari 2025-2027,
no estilo do repo [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything)
(76k stars no GitHub). Self-contained HTML — zero dependência de CDN, zero build,
abre direto no browser.

> *"The goal isn't a graph that wows you with how complex your codebase is —
> it's a graph that quietly teaches you how every piece fits together."*
> — Egonex-AI/Understand-Anything

---

## Como rodar

### Opção 1 — Single file (recomendado) ✅

1. Abra `D3-UNDERSTAND-ANYTHING.html` num browser moderno (Chrome, Edge, Firefox, Safari)
2. Pronto. **Zero dependência externa, zero servidor, zero CORS**.

> O JSON está **inline** em `<script type="application/json" id="graph-data">` no próprio HTML.
> Funciona via `file://` direto, sem servidor. Single file, 56 KB total, abre em qualquer lugar.

### Opção 2 — Servidor (modo dev, hot-reload do JSON)

```bash
python -m http.server 8000
# abre: http://localhost:8000/D3-UNDERSTAND-ANYTHING.html
```

> Nesse modo, o `init()` tenta `fetch('D3-KNOWLEDGE-GRAPH.json')` primeiro. Se o JSON externo
> mudar, basta dar refresh no browser. O JSON inline é o fallback automático.

### Opção 3 — Compartilhar (1 arquivo)

- **GitHub Pages**: push da pasta `6_pitch/`, ative Pages → URL pública
- **Netlify/Vercel**: drag-and-drop a pasta → URL pública em 30s
- **Email/WeTransfer**: mande só o `D3-UNDERSTAND-ANYTHING.html` (56 KB, self-contained)

---

## Features implementadas

| Feature | Descrição | Onde |
|---|---|---|
| **Force-directed graph** | Nós se reorganizam dinamicamente com spring + repulsion | vanilla JS, sem D3.js |
| **Pan & zoom** | Scroll = zoom, drag = pan, botões +/-/reset | SVG + transform |
| **Drag nodes** | Click + arrasta um nó pra fixar posição | fx/fy + spring |
| **Search fuzzy** | Busca em label + descrição (case-insensitive) | `graph.setSearch()` |
| **Filter por categoria** | 10 categorias coloridas, toggle on/off | sidebar |
| **Detail panel** | Click nó → vê descrição, conexões, owner, deadline, KPI | aside direita |
| **Persona-adaptive UI** | 8 personas (Conselho, CEO, CFO, CSO, COO, Risk, Headhunter, LinkedIn) | dropdown header |
| **Guided tours** | 4 tours com passos narrados (overlay modal) | sidebar |
| **Edge semantics** | Cor por tipo: risk (vermelho), unlocks (verde), mitigates (laranja) | SVG stroke |
| **Highlight related** | Click nó → outros dim, relacionados highlight | render loop |
| **Print-ready** | Media query print esconde sidebar, deixa só o grafo | CSS @media print |
| **Stats header** | Contagem de nós, edges, tours em tempo real | header |
| **Zoom controls** | Botões +/-/reset, posicionados bottom-right | aside canvas |
| **Tooltip on hover** | Mostra label + 120 chars de desc | position absolute |
| **Tooltip following** | Tooltip segue o mouse | mousemove |

---

## Tours guiados (4)

| Tour | Audiência | Passos | Conteúdo |
|---|---|---|---|
| **Onboarding: o framework em 5 minutos** | Conselho, Headhunter, LinkedIn | 6 | D2 → Composite → S7 kill switch → VaR 8,21 bi → Ação E3 → ROI 200× |
| **Os 20 couplings** | CSO, CFO, COO | 6 | S1↔S3, S1↔S2, S1↔S4, S6→all, S7↔S3, S10↔S1 |
| **As 25 ações** | CFO, COO, CSO | 5 | E3, T1, T2, T3, O1 |
| **Os 5 riscos materiais** | Conselho, CEO, Headhunter | 5 | Lista suja, Tariff, Guerra, Overcap, Lítio |

Cada tour fala em voz alta o que está vendo (overlay modal). Click "Próximo" para avançar, "Sair" para fechar.

---

## Personas (8 níveis de detalhe)

| Persona | Nível | Detail mode | Quando usar |
|---|---|---|---|
| Conselho de Administração | board | summary (200 chars) | Stakeholder alto-nível, 1 reunião |
| CEO | executive | summary (200 chars) | Sponsor de E1-E5 |
| CFO | executive | full (desc completa) | Owner de T1, E2, E3 |
| CSO | executive | full | Owner de T4-T10, O5-O10 |
| COO | executive | full | Owner de T2 |
| Risk Officer | operational | deep (com fórmulas) | Owner de T1, O1, O5, O9 |
| Headhunter / Recrutador | external | summary | Anexo de vaga, 5 min de leitura |
| LinkedIn Prospect | external | summary | DM cold outreach, 1 min de atenção |

A persona adapta **automaticamente** o nível de detalhe no painel direito.
Selecione pelo dropdown no header.

---

## Estatísticas do grafo

| Métrica | Valor |
|---|---|
| **Nós totais** | 95 |
| **Edges totais** | 142 |
| **Sessões D2** | 6 |
| **Dimensões (S1-S11)** | 11 |
| **Couplings (S1↔S3, etc.)** | 20 |
| **Ações (E1-E5 + T1-T10 + O1-O10)** | 25 |
| **Personas RACI** | 17 |
| **Approval gates** | 9 |
| **Riscos (kill switches)** | 5 |
| **Métricas** | 6 (VaR 8,21bi, CVaR, Composite, NPV, ROI, Backtest) |
| **Tours guiados** | 4 |

---

## Atalhos de teclado

| Atalho | Ação |
|---|---|
| Click em nó | Ver detalhes no painel direito |
| Drag em nó | Mover (fixa posição até soltar) |
| Drag em fundo | Pan (arrastar a câmera) |
| Scroll wheel | Zoom in/out |
| Esc | Fechar painel de detalhes |
| + / − / ⊙ (botões) | Zoom in/out/reset |

---

## Estrutura visual (cores por categoria)

| Categoria | Cor | Ícone | Nós |
|---|---|---|---|
| Sessão D2 | `#f5c542` (amarelo) | ◐ | 6 |
| Dimensão | `#6b95f0` (azul) | ◆ | 11 |
| Acoplamento | `#5fb878` (verde) | ⇌ | 20 |
| Ação Estratégica | `#e0a45e` (laranja) | ★ | 5 |
| Ação Tática | `#d4805a` (laranja escuro) | ● | 10 |
| Ação Operacional | `#b86060` (vermelho claro) | ○ | 10 |
| Persona RACI | `#b87fd0` (roxo) | ♟ | 17 |
| Approval Gate | `#e0e070` (amarelo claro) | ⛙ | 9 |
| Risco / Kill Switch | `#ff5e5e` (vermelho) | ☠ | 5 |
| Métrica | `#80d4d4` (ciano) | ∑ | 6 |

**Cores de edge** (semânticas):
- **Cinza** (#2a2d35) — acoplamento neutro
- **Verde** (#5fb878) — unlocks / enables / satisfies
- **Vermelho** (#ff5e5e) — risk / blocks
- **Laranja** (#e0a45e) — mitigates (ação → métrica)

---

## Filosofia: "graphs that teach > graphs that impress"

3 diferenças em relação a um grafo que só impressiona:

1. **Detail panel com explicações em linguagem clara**, não só metadata. Cada nó tem `desc` em prosa que qualquer stakeholder entende sem precisar de curso de econometria.

2. **Persona-adaptive**: o mesmo grafo serve para Conselho (1 página de detalhe) e Risk Officer (deep dive com fórmulas). Você não precisa de 3 grafos diferentes.

3. **Tours guiados com falas narradas**. Em vez de largar o stakeholder olhando para 95 nós, oferecemos 4 trilhas de 5-6 passos que contam a história. É a mesma ideia do Understand-Anything: o grafo **ensina**, não **intimida**.

---

## Próximas evoluções (opcionais)

| Feature | Esforço | Impacto |
|---|---|---|
| Domain view (horizontal flow) | 2h | Mostra Business Process vs. Code/Tool structure |
| Semantic search (embeddings) | 4h | "qual parte lida com ESG?" retorna nós relevantes |
| Diff impact analysis | 3h | "se eu mudar S7, quem é afetado?" |
| Export PNG / SVG do grafo | 30min | Para slides de Conselho |
| Inline JSON (single-file) | 30min | Mandar por email sem perder formatação |
| Commit hook → re-render | 1h | Atualizar grafo automaticamente a cada commit |

---

## Licença & créditos

- **Inspirado por**: [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) (MIT License)
- **Dados**: do projeto D3 BYD Camaçari 2025-2027
- **Data**: 25/jul/2026
- **Versão do framework**: D3 v2.0.1

---

**Última atualização**: 25/jul/2026
