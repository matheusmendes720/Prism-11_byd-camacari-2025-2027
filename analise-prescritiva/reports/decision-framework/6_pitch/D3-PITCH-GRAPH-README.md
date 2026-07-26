# D3-PITCH-GRAPH — Knowledge Graph v2.1 (mutual exclusivity)

**Versão**: 2.1 (25/jul/2026)
**Localização**: `6_pitch/D3-PITCH-GRAPH.html`
**Self-contained**: zero CDN, zero JS lib, abre via `file://`

---

## O que é

Grafo de conhecimento interativo do framework D3 BYD Camaçari 2025-2027.
**Diferencial v2.1**: 7 layers + 9 views, todas MUTUAMENTE EXCLUSIVAS
(via dispatcher `getElementsForView(view, layer)` com early returns).

## Arquitetura

### 7 Layers (sidebar esquerdo)
| Layer | Mostra | NÃO mostra |
|---|---|---|
| **Framework** (default) | Composite + 11 dims + 20 couplings + 5 ações E + 4 gates | triggers, personas, cadência |
| **Data** | 9 fontes públicas + 11 dims consumidores | triggers, personas |
| **Signal** | SignalComposite + 5 triggers + 5 cadências + 17 personas | 11 dims (apenas SignalComposite) |
| **Decision** | DecisionComposite + 3 DT + 4 outcomes + 3 triggers | 11 dims (apenas Composite + DT) |
| **Action** | ActionComposite + 25 ações + 17 personas (RACI) | 11 dims (apenas Composite) |
| **Learning** | LearningComposite + 5 stress events + BT + REC + DRIFT | 11 dims, personas |
| **Governance** | GovernanceComposite + 17 personas + 4 gates + 5 audit | 11 dims, triggers |

### 9 Views (sidebar esquerdo)
| View | Conteúdo | Foco |
|---|---|---|
| **Visão Geral** (default) | Vê o que a layer selecionada mostra | navegação livre |
| **Risk Register** | 5 risk nodes + 5 mitigations + origem | mitigar RED flags |
| **RED Flags** | 4 dims RED + 7 couplings críticos | onde está o fogo |
| **28 Couplings** | 11 dims + 28 couplings (5 primários + 23 secundários) | inter-relações |
| **Pilot Gates** | 4 gates + 3 DT + 4 dim target | caminho de aprovação |
| **Personas** | 17 personas + 3 gates + 2 dims | quem decide |
| **5-Layer Flow** | Data→Signal→Decision→Action→Learning + exemplo | como o framework opera |
| **18m Timeline** | 12 marcos críticos (Q3 2026 → Q2 2027) | roadmap |
| **3 Scenarios** | Expansão 60% / Continuidade 25% / Rollback 15% | mundo futuro |
| **Cascade** | S7 origem → 5 direta + 6 indireta | propagação de risco |

## Diferença entre Framework e Signal (a confusão clássica)

| | Framework (O QUE) | Signal (QUEM/COMO) |
|---|---|---|
| Mostra | 11 dims + 20 couplings + 5 ações E + 4 gates | 5 triggers + 5 cadências + 17 personas |
| NÃO mostra | triggers, personas, cadência | 11 dims (apenas SignalComposite) |
| Composite | D3 Composite (78/100, 3 RED flags) | Signal Monitor (7 sinais ativos, 3 AMBER) |
| Mental model | "O que estamos olhando" | "Quem está olhando, com que frequência" |

## Refatoração v2.1 (a grande mudança)

**Antes** (v2.0.1): 9 blocos `if` não mutuamente exclusivos. Quando
view='risk' + layer='framework', executavam 3 blocos em paralelo:
- Bloco 1212 (framework) → Composite + 11 dims + 5 E + 4 gates
- Bloco 1219 (dentro do 1212) → 20 couplings + 8 edges + 4 gate edges
- Bloco 1765 (risk) → 5 risk nodes + 11 dims de novo + 5 mitig + 13 edges
- **Resultado**: 80+ nodes, 200+ edges, caos visual.

**Depois** (v2.1): dispatcher com early returns. Cada sub-função é
isolada e mutuamente exclusiva.

```javascript
function getElementsForView(view, layer) {
  if (view !== 'overview') {
    if (view === 'risk')        return buildRiskView();
    if (view === 'red-flags')   return buildRedFlagsView();
    if (view === 'couplings')   return buildCouplingsView();
    if (view === 'gates')       return buildGatesView();
    if (view === 'personas')    return buildPersonasView();
    if (view === 'flow')        return buildFlowView();
    if (view === 'timeline')    return buildTimelineView();
    if (view === 'scenario')    return buildScenarioView();
    if (view === 'cascade')     return buildCascadeView();
  }
  // view === 'overview' — usa layer
  if (layer === 'data')       return buildDataLayer();
  if (layer === 'signal')     return buildSignalLayer();
  if (layer === 'decision')   return buildDecisionLayer();
  if (layer === 'action')     return buildActionLayer();
  if (layer === 'learning')   return buildLearningLayer();
  if (layer === 'governance') return buildGovernanceLayer();
  return buildFrameworkLayer();
}
```

16 sub-funções, cada uma com `makeBuilder()` próprio (escopo isolado).

## 7 Tours Narrativos

1. **Onboarding Geral** (5 min, 7 passos) — qualquer stakeholder novo
2. **Risk Officer Deep Dive** (3 min, 4 passos) — Risk + CSO + quant
3. **Conselho Executivo** (2 min, 3 passos) — CEO + CFO + Board
4. **RED Flags Deep Dive** (4 min, 4 passos) — quem mitiga risco
5. **Camada de Dados** (3 min, 4 passos) — quant analysts
6. **Cenários Macroeconômicos** (2 min, 4 passos) — CSO + Head Strategy
7. **Roadmap 18 Meses** (2 min, 5 passos) — COO + CFO + PM

Cada tour tem narração verbatim em PT-BR para gravação de vídeo.

## Estatísticas

| Métrica | Valor |
|---|---|
| Sub-funções build | 16 (7 layers + 9 views) |
| Layers | 7 |
| Views | 9 |
| Tours | 7 (29 passos totais) |
| Personas | 17 |
| Ações | 25 (5E + 10T + 10O) |
| Couplings | 28 (5 primários + 23 secundários) |
| Triggers | 5 (T-AMBER, T-S7, T-HYST, T-5D, T-Li) |
| Decision trees | 3 (DT_S3, DT_S6, DT_S7) |
| Risk nodes | 5 (R_LISTA_SUJA, R_TARIFF, R_GUERRA, R_OVERCAP, R_LITIO) |
| Approval gates | 4 (G0-G3) |
| Data sources | 9 (PTAX, Li, BNDES, HHI, Tarif, MSCI, MC, GT, BT) |
| Milestones (timeline) | 12 |

## Como rodar

1. Abra `D3-PITCH-GRAPH.html` num browser moderno (Chrome, Edge, Firefox, Safari)
2. Use a sidebar esquerda para alternar entre 7 layers e 9 views
3. Click em qualquer nó para ver detalhes no painel direito
4. Click em "▶ Tour guiado" no topo para escolher 1 dos 7 tours
5. ⌘K para buscar
6. Botão "↓ Export" para baixar SVG

## Próximas evoluções (opcional)

| Feature | Esforço | Impacto |
|---|---|---|
| Drag nodes | 2h | Permite fixar posição de nós importantes |
| Mini-map | 1h | Overview de todo o grafo em canto |
| Tooltip rico com fórmulas | 2h | Risk Officer consegue ver cálculos |
| Compare 2 layers lado-a-lado | 4h | Framework vs Action, ver o gap |
| Timeline scrubber | 3h | Animar nós ao longo dos 18 meses |

## Licença & créditos

- **Inspirado por**: D3 framework BYD Camaçari 2025-2027 (interno)
- **Stack**: vanilla JS + SVG (zero CDN, zero build)
- **Versão**: 2.1 (25/jul/2026)
