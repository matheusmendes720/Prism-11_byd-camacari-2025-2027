# Findings — D2 Audit + D3 Design

> Este arquivo armazena discoveries do D2 audit e do design D3.
> A cada nova descoberta (de análise, feedback do time, simulação), adicione uma entrada.

## 2026-07-21 — D2 Audit completo

**Finding F1**: D2 trata as 6 sessões como dimensões **paralelas** mas as prescrições têm acoplamentos fortes. A interdependência mais crítica: o sizing do hedge cambial (S1) depende do ViE residual pós-S3. Sem modelar isso, hedge pode estar sub ou super-dimensionado em ±30%.

**Finding F2**: 6 prescrições D2 são todas **unconditionally** statements. Nenhuma tem branching ("se X, então Y; senão Z"). Isso significa que o operador tem que reinterpretar cada prescrição a cada novo sinal — sem apoio do framework.

**Finding F3**: Custos são listados (R$ 80M/ano, R$ 280M, R$ 12M) mas sem NPV. Sem NPV, o Conselho não consegue comparar o pacote de mitigação com outras alocações de capital.

**Finding F4**: Triggers estão **dispersos** no texto D2:
- S1: "PTAX > 5.40 por 5 dias"
- S3: "BNDES atrase além de dez/2026"
- S6: "PIB mensal < 0 por 2 trimestres"

Esses 3 triggers (e provavelmente outros 10+) precisam virar uma **tabela-mestra** com ownership + procedimento + fallback.

**Finding F5**: RACI é **ausente** no D2. Quem decide acionar cada prescrição? Quem aprova cada gasto? Sem isso, na hora do trigger, a decisão trava em comitês.

**Finding F6**: Counterfactual ausente. "E se não fizermos nada?" — composite 71.8 → ? em 3 anos. Sem isso, a aprovação de R$ 12M + 280M + 80M/ano não tem baseline para comparação.

**Finding F7**: Macro (S6) é **descritivo** (correlações, IRF, FEVD) mas deveria ser **prescritivo**. PIB e IPCA são as duas variáveis macro que determinam o regime. Quando elas viram, o playbook deveria mudar automaticamente.

**Finding F8**: Análise competitiva (S4) é **unidirecional** — BYD reage, mas concorrentes também reagem. Falta modelar resposta competitiva (game theory).

**Finding F9**: MC só existe em S1 (câmbio). Mas o composite é um problema **multivariado**. PTAX + lítio + demand EV podem se mover juntos em stress. Sem MC multivariado, não temos distribuição conjunta de risco.

**Finding F10**: O relatório D2 termina com uma "pergunta de decisão" retórica, mas sem sensitivity. A resposta ("sim, aprovar") precisa ter pontos de reversão documentados: em que cenário a recomendação muda?

---

## Métricas do D2 que o D3 deveria replicar automaticamente

- Composite = Σ (score_dimensão × peso_dimensão)
- Vol 30d anualizada PTAX = √(252 × var(rolling_30))
- HHI = Σ (share_i²) — feed de market data
- Market share por OEM — feed mensal ANFAVEA + cross-reference Tesla/VW/GM reports
- Trade deficit autos = import_M_USD − export_M_USD — feed MDIC

---

## 2026-07-21 04:30 — Modelagem S1↔S3 (aprofundamento do gap #1)

**Finding F11**: D2 prescreve "hedge 50% flat" para todos os cenários. Mas o constraint "VaR residual ≤ 20% do margin buffer" produz hedge ratio ótimo de 30% (Expansão) a 91% (Rollback Total). **A prescrição D2 é ótima para 1 cenário e sub-ótima para os 3 outros.**

**Finding F12**: O premium do hedge (R$ 19M a R$ 57M por 6 meses, dependendo do cenário) é ~30× menor que o VaR em escala absoluta. Isso invalida qualquer modelo de "cost minimization" — a função objetivo certa é um **constraint**, não uma soma.

**Finding F13**: A escolha do target ratio (10% / 20% / 30% de VaR residual / margin) é uma **decisão política do Risk Officer + Board**, não do modelo. O modelo expõe a curva; o humano escolhe o apetite. Em stress test (3σ FX depreciação), a folga muda de 6.2× (Expansão) para 7.7× (Rollback Total, contraintuitivo porque hedge é 91%).

**Finding F14**: O timing do trigger S6 → S1 é crítico. Se S6 vira 🔴 (PIB < 0 por 2 trimestres) sem o S1 ter sido ajustado, o programa pode chegar a Rollback Parcial com hedge ainda em 50% — exatamente o cenário que a matriz de decisão §4 flagra como perigoso.

**Finding F15**: O **diferencial acumulado de 3 anos** entre "50% flat" do D2 e o constraint-based do D3 é R$ 200M+ em prêmio de hedge. Não é trivial — é ~70% do orçamento de advocacy regulatório.

**Finding F16**: O modelo constraint-based é robusto a mudanças de parâmetros: vol alta + target estrito = 79% (vs base 39%); vol baixa + target leniente = 30% (piso estratégico). Os drivers principais são (1) target ratio, (2) volatilidade, (3) nível de ViE.

---

## 2026-07-21 04:50 — Modelagem S1↔S2 e S1↔S4 (opção A2)

**Finding F17**: S1↔S2 — Quando supply chain estressa, o hedge cambial ótimo sobe ~15-45pp (depende do S3). Isso é contraintuitivo (problema de supply → mais hedge FX), mas justificado: stress FX e supply são correlacionados (ρ=0.3), e a parte FX do double-shock precisa de proteção extra. Matriz 4×3 = 12 cenários produz hedge ratio de 30% (S2 GREEN, S3 Expansão) a 95% (saturação no teto em 3 cenários).

**Finding F18**: S1↔S2 — Em S2 RED, o supply VaR (R$ 5.18B) é 2.5× maior que o FX VaR (R$ 2.08B). **Hedge cambial sozinho cobre apenas 1/3 do risco total**. A resposta primária deveria ser resolver o problema de supply, não aumentar hedge.

**Finding F19**: S1↔S4 — Hedge cambial e pricing defensivo servem a **propósitos diferentes** (margem vs volume), com custos diferentes. Hedge = R$ 480/unit. Defensivo = R$ 4.500/unit (9.4× mais caro). **Não são substitutos**.

**Finding F20**: S1↔S4 — O ROI do defensivo varia de **−67% a +233%** dependendo da estrutura (catalog-wide vs targeted). D2 prescreve catalog-wide que dá ROI negativo (-67%). Defensivo targeted (apenas 5k unidades em risco) dá ROI +233%. **D2 prescreve a estrutura errada**.

**Finding F21**: S1↔S4 — O custo do defensivo (R$ 225M) **domina** o orçamento, independente do nível de hedge. Pricing defensivo deveria ter **tiers** (básico/intermediário/agressivo) para permitir gradação por mercado e por linha.

**Finding F22**: S1↔S4 — Combinando S1↔S2↔S4↔S3↔S6, a matriz integrada tem **4×3×4×3×3 = 432 combinações** (mas só ~12-20 são materialmente distintas). D3 v0.5 deveria pré-mapear essas combinações e o defensivo tier system.

**Finding F23**: **Economia potencial D3 vs D2**: ~R$ 130M/ano em defensivo + R$ 100-200M em hedge (otimização por cenário) = R$ 230-330M/ano. Em 3 anos: R$ 700M-1bi — quase 2× o capex estimado do programa.

---

## 2026-07-21 05:05 — Modelagem S3↔S4 e S6→todas (opção A4 — fechamento do gap #1)

**Finding F24**: S3↔S4 — Defensivo catalog-wide (D2 baseline R$ 225M) é **positivo só a partir de ViE≥18%** (S3 Continuidade+). Break-even em ViE=10% (Rollback Parcial). Destrutivo (-67% ROI) em Rollback Total (ViE=0%, margem R$15k/unit). D2 prescreve catalog-wide sem condicionar a S3 — **estrutura errada por design**.

**Finding F25**: S3↔S4 — Defensivo **targeted** (R$ 22.5M, aplicado só às 5k unidades em risco) é positivo em **todos os 4 cenários S3**: ROI +1900% (Expansão), +1433% (Continuidade), +900% (Rollback Parcial), +233% (Rollback Total). A estrutura dominante é targeted, não catalog-wide. Tier system (Tier 0/1/2/3 = R$ 0/7.5/15/22.5M) proposto para gradação por cenário.

**Finding F26**: S3↔S4 — A **% da margem/unit consumida pelo defensivo** explode em Rollback Total: 5% (Expansão) → 7% (Continuidade) → 10% (Rollback Parcial) → **30% (Rollback Total)**. Em Rollback Total, cada R$ 1.00 de margem restante tem R$ 0.30 comprometidos com defensivo. Isso é "sangria controlada" — defensivo catalog-wide deveria ser proibido neste cenário.

**Finding F27**: S6→todas — S6 deveria ser tratado como **governor** (multiplier 1.0/1.5/2.0×) que escala as prescrições de S1-S4, não como input de modelo (correlação). D2 trata S6 como descritivo (IRF, FEVD); D3 trata como prescritivo. Virada crítica é GREEN→AMBER, não AMBER→RED (composite 65→78 é a maior salto).

**Finding F28**: S6→todas — A **trigger matrix 4×3** (4 sessões × 3 status S6) tem 12 ações pré-mapeadas com custo incremental R$ 0 (GREEN) → R$ 55-65M (AMBER) → R$ 165-200M (RED). AMBER é o ponto de virada — esperar RED é tarde para ações estruturais (bridge financing R$ 800M, plano B de supply, defensivo Tier 3 + comunicação).

**Finding F29**: S6→todas — Em S6 RED com S3 Rollback Total simultâneo, hedge satura no teto 95% (não cobre VaR), defensivo catalog-wide destrói valor (-67%), e supply VaR (R$ 5.18B) domina FX VaR (R$ 2.08B). **A resposta em RED tem que ser estrutural** (comprar spot, bridge financing, parcerias alternativas), não escalar o que já não cobre.

**Finding F30**: **Gap #1 do D2 audit está fechado**. 5 acoplamentos modelados quantitativamente: S1↔S3, S1↔S2, S1↔S4, S3↔S4, S6→todas. 12 figuras geradas. 30 findings (F1-F30). Economia potencial D3 vs D2 revisada para R$ 230-330M/ano (R$ 700M-1bi em 3 anos) com a inclusão do S3↔S4 (defensivo targeted em vez de catalog-wide = R$ 130M+/ano economizado) e S6 (resposta calibrada evita over-spend em GREEN).

---

## D3 — Capabilities essenciais (do design)

1. **Trigger matrix**: 6 dimensões × 3 níveis (🟢🟡🔴) + heatmap agregado
2. **Decision trees**: 12 combinações materialmente distintas + fallback "comitê de crise"
3. **Action register**: 30+ ações pré-mapeadas com RACI + KPI + status
4. **NPV layer**: cost-benefit por prescrição, em 4 cenários
5. **MC multivariado**: PTX × lítio × demand × IPCA com co-dependências
6. **Auto-trigger S6 → S1/S2/S3/S4**: revisão automática quando macro muda
7. **Learning loop**: post-mortem trimestral + recalibração de elasticidades
8. **Dashboard executivo**: 4 telas (composite / signals / actions / learning)
9. **Sensitivity matrix**: 10 perguntas de decisão × 4 cenários

---

## Próximas perguntas a explorar (D3 v2?)

- [ ] Game theory: como Tesla/VW/GM reagem ao pricing defensivo BYD?
- [ ] Custo do capital: qual a taxa de desconto ajustada a risco soberano para NPV?
- [ ] Custo de oportunidade: R$ 280M em supply chain vs. mesmo capital em M&A defensivo?
- [ ] Stress test extremos: PTAX > 6.50 (cenário Grécia 2015)? lítio +200%?
- [ ] Black swans: Taiwan blockade, lithium triangle nationalization, election upset
- [ ] D3 v2: deveria virar um produto vendável (consultoria)? IP?
