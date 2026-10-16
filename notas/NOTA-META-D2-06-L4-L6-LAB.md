---
slug: notas-meta-d2-l4-l6-lab-transversais
title: "Nota-Meta D2 #06 — L4-L6 + LAB + Transversais · Meta-Learning de Comunicação, Calibração, Risco de Cauda e Glossários"
ueid: ikigai:nota:d2-meta-l4-l6-lab-transversais:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, l4, l5, l6, lab, transversais, comunicacao-conselho, calibracao, risco-cauda, meta-learning]
custom:
  _purpose: >-
    Nota de meta-aprendizado sobre os Layers L4 (Decisão Executiva), L5
    (Tópicos Avançados), L6 (Especialização), LAB (98-LAB-ADVANCED +
    99-LAB-EXERCISES), e transversais (AA tour guiado, BB bibliografia,
    ZZ glossário de fórmulas). Esta nota cobre o "pós-prescritivo" — onde
    o profissional sai de prescritor e vira operador + auditor + pesquisador.
  _audience: risk-officer, head-de-risk, COO, auditor, pesquisador
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md
    - /d2-econometric-vulnerability/_study_notes/L4.1-dashboards-executivos.md
    - /d2-econometric-vulnerability/_study_notes/L4.2-gap-modelo-humano.md
    - /d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md
    - /d2-econometric-vulnerability/_study_notes/L5.1-interpretabilidade-shap-lime.md
    - /d2-econometric-vulnerability/_study_notes/L6.0-risco-cauda-extremo.md
    - /d2-econometric-vulnerability/_study_notes/L6.1-stress-testing-institucional.md
    - /d2-econometric-vulnerability/_study_notes/L6.2-mesa-risco-operacional.md
    - /d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md
    - /d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md
    - /d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md
    - /d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md
    - /d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md
  _outputs:
    - 4-trilhas-de-comunicacao-conselho
    - 3-testes-calibracao
    - evt-gpd-tail-modeling
    - lab-pratico-avancado
  _success_criteria: >-
    leitor consegue apresentar VaR para o Conselho sem perder a nuance,
    auditar calibração de GARCH, modelar cauda extrema com EVT, e navegar
    entre LAB avançado e glossário de fórmulas.
---

# Nota-Meta D2 #06 — L4-L6 + LAB + Transversais

> **Quem está falando:** um par sênior-orientador mostrando como sair de prescritor e virar operador + auditor + pesquisador.
> **O que esta nota faz:** destrincha os Layers 4-6 (L4-L6), LABs práticos, e transversais (AA, BB, ZZ) em meta-aprendizado, com foco em fixar como **comunicar para o Conselho**, **auditar calibração**, e **modelar risco de cauda extrema**.
> **Pré-requisito:** ter lido [Nota-Meta D2 #05 — L3 Análise Prescritiva](./NOTA-META-D2-05-L3-PRESCRITIVA.md).
> **Tempo de leitura:** 120-180 min (com exercícios).
> **Fonte canônica:** [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md) §L4-L6 + LABs + transversais.

---

## §0. Por que L4-L6 vêm depois de L3

L3 prescreve **o que fazer**. L4-L6 respondem **como usar com responsabilidade**:
- **L4:** como comunicar para o Conselho sem perder a nuance.
- **L5:** como auditar se o modelo está realmente calibrado.
- **L6:** como modelar risco de cauda extrema (eventos raros que importam mais).

Estes layers são para o profissional que **já sabe prescrever** e agora precisa defender seu trabalho diante de auditor externo, Big 4, ou Board global.

### §0.1 Mapa conceitual visual

```
L0 → L1 → L2 → L3 (prescrição)
              ↓
              L4 (comunicação executiva)
              ↓
              L5 (calibração + interpretabilidade)
              ↓
              L6 (especialização: cauda, stress, mesa)
              ↓
              LAB (98 avançado + 99 exercícios)
              ↓
              Transversais (AA tour + BB biblio + ZZ fórmulas)
```

---

## §1. L4 — Comunicação Executiva

A pergunta operacional: **"como apresentar VaR R$ 6,43 bi para um Conselho que não é técnico?"**

### §1.1 L4.0 — Comunicação ao Conselho (4 trilhas)

O [`L4.0-comunicacao-conselho.md`](../../d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md) define **4 trilhas de comunicação** por stakeholder:

| Stakeholder | Tempo | O que importa | Linguagem |
|---|---|---|---|
| **CEO** | 30-60 min | Decisão macro (hedge? pagar ViE?) | "Estamos em modo tensão. Recomendamos hedge 60% em 30 dias." |
| **Conselho** | 15-30 min | Composite + 3 ações críticas + ROI | "Composite 71,8 = modo tensão. 3 ações 90d = R$ 200M stress evitado com R$ 3M investido." |
| **CFO** | 60 min | VaR/CVaR + NPV por ação | "VaR refresh R$ 6,43 bi vs v2.0.1 R$ 8,21 bi. AG-001 NPV marginal = +R$ 1,7 bi em 3 anos." |
| **CRO/Risk Officer** | 2h | Trigger matrix + RACI + calibragem | "T-MV1 4-shock disparado em 5 min → composite 95 fixo, freeze all, bridge R$ 800M." |

### §1.2 O 1-pager executivo (template)

O formato canônico:

1. **Status bar** (1 linha): Composite X / 100 (cluster Y), VaR R$ Z bi, top backdown.
2. **Top 3 decisões** (1 linha cada): Ação, custo, benefício, gate, owner, SLA.
3. **Cronograma 90 dias** (6 ondas): cada onda com milestone e NPV liberado.
4. **Onde estamos no composite** (5 dimensões): S1, S2, S3, S6, S7 status atual.
5. **Evidência** (links para 5 artefatos): One-Pager, Slide Deck, KG snapshot, Conselho Memo, Delegation Plan.

> **Exemplo canônico:** [`outputs/SNAPSHOT-OPERACIONAL.md`](../../outputs/SNAPSHOT-OPERACIONAL.md) — 1 página A4 com 9 seções, 5min de leitura.

### §1.3 4 templates de slides

O [`L4.0`](../../d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md) define 4 templates:

| Template | Quando | Estrutura |
|---|---|---|
| **Slide 1: Composite + Status** | Sempre (capa) | Gauge visual + 3 setas (câmbio, supply, regulatório) |
| **Slide 2: Top 3 Ações** | Conselho + CEO | Tabela com 3 linhas (ação, custo, benefício, owner) |
| **Slide 3: Stress Test** | Conselho + CRO | Tornado plot + tabela de VaR por cenário |
| **Slide 4: Cronograma 90d** | Conselho + PMO | Timeline visual + 6 ondas + NPV liberado |

### §1.4 5 anti-patterns de comunicação

| Anti-pattern | Por que é ruim | Solução |
|---|---|---|
| **"VaR é o risco máximo"** | CVaR é maior; VaR é só percentil | Sempre citar VaR e CVaR juntos |
| **"Stress test cobre todos os cenários"** | MC é probabilístico, não determinístico | Dizer "10k paths × 6m, P5 = −4,78pp" |
| **"Modelo tem 95% de acerto"** | Backtesting é 5/5 ≠ "95% acerto" sempre | Citar TP/FN/FP, time-to-action, accuracy |
| **"Composite subiu, fizemos algo errado"** | Composite realinha com realized risks | Explicar drift cross-version (D3 v2.0.1) |
| **"Hedge a 50% resolve"** | h* depende de ViE (30%-91%) | Constraint-based, não flat |

### §1.5 L4.1 — Dashboards executivos

O [`L4.1-dashboards-executivos.md`](../../d2-econometric-vulnerability/_study_notes/L4.1-dashboards-executivos.md) cobre:

- **Anatomia 5 camadas**: dados → signal → decision → action → learning.
- **Estudo de caso:** [`cap6_dashboard_final.png`](../../d2-econometric-vulnerability/outputs/cap6_dashboard_final.png) (343 KB).
- **Stack técnico:** Plotly Dash, dash-cytoscape (grafos), dash-bootstrap-components.
- **Interatividade:** hover tooltips, drill-down por dimensão, export CSV/PDF.

**Regra de ouro:** dashboard para Conselho ≠ dashboard para CRO.

| Para Conselho | Para CRO |
|---|---|
| 1 gauge (composite) | 11 gauges (1 por S) |
| 3 setas (top 3 ações) | Tabela de 25 ações com RACI |
| 1 timeline (90d) | Trigger matrix 6×3 com status |
| Sem drill-down | Drill-down por S, com VaR por cenário |

### §1.6 L4.2 — Gap modelo-humano

O [`L4.2-gap-modelo-humano.md`](../../d2-econometric-vulnerability/_study_notes/L4.2-gap-modelo-humano.md) cobre o que o modelo **FAZ vs NÃO FAZ**:

**O modelo FAZ:**
- Quantificar VaR/CVaR.
- Identificar regimes (Hamilton Markov).
- Disparar triggers automaticamente.
- Prescrever ações baseadas em cenários.

**O modelo NÃO FAZ:**
- **Decidir** por humanos (modelo propõe, humano decide).
- **Substituir** julgamento em eventos fora-da-amostra (black swans).
- **Eliminar** incerteza política (BNDES depende de Congresso).
- **Garantir** que o hedge é executado (depende da contraparte aceitar).

**4 pressupostos do D2 que precisam ser comunicados:**

1. **Rational actors** (jogo competitivo Stellantis/GM/VW/Geely).
2. **Distribuição estacionária** (GARCH assume).
3. **ρ FX-Supply constante** (= 0,4; em crises, ρ → 1).
4. **Dados públicos** (proxy para dados internos — supply share, etc.).

**Cognitive biases a vigiar:**
- Anchoring em composite 71,8 (número vira âncora, ignora realized risks).
- Confirmation bias (só lê docs que confirmam hipótese).
- Loss aversion (executivo prefere evitar perda a buscar ganho).

---

## §2. L5 — Calibração e Interpretabilidade

A pergunta operacional: **"como saber se o modelo está realmente certo?"**

### §2.1 L5.0 — Calibração regime-switching (3 testes)

O [`L5.0-calibracao-regime-switching.md`](../../d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md) cataloga 3 testes clássicos:

#### §2.1.1 Kupiec test (1995)

Testa se a **frequência de breaches** do VaR é consistente com o nível de confiança declarado.

- H0: "frequência de breaches = α" (1 − confidence).
- Exemplo: VaR 95% deveria ter 5% de breaches. Se tem 15% → modelo ruim.

```python
from scipy.stats import binom
breaches = 50  # em 1000 dias
expected_breaches = 50  # 5% de 1000
p_value = 1 - binom.cdf(breaches - 1, 1000, 0.05)
# Se p < 0.05 → rejeita H0 → modelo ruim
```

#### §2.1.2 Christoffersen test (1998)

Testa se os breaches são **independentes** (não clustered).

- H0: "breaches são i.i.d."
- Se breaches vêm em clusters (modelo erra junto), modelo ruim.

#### §2.1.3 PIT (Probability Integral Transform)

Testa se os **P-values** da distribuição prevista são uniformes em [0,1].

- H0: "PIT ~ Uniforme(0,1)".
- Se sistemático abaixo de 0.5 ou acima de 0.5 → viés.

#### §2.1.4 Hamilton Markov regime switching

Modelo alternativo ao GARCH para detectar **regimes** (calma vs turbulência).

- Parâmetros D2: regime atual = CALMA, P=97,8%, vol esperada hoje = 6,26% a.a. vs GARCH long-run 14,67%.
- Limitação: modelo hard-threshold (não MLE conjunta); durações curtas demais (1-4 dias).

#### §2.1.5 Quando GARCH falha (sinais de alerta)

| Sinal | Diagnóstico |
|---|---|
| ARCH-LM significativo nos resíduos² | Modelo ainda tem ARCH effect → upgrade para GJR/EGARCH |
| Normality test rejeita | Use t-Student (já feito) ou EVT |
| Eigenvalues fora do círculo unitário | Modelo não-estacionário → recalibrar |
| Leverage γ insignificante | OK; mas se forte, use GJR |

### §2.2 L5.1 — Interpretabilidade (SHAP/LIME)

O [`L5.1-interpretabilidade-shap-lime.md`](../../d2-econometric-vulnerability/_study_notes/L5.1-interpretabilidade-shap-lime.md) cobre 4 ferramentas:

| Ferramenta | Quando usar | Limitação |
|---|---|---|
| **Tornado plot** | Sensibilidade 1-D (qual fator mais impacta) | Ignora interações |
| **SHAP** | Interpretação local (por observação) + global (summary plot) | Computacionalmente caro |
| **LIME** | Interpretação local de modelos complexos | Inconsistente entre runs |
| **PDP/ICE** | Efeito marginal médio (PDP) ou individual (ICE) | Assume independência entre features |

**Aplicação D2/D3:**
- Tornado do VaR 4-shock: tariff (29%), FX (22,5%), supply (18%).
- SHAP para entender por que uma cell específica da matriz S3×S6 disparou.
- LIME para justificar decisões individuais de trigger.

---

## §3. L6 — Especialização: Cauda, Stress, Mesa

A pergunta operacional: **"como modelar o que está além do VaR?"**

### §3.1 L6.0 — Risco de cauda extrema (EVT)

O [`L6.0-risco-cauda-extremo.md`](../../d2-econometric-vulnerability/_study_notes/L6.0-risco-cauda-extremo.md) cobre Extreme Value Theory (EVT) com Generalized Extreme Value (GEV) e Generalized Pareto Distribution (GPD).

#### §3.1.1 Block Maxima (GEV)

$$\text{Block Maxima} = \max\{X_1, ..., X_n\} \sim \text{GEV}(\mu, \sigma, \xi)$$

- ξ > 0: cauda pesada (Fréchet).
- ξ = 0: cauda exponencial (Gumbel).
- ξ < 0: cauda limitada (Weibull).

#### §3.1.2 Peaks Over Threshold (GPD / POT)

Para cada observação acima de um threshold u, modela **excesso** (X − u):

$$\text{Excesso} \sim \text{GPD}(\sigma_u, \xi)$$

**Aplicação D2:**
- VaR 99,5% (EVT) ≈ 2,815% PTAX (1 dia).
- VaR 99,9% (EVT) ≈ 3,773% PTAX (1 dia).
- ES 99% (EVT) ≈ 3,411% PTAX.
- ES 99,9% (EVT) ≈ 4,371% PTAX.

> **Comparação:** VaR 99% via MC simples ≈ 3,773%; via EVT ≈ 3,773%. Concordam, validando o modelo.

#### §3.1.3 Por que EVT > VaR normal para cauda

- VaR Normal assume distribuição finita nas caudas.
- EVT usa **apenas as observações extremas** (acima do threshold).
- É matematicamente mais rigoroso para VaR 99%+.
- **Limitação:** precisa de muitas observações (≥ 1.000).

### §3.2 L6.1 — Stress testing institucional

O [`L6.1-stress-testing-institucional.md`](../../d2-econometric-vulnerability/_study_notes/L6.1-stress-testing-institucional.md) cobre o framework regulatório:

- **CCAR** (US Federal Reserve) — Comprehensive Capital Analysis and Review.
- **DFAST** (US) — Dodd-Frank Act Stress Test.
- **EBA** (EU) — European Banking Authority stress tests.
- **BACEN/CMN** (BR) — Resolução 4.557 (2017), programa de testes de estresse.

**3 cenários padrão:**
1. **Baseline** (cenário base) —延续 condições atuais.
2. **Adverse** (adverso) — recessão moderada.
3. **Severely Adverse** (severamente adverso) — recessão severa + stress simultâneo.

**Reverse stress test** — qual cenário faria a empresa falir? Mais útil do que perguntar "quanto perdemos em stress moderado?".

### §3.3 L6.2 — Mesa de risco operacional

O [`L6.2-mesa-risco-operacional.md`](../../d2-econometric-vulnerability/_study_notes/L6.2-mesa-risco-operacional.md) cobre o "chão de fábrica" do risk management:

- **Intraday VaR** (vol 5min, 30min, 1h, 4h).
- **Limites** (notional, VaR, P&L, concentration).
- **Pre-trade check** (não permite trade que quebra limite).
- **Post-trade reconciliation** (bate com contraparte).
- **SI** (Systematic Internaliser) — reporte obrigatório.
- **Breaks** (diferenças entre interno e contraparte).
- **Runbook** (procedimento operacional padrão).

---

## §4. LABs práticos (98-LAB-ADVANCED + 99-LAB-EXERCISES)

### §4.1 99-LAB-EXERCISES — 7 exercícios EASY-EXPERT

O [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) tem 7 exercícios hands-on. Recomendação: faça os 3 primeiros antes de L2; os 4 últimos após L5.

| # | Exercício | Dificuldade | Tempo |
|---|---|---|---|
| Ex1 | Calcule vol 30d de PTAX com numpy | EASY | 10 min |
| Ex2 | Plote histograma de log-retornos | EASY | 15 min |
| Ex3 | Calcule VaR empírico | MEDIUM | 20 min |
| Ex4 | Pipeline EDA completo | MEDIUM | 45 min |
| Ex5 | Calcule HHI | MEDIUM | 15 min |
| Ex6 | Identifique outliers | MEDIUM | 20 min |
| Ex7 | Fit GARCH(1,1)-t | HARD | 60 min |

### §4.2 98-LAB-ADVANCED — LAB avançado

O [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md) tem backtesting adversarial, regime switching hands-on, e exercícios de EVT.

---

## §5. Transversais (AA, BB, ZZ)

### §5.1 AA — Como ler este projeto (tour guiado)

O [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md) tem 4 trilhas por perfil (júnior 30min, pleno 2h, sênior 3h, executivo 15min) + glossário rápido + verdade vs estimado.

### §5.2 BB — Bibliografia (10 livros + 8 papers + 4 trilhas)

| Livro | Capítulos chave | Quando ler |
|---|---|---|
| **Hull — Risk Management and Financial Institutions** | 1-3 (VaR, CVaR), 22-23 (GARCH) | Antes de L0.3 / L2.1 |
| **Tsay — Analysis of Financial Time Series** | 1-4 (séries temporais), 7-9 (GARCH) | Antes de L1.0 / L2.1 |
| **Cont — Empirical Analysis of Financial Time Series** | 8-10 (GARCH com profundidade) | Antes de L2.1 |
| **McNeil, Frey, Embrechts — Quantitative Risk Management** | 2-7 (VaR, EVT, copulas) | Antes de L6.0 |
| **Christoffersen — Elements of Financial Risk Management** | 4 (Kupiec/Christoffersen) | Antes de L5.0 |
| **Taleb — The Black Swan** | Todo | Antes de L6.0 (mindset) |
| **Kahneman — Thinking, Fast and Slow** | 24-25 (heurísticas) | L4.2 (gap modelo-humano) |

| Paper | Quando ler |
|---|---|
| Engle (1982) ARCH | Antes de L2.1 (origem) |
| Bollerslev (1986) GARCH | Antes de L2.1 (generalização) |
| Kupiec (1995) | Antes de L5.0 |
| Christoffersen (1998) | Antes de L5.0 |
| McNeil, Frey (2000) EVT | Antes de L6.0 |

### §5.3 ZZ — Glossário de fórmulas (50+ verbetes)

O [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) tem 50+ fórmulas em ordem alfabética, cada uma com:

- Símbolo + unidades.
- Fórmula LaTeX.
- Exemplo numérico do D2.
- Cross-refs para a layer onde é definida/usada.

**Top 10 verbetes ZZ:**

1. α (ARCH) — 0,0488
2. β (GARCH) — 0,9418
3. ν (Student-t df) — 6,99
4. VaR (Value at Risk) — R$ 6,43 bi (refresh) / R$ 8,21 bi (v2.0.1)
5. CVaR (Expected Shortfall) — R$ 8,04 bi / R$ 10,14 bi
6. σ (volatilidade anualizada) — 14,19% / 14,86% (BCB 10y)
7. half-life — 73,3 dias
8. HHI — 4.850 (bateria)
9. ρ (correlação) — 0,4 (FX-Supply)
10. persistence (α+β) — 0,9906

---

## §6. As 7 armadilhas clássicas de L4-L6

### §6.1 Comunicar VaR sem CVaR

VaR é percentil. CVaR é média da cauda. Conselho precisa dos dois. Sempre juntos.

### §6.2 Achar que backtesting 5/5 = "modelo perfeito"

Backtesting cobre 5-6 stress events. Black swan events (COVID 2020, lítio spike 2022) foram parcialmente cobertos. 5/5 ≠ "100% acerto sempre".

### §6.3 Confundir SHAP com causalidade

SHAP mede **contribuição para previsão**, não causa. Não use SHAP para dizer "se eu mudar X, Y muda".

### §6.4 Aplicar EVT sem threshold adequado

Se threshold é muito alto, amostra é pequena. Se muito baixo, EVT vira mistura de normal. Use diagnóstico de mean residual life plot.

### §6.5 Subestimar a mesa de risco operacional

Backtesting bonito em monthly close não sobrevive intraday stress. A mesa operacional (limites, breaks, reconciliation) é o que separa risk management teórico de prático.

### §6.6 Confundir "modelo calibrado" com "modelo que prevê certo"

Calibração (Kupiec/Christoffersen) testa **estatísticas agregadas**. Previsão certa testa **observação individual**. São complementares.

### §6.7 Esquecer o ciclo de learning

Modelo calibrado em jan/2026 pode estar descalibrado em jul/2026 (regime mudou). Recalibre trimestralmente. Sempre.

---

## §7. Quiz de auto-avaliação L4-L6

- [ ] Sei distinguir **comunicação para Conselho vs CRO**.
- [ ] Sei citar **3 anti-patterns de comunicação**.
- [ ] Sei dizer o que é **Kupiec test** e quando usar.
- [ ] Sei dizer o que é **Christoffersen test** e quando usar.
- [ ] Sei o que é **EVT** e por que é melhor que VaR Normal para cauda.
- [ ] Sei citar **VaR 99,5% EVT (2,815%)** vs **VaR 99,9% EVT (3,773%)**.
- [ ] Sei o que é **GPD** vs **GEV**.
- [ ] Sei o que é **reverse stress test**.
- [ ] Sei o que é **intraday VaR** vs **end-of-day VaR**.
- [ ] Sei dizer **3 livros** da bibliografia BB para fixar VaR/GARCH/EVT.

Se 8/10+: pronto para **auditar D2** ou construir o próprio framework.

---

## §8. Mapa final — saída da base D2

Quando terminar L4-L6, você está pronto para:

### §8.1 Auditar D2 para um cliente ou sponsor executivo

Você consegue:
- Apresentar VaR/CVaR sem perder a nuance.
- Explicar a diferença entre VaR refresh (R$ 6,43 bi) e v2.0.1 (R$ 8,21 bi).
- Defender o composite (71,8 stakeholder / 78 técnico / 50,3 v2.0.1).
- Listar limitações honestamente (rho FX-Supply constante, dados públicos).

### §8.2 Operar um framework de risco em produção

Você consegue:
- Disparar triggers automaticamente (Python + scheduler).
- Calibrar GARCH mensalmente.
- Rodar Kupiec/Christoffersen trimestralmente.
- Atualizar composite em weekly meeting.

### §8.3 Construir o próprio framework (reaproveitar estrutura)

A base D2 é **reaproveitável**. Para outro projeto:
- Copie a estrutura L0-L6 + LAB + transversais.
- Substitua os números (PTAX → outro ativo; CATL → outro fornecedor).
- Mantenha os cross-refs validados por `_validate_xrefs.py`.

---

## §9. Recursos auxiliares para L4-L6

### §9.1 Docs canônicos

- [`L4.0-comunicacao-conselho.md`](../../d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md) — comunicação Conselho (29 KB, 471 linhas).
- [`L4.1-dashboards-executivos.md`](../../d2-econometric-vulnerability/_study_notes/L4.1-dashboards-executivos.md) — dashboards (37 KB, 440 linhas).
- [`L4.2-gap-modelo-humano.md`](../../d2-econometric-vulnerability/_study_notes/L4.2-gap-modelo-humano.md) — gap modelo-humano (28 KB, 290 linhas).
- [`L5.0-calibracao-regime-switching.md`](../../d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md) — Kupiec/Christoffersen/Hamilton (46 KB, 1011 linhas).
- [`L5.1-interpretabilidade-shap-lime.md`](../../d2-econometric-vulnerability/_study_notes/L5.1-interpretabilidade-shap-lime.md) — SHAP/LIME/PDP/ICE (32 KB, 520 linhas).
- [`L6.0-risco-cauda-extremo.md`](../../d2-econometric-vulnerability/_study_notes/L6.0-risco-cauda-extremo.md) — EVT com GEV/GPD (31 KB, 705 linhas).
- [`L6.1-stress-testing-institucional.md`](../../d2-econometric-vulnerability/_study_notes/L6.1-stress-testing-institucional.md) — CCAR/DFAST/EBA/BACEN (21 KB, 411 linhas).
- [`L6.2-mesa-risco-operacional.md`](../../d2-econometric-vulnerability/_study_notes/L6.2-mesa-risco-operacional.md) — intraday VaR + limites (23 KB, 624 linhas).

### §9.2 LABs

- [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md) — LAB avançado (23 KB, 458 linhas).
- [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md) — 7 exercícios EASY-EXPERT (27 KB, 690 linhas).

### §9.3 Transversais

- [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md) — tour guiado (20 KB, 275 linhas).
- [`BB-bibliografia-leituras-recomendadas.md`](../../d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md) — 10 livros + 8 papers (30 KB, 507 linhas).
- [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) — 50+ fórmulas (15 KB, 317 linhas).

### §9.4 Outputs canônicos

- [`cap6_dashboard_final.png`](../../d2-econometric-vulnerability/outputs/cap6_dashboard_final.png) — dashboard final (343 KB).
- [`regulatory-scenarios.html`](../../d2-econometric-vulnerability/outputs/regulatory-scenarios.html) — 4 cenários BNDES (8.1 KB).
- [`competition-landscape.html`](../../d2-econometric-vulnerability/outputs/competition-landscape.html) — projeção share 2026-2028 (8.8 KB).
- [`composite-vulnerability-radar.html`](../../d2-econometric-vulnerability/outputs/composite-vulnerability-radar.html) — radar 4 dimensões (8.2 KB).

### §9.5 Notebooks relacionados

- [`NB-04-competition-game-theory.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-04-competition-game-theory/nb-04-competition-game-theory.ipynb) — game theory.
- [`NB-05-composite-index-radar.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-05-composite-index-radar/nb-05-composite-index-radar.ipynb) — composite.
- [`NB-15-final-dashboard.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-15-final-dashboard/nb-15-final-dashboard.ipynb) — dashboard final.

---

## §10. Takeaways em 7 bullets (para fixar)

1. **L4 é sobre comunicação, não sobre modelo.** Stakeholders diferentes precisam de mensagens diferentes. Conselho ≠ CRO.

2. **L5 é sobre auditoria de modelo.** Kupiec testa frequência; Christoffersen testa independência; PIT testa calibração global.

3. **L6 é sobre cauda extrema.** EVT com GPD/GEV é matematicamente superior a VaR Normal para VaR 99%+.

4. **LAB 99 são 7 exercícios.** Faça os 3 primeiros antes de L2; os 4 últimos após L5.

5. **Transversais:** AA é o tour, BB é a bibliografia, ZZ é o glossário. Sempre volte a eles como referência.

6. **Anti-pattern #1:** comunicar VaR sem CVaR. Sempre juntos.

7. **Ciclo de learning é obrigatório.** Recalibre trimestralmente. Modelo vivo, não estátua.

---

## §11. Sumário da série completa de Notas-Meta D2

Esta é a última nota da série **Notas-Meta D2**. As 6 notas cobrem toda a base D2:

| # | Nota | Conteúdo | Linhas |
|---|---|---|---|
| **01** | [Trilha de Meta-Learning](./NOTA-META-D2-01-TRILHA-APRENDIZADO.md) | Visão geral da base, trilha por perfil, 14 métricas-mestre | ~700 |
| **02** | [L0 Fundamentos](./NOTA-META-D2-02-L0-FUNDAMENTOS.md) | 14 métricas + 5 distribuições | ~470 |
| **03** | [L1 EDA](./NOTA-META-D2-03-L1-EDA.md) | 10 passos EDA + supply chain + V1-V31 | ~480 |
| **04** | [L2 Preditiva](./NOTA-META-D2-04-L2-PREDITIVA.md) | GARCH(1,1)-t + MC stress test + VaR | ~450 |
| **05** | [L3 Prescritiva](./NOTA-META-D2-05-L3-PRESCRITIVA.md) | Matriz S3×S6 + triggers + RACI | ~470 |
| **06** | [L4-L6 + LAB + Transversais](./NOTA-META-D2-06-L4-L6-LAB.md) | Comunicação + calibração + cauda + LAB | ~530 |

**Total: ~3.100 linhas de meta-aprendizado cobrindo a base D2 de ~16.500 linhas.**

### §11.1 Navegação rápida entre as notas

```
[01] Visão geral
       ↓
[02] L0 — Fundamentos (alfabeto)
       ↓
[03] L1 — EDA (primeira leitura dos dados)
       ↓
[04] L2 — Modelagem preditiva (GARCH, MC)
       ↓
[05] L3 — Análise prescritiva (matrizes, triggers, RACI)
       ↓
[06] L4-L6 + LAB + Transversais (uso responsável + auditoria)
       ↓
       APLICAR em:
       - Auditar D2 para cliente
       - Operar framework em produção
       - Reaproveitar estrutura em outro projeto
```

---

*Versão 1.0 — 25/ago/2026 — escrita como guia de meta-aprendizado dos Layers L4-L6 + LAB + transversais.*

*Esta nota encerra a série Notas-Meta D2. Para a próxima etapa (D3 framework prescritivo), consultar [`/HUB.md`](../../HUB.md) ou [`/analise-prescritiva/notebooks!/LINHAGEM.md`](../../analise-prescritiva/notebooks!/LINHAGEM.md).*