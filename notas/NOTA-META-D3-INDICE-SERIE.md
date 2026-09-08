---
slug: notas-meta-d3-indice-serie
title: "Notas-Meta D3 — Índice da Série · 6 Notas de Meta-Aprendizado sobre o Framework Prescritivo D3"
ueid: ikigai:nota:d3-meta-indice-serie:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d3, meta-learning, indice, serie-notas, trilha-aprendizado, capas]
custom:
  _purpose: >-
    Índice / capa da série de 6 Notas-Meta D3 sobre o framework
    prescritivo Decision Framework D3 v2.0.2 (BYD Camaçari 2025-2027).
    Permite navegação rápida entre as notas, define a ordem de leitura
    recomendada por perfil, e explicita as conexões entre as notas e
    o D3 framework canônico em /analise-prescritiva/reports/decision-framework/.
  _audience: risk-officer, COO, CEO, Conselho, head-de-risk, pesquisador
  _data_sources:
    - /analise-prescritiva/reports/decision-framework/CLAUDE.md
    - /analise-prescritiva/reports/decision-framework/README.md
    - /analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md
    - todas as 6 Notas-Meta D3 (links abaixo)
  _outputs:
    - indice-serie
    - trilha-leitura-recomendada
    - navegacao-rapida
    - mapa-conexoes-notas-framework
  _success_criteria: >-
    leitor consegue escolher trilha por perfil e acessar cada nota em <30s.
---

# Notas-Meta D3 — Índice da Série

> **Versão**: 1.0 — 25/ago/2026
> **Audiência**: qualquer pessoa chegando ao D3 framework e querendo aprender como estudá-lo.
> **Propósito**: capa/índice de navegação rápida entre as 6 Notas-Meta D3 que cobrem todo o framework prescritivo.
> **Companhia a**: [`/HUB.md`](../../HUB.md) (índice cruzado cross-tema) + série de [Notas-Meta D2](.././notas/NOTA-META-D2-INDICE-SERIE.md) (camada descritiva + preditiva).

---

## §0. O que é esta série

Esta é uma série de **6 notas de meta-aprendizado** escritas para acompanhar o estudo do **D3 framework (Decision Framework BYD Camaçari 2025-2027)**. Cada nota é uma "ponte" entre um componente específico do D3 (overview, arquitetura, acoplamentos, governança, calibração, limitações) e o framework canônico.

A série foi desenhada para funcionar como:
- **Pré-leitura** antes de entrar nos artefatos oficiais do D3.
- **Revisão paralela** durante a leitura do framework (consulte a nota quando travar em um conceito).
- **Pós-leitura** como checklist de domínio.

A **base canônica** (~250+ docs em [`/analise-prescritiva/reports/decision-framework/`](../../analise-prescritiva/reports/decision-framework/)) é densa. Esta série tem ~2.730 linhas — **compressão ~50:1** para uma primeira leitura.

---

## §1. Mapa da série

```
Notas-Meta D3 (1 capa + 6 notas)

[00] Capa     →  NOTA-META-D3-INDICE-SERIE  (esta nota)
       ↓
[01] Trilha   →  NOTA-META-D3-01-TRILHA-OVERVIEW  (overview + 5 versões)
       ↓
[02] Arquitetura → NOTA-META-D3-02-ARQUITETURA-11D  (5 camadas + 11 dims + h*)
       ↓
[03] Acoplamentos → NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY  (20 couplings + NASH + duplo cost-shock)
       ↓
[04] Governança → NOTA-META-D3-04-GATES-RACI-ACOES  (9 approval + 7 kill + 17 personas + 40 ações)
       ↓
[05] Calibração → NOTA-META-D3-05-CALIBRACAO-BACKTESTING  (5 recalibrações + 4 fixes + 5/5 PERFEITO)
       ↓
[06] Honestidade → NOTA-META-D3-06-LIMITACOES-HONESTIDADE-CTA  (limitações + CTA + viabilidade)
```

> **Nota sobre numeração:** A #04 foi escrita em 2 partes (acoplamentos + governança). O nome do arquivo `NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY.md` reflete o conteúdo de acoplamentos, mas o título interno é "Acoplamentos Quantitativos + Game Theory".

---

## §2. As 6 notas (visão rápida)

### §2.1 [Nota-Meta #01 — Trilha + Overview](./NOTA-META-D3-01-TRILHA-OVERVIEW.md)

| | |
|---|---|
| **Função** | Capa de entrada do D3. Cobre o que é, como evoluiu (5 versões: v0.5 → v0.6 → v2.0 → v2.0.1 → v2.0.2), o que entrega (4 HTMLs, 11 docs narrativos, 12 MP3s, 5 ações 90d). |
| **Tamanho** | 22 KB, 365 linhas |
| **Tempo de leitura** | 45-60 min |
| **Quando ler** | **PRIMEIRO** — antes de qualquer outro doc do D3 |
| **Público** | qualquer pessoa chegando ao D3 |

**Takeaways principais:**
1. D3 = framework prescritivo operacional (D2 diz o que está errado; D3 diz o que fazer).
2. 5 versões em 4 meses (v0.5 → v0.6 → v2.0 → v2.0.1 → v2.0.2). Cada uma adicionou capabilities e fechou gaps do D2-AUDIT.
3. 5-Layer Architecture (Data → Signal → Decision → Action → Learning). 45 triggers, 12 decision trees, 40 ações, 17 personas RACI, 9 approval + 7 kill gates.
4. 11 dimensões S1-S11 com 20 couplings quantitativos. Composite 50,3 RED Modo Crise.
5. ROI 200×, payback < 1 mês.

### §2.2 [Nota-Meta #02 — Arquitetura 5 camadas + 11 dimensões](./NOTA-META-D3-02-ARQUITETURA-11D.md)

| | |
|---|---|
| **Função** | Deep dive em cada uma das 5 camadas (Data → Signal → Decision → Action → Learning) e em cada uma das 11 dimensões S1-S11. Cobre a fórmula h* canônica e a renormalização sum=1,15 → 1,00. |
| **Tamanho** | 23 KB, 460 linhas |
| **Tempo de leitura** | 60-90 min |
| **Quando ler** | Depois da #01, antes das #03-#05 |
| **Público** | risk officer, modelador, COO, pesquisador |

**Takeaways principais:**
1. 5 camadas = sistema nervoso autônomo. Layer 1 (DATA) consome D2. Layer 2 (SIGNAL) detecta mudança. Layer 3 (DECISION) prescreve. Layer 4 (ACTION) executa. Layer 5 (LEARNING) fecha o loop.
2. 11 dimensões S1-S11 com 20 couplings quantitativos. Composite 50,3 RED Modo Crise.
3. h* = 91% - (ViE%/22%) × 61% é a fórmula-estrela do coupling S1↔S3.
4. S7 ESG kill switch sobrepõe tudo: quando lista suja MTE ativa, composite trava em 95 fixo.
5. Layer 5 (LEARNING) ainda não totalmente operacional — re-backtesting projetado, não re-rodado mensalmente.

### §2.3 [Nota-Meta #03 — Acoplamentos + Game Theory](./NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY.md)

| | |
|---|---|
| **Função** | Deep dive nos 5 Modeled Couplings primários + 15 secundários = 20 couplings quantitativos, e no game theory de 5 players (BYD/Stellantis/GM/VW/Geely) com NASH E3. |
| **Tamanho** | 22 KB, 437 linhas |
| **Tempo de leitura** | 60-90 min |
| **Quando ler** | Depois da #02, antes da #04 |
| **Público** | risk officer, modelador, COO, pesquisador, CSO |

**Takeaways principais:**
1. 5 primários + 15 secundários = 20 couplings quantitativos.
2. h* = 91% - (ViE%/22%) × 61% é a fórmula-estrela. Captura contraint-based hedging.
3. VaR conjunto FX+Supply = 2,5× em RED (correlação positiva).
4. Hedge R$ 480/unit vs Defensivo R$ 4.500/unit (~9× ratio).
5. NASH E3 (Differentiate, Differentiate). Guerra de preços é o pior resultado conjunto (-R$ 8,6 bi NPV agregado). Tariff é o maior contributor VaR (29%).

### §2.4 [Nota-Meta #04 — Gates + RACI + 40 ações](./NOTA-META-D3-04-GATES-RACI-ACOES.md)

| | |
|---|---|
| **Função** | Deep dive no sistema de governança — 9 approval gates, 7 kill gates, 17 personas RACI, e as 40 ações executáveis. |
| **Tamanho** | 20 KB, 378 linhas |
| **Tempo de leitura** | 60-90 min |
| **Quando ler** | Depois da #03, antes da #05 |
| **Público** | COO, Conselho, CSO, risk officer, head de risco |

**Takeaways principais:**
1. 9 approval gates por valor: < R$ 5M (Risk Officer) → > R$ 280M (Board global).
2. 7 kill gates são opostos dos approval gates — bloqueiam emergência. K1 (S7 lista suja) está ATIVO desde 07/abr/2026.
3. 17 personas RACI cobrem todas as decisões (vs 4 em D2 v1).
4. 40 ações executáveis vs 5 prescrições genéricas em D2.
5. ROI 200×, payback < 1 mês. 4 cadeiras vagas há 137 dias.

### §2.5 [Nota-Meta #05 — Calibração + Backtesting 5/5](./NOTA-META-D3-05-CALIBRACAO-BACKTESTING.md)

| | |
|---|---|
| **Função** | Deep dive nas 5 recalibrações empíricas (R1-R5), nos 4 fixes, nos 6 stress events, e na honestidade intelectual sobre o que 5/5 PERFEITO significa. |
| **Tamanho** | 21 KB, 380 linhas |
| **Tempo de leitura** | 60-90 min |
| **Quando ler** | Depois da #04, antes da #06 |
| **Público** | risk officer, CRO, auditor, pesquisador |

**Takeaways principais:**
1. 5 recalibrações R1-R5 atualizaram σ PTAX, lítio, h*, e limiares AMBER/RED. Composite caiu 71,8 → 50,3 por realized risks.
2. 6 stress events walk-forward 2020-2025: COVID, semicondutor, election 2022, lítio spike, election 2024, stagflação 2025.
3. 4 fixes (hysteresis, carry-trade filter, lítio asymmetry, 5-day confirmation) eliminaram FP 14,8% → 0%.
4. R$ 200M+/ano de stress evitado ÷ R$ 3M investido = ROI 67× em 1 ano ou 200× em 18 meses.
5. 5/5 PERFEITO NÃO significa 100% acerto sempre. 3 gaps abertos para v3.0.

### §2.6 [Nota-Meta #06 — Limitações + CTA + Viabilidade](./NOTA-META-D3-06-LIMITACOES-HONESTIDADE-CTA.md)

| | |
|---|---|
| **Função** | A nota final. Cobre (a) o que o D3 NÃO é, (b) o que precisa ser verdade, (c) call to action, (d) viabilidade econômica, (e) riscos de não implementar. |
| **Tamanho** | 29 KB, 522 linhas |
| **Tempo de leitura** | 30-45 min |
| **Quando ler** | **Por último** — a nota de decisão |
| **Público** | CEO, Conselho, COO, CFO, CRO, risk officer, headhunter |

**Takeaways principais:**
1. D3 tem 10 limitações honestas. Não cobre black swans, depende de dados públicos, é bem calibrado em condições normais. 3 gaps abertos para v3.0.
2. D3 depende de 7 assumptions. Se alguma falhar, framework degrada.
3. Call to action: 3 decisões em 5 minutos (AG-001, AG-003, stress test mensal). R$ 55M custo, R$ 200M+ benefício, payback < 1 mês.
4. ROI 200×, payback < 1 mês. NÃO implementar custa R$ 2,8-5,2 bi/ano em valor esperado.
5. 4 cadeiras vagas há 137 dias (CFO, CRO, CSO, Head ESG) são o gargalo crítico.
6. Roadmap v3.0 (Q4 2027): counterfactual + game theory full + macro prescriptive + rules engine FastAPI + KG v3.0. Investimento R$ 1,9M.
7. A frase guia: "Qualquer framework que diz 100% acerto sem mostrar onde errou está mentindo ou não testou."

---

## §3. Trilha de leitura recomendada por perfil

### §3.1 CEO / Conselho (15-30 min)

```
#01 (30 min) → #06 (30 min) — call to action
       ↓
       Decidir 3 coisas em 5 minutos
```

**Após ler:** você tem clareza do que o D3 faz, do que não faz, e do que precisa ser decidido AGORA.

### §3.2 Risk Officer / CRO (4-6 horas)

```
#01 → #02 (60 min) → #03 (60 min) → #05 (60 min) → #04 (60 min) → #06 (30 min)
```

**Após ler:** você domina arquitetura, couplings, calibração, governança, e pode auditar o framework.

### §3.3 COO / Head de Operações (3-4 horas)

```
#01 → #04 (60 min, foco em RACI + 5 ações 90d) → #03 (60 min, foco em S2 + S8) → #06 (30 min)
```

**Após ler:** você sabe o que executar nos próximos 90 dias e como o framework afeta supply chain + ramp.

### §3.4 CFO (2-3 horas)

```
#01 → #04 (60 min, foco em 9 approval + 5 ações 90d + bridge R$ 800M) → #06 (30 min)
```

**Após ler:** você tem clareza do orçamento do framework (R$ 3M) e dos approval gates.

### §3.5 Pesquisador / Auditor (8-12 horas)

Adicione:
- Leitura sequencial completa do [`/analise-prescritiva/reports/decision-framework/`](../../analise-prescritiva/reports/decision-framework/) (~250+ docs).
- Reprodução dos 15 notebooks canônicos NB-01..NB-15.
- Leitura dos 10 docs narrativos em [`/analise-prescritiva/case-studies/docs/`](../../analise-prescritiva/case-studies/docs/).
- **Toda a série** Notas-Meta D3 #01..#06.

---

## §4. Mapa de conexões (notas ↔ framework canônico)

| Nota-Meta | Cobre | Cross-refs principais |
|---|---|---|
| **#01** | Overview | [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md), [`README.md`](../../analise-prescritiva/reports/decision-framework/README.md), [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md) |
| **#02** | Arquitetura 5 camadas + 11 dims | [`/analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md`](../../analise-prescritiva/reports/decision-framework/1_framework/DECISION-FRAMEWORK.md), [`/analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D3-PRESCRIPTIVE-SPEC.md) |
| **#03** | Acoplamentos + Game Theory | [`/analise-prescritiva/reports/decision-framework/2_couplings/`](../../analise-prescritiva/reports/decision-framework/2_couplings/) (11 docs), [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-GAME-THEORY.md) |
| **#04** | Gates + RACI + 40 ações | [`/analise-prescritiva/reports/decision-framework/5_operational/`](../../analise-prescritiva/reports/decision-framework/5_operational/) (10 docs), [`/analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md`](../../analise-prescritiva/case-studies/docs/06-decisoes-personas-mapa.md) |
| **#05** | Calibração + Backtesting | [`/analise-prescritiva/reports/decision-framework/3_recalibration/`](../../analise-prescritiva/reports/decision-framework/3_recalibration/) (11 docs), [`/analise-prescritiva/reports/decision-framework/4_quantitative/D3-BACKTESTING-VALIDATION.md`](../../analise-prescritiva/reports/decision-framework/4_quantitative/D3-BACKTESTING-VALIDATION.md) |
| **#06** | Limitações + CTA + Viabilidade | [`/analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md`](../../analise-prescritiva/reports/decision-framework/1_framework/D2-AUDIT.md), [`/analise-prescritiva/reports/decision-framework/8_integration/D3-FUTURE-ROADMAP.md`](../../analise-prescritiva/reports/decision-framework/8_integration/D3-FUTURE-ROADMAP.md) |

---

## §5. As 25 Métricas Canônicas que Você Precisa Decorar (D3)

Aqui está o resumo consolidado das **25 métricas mais importantes** do D3 — meta-test ao final do estudo da série:

| # | Métrica | Valor D3 v2.0.2 | Onde aparece |
|---|---|---|---|
| 1 | Composite stakeholder 4-dim | **50,3** RED | #01, #06 |
| 2 | Composite técnico 11-dim | 78 AMBER | #01, #02 |
| 3 | VaR 95% 6m (4-shock) | **R$ 8,21 bi** | #01, #05 |
| 4 | CVaR 95% 6m | **R$ 10,14 bi** | #01, #05 |
| 5 | Vol 30d AMBER (S1) | 15% (recalibrado) | #02, #05 |
| 6 | Vol 30d RED (S1) | 30% (recalibrado) | #02, #05 |
| 7 | h* fórmula | `h* = 91% - (ViE%/22%) × 61%` | #02, #03 |
| 8 | h* Expansão (ViE 25%) | **35%** | #02, #05 |
| 9 | h* Continuidade (ViE 18%) | 46% | #02 |
| 10 | h* RB Parcial (ViE 10%) | 63% | #02 |
| 11 | h* RB Total (ViE 0%) | **91%** | #02 |
| 12 | Composite weights sum | 1,000 (renorm de 1,15) | #02 |
| 13 | S1 FX | 0,157 | #02 |
| 14 | S2 Supply | 0,139 | #02 |
| 15 | S3 BNDES | 0,157 | #02 |
| 16 | S4 Pricing | 0,139 | #02 |
| 17 | S7 ESG (kill switch) | 0,043 | #02, #04 |
| 18 | S10 Tariff | 0,043 | #02 |
| 19 | Tariff VaR contributor | **29%** (maior) | #03 |
| 20 | NASH E3 | (Differentiate, Differentiate) | #03 |
| 21 | # couplings | **20** (5 primários + 15 secundários) | #03 |
| 22 | # triggers | 45 (15 v2.0 + 15 v2.1 + 15 T-MV) | #04 |
| 23 | # personas | 17 | #04 |
| 24 | # approval gates | 9 | #04 |
| 25 | # kill gates | **7** (K1 ATIVO desde 07/abr/2026) | #04, #06 |

> **Meta-test:** ao final do estudo, escreva essas 25 em folha em branco. 22+/25 = pronto para defender o D3 diante do Conselho.

---

## §6. Próximas etapas após a série

### §6.1 Para quem quer **operar** o D3 em produção

→ [`/HUB.md`](../../HUB.md) — índice cruzado de toda documentação (D2 + D3 + outros).

→ [`/outputs/SNAPSHOT-OPERACIONAL.md`](../../outputs/SNAPSHOT-OPERACIONAL.md) — raid briefing Conselho 22-ago-2026 (1 página A4).

→ [`/analise-prescritiva/reports/decision-framework/CLAUDE.md`](../../analise-prescritiva/reports/decision-framework/CLAUDE.md) — fonte canônica da arquitetura.

### §6.2 Para quem quer **aprender a programar** os modelos

→ Executar os 15 notebooks canônicos NB-01..NB-15 em [`/analise-prescritiva/notebooks!/02-canonicos/`](../../analise-prescritiva/notebooks!/02-canonicos/).

→ Executar o D3-MAIN.html com scripts Python (`_gen_*.js`, `figures/_gen_*.py`).

### §6.3 Para quem quer **estudar mais**

→ [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES-FASE-3-PRESCRITIVA.md) — D3 v0.5 → v2.0.2 (635 linhas).

→ [`/analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md`](../../analise-prescritiva/case-studies/docs/INDEX-NARRATIVO.md) — 3 trilhas (audiência / tempo / perfil).

→ Série [Notas-Meta D2](./NOTA-META-D2-INDICE-SERIE.md) — D2 inteiro (L0-L6 + LAB + transversais + cross-version).

### §6.4 Para quem quer **reaproveitar** a estrutura

A base D3 é reaproveitável. Para outro projeto:
- Copie a arquitetura 5 camadas.
- Substitua os 11 dimensões S1-S11 (S1-S6 base, S7-S11 emergentes).
- Adapte os 20 couplings ao contexto.
- Mantenha o backtesting walk-forward com 6+ stress events.
- Mantenha o honestidade intelectual (5 recalibrações + 4 fixes documentados).

---

## §7. Mapa final — saída da série D3

```
Notas-Meta D3 (capa + 6 notas = 7 arquivos .md, ~138 KB, ~2.730 linhas)
       ↓
[entrada: novo usuário]
       ↓
Lê #01 (overview) → escolhe perfil → segue trilha
       ↓
[CEO/Conselho] #01 → #06 (para)
[Risk Officer] #01 → #02 → #03 → #05 → #04 → #06 (para)
[COO] #01 → #04 → #03 → #06 (para)
[CFO] #01 → #04 → #06 (para)
       ↓
[saída] /HUB.md + Notas-Meta D2 + LINHAGEM.md para D2 / outros casos
```

---

## §8. Índice de arquivos da série

```
/notas/
├── NOTA-META-D3-INDICE-SERIE.md                      (esta nota — capa)
├── NOTA-META-D3-01-TRILHA-OVERVIEW.md                (22 KB, ~365 linhas)
├── NOTA-META-D3-02-ARQUITETURA-11D.md                (23 KB, ~460 linhas)
├── NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY.md         (22 KB, ~437 linhas)
├── NOTA-META-D3-04-GATES-RACI-ACOES.md               (20 KB, ~378 linhas)
├── NOTA-META-D3-05-CALIBRACAO-BACKTESTING.md          (21 KB, ~380 linhas)
└── NOTA-META-D3-06-LIMITACOES-HONESTIDADE-CTA.md     (29 KB, ~522 linhas)

Total: 7 arquivos, ~138 KB, ~2.730 linhas
```

> **Nota:** o arquivo `NOTA-META-D3-04-ACOPLAMENTOS-GAMETHEORY.md` foi numerado como "04" porque foi escrito simultaneamente com a `#04` de governança, mas o conteúdo é de acoplamentos (que deveria ser `#03`). O título interno da nota é "Acoplamentos Quantitativos + Game Theory".

---

*Versão 1.0 — 25/ago/2026 — escrita como capa/índice da série Notas-Meta D3.*

*Para começar agora: abra [Nota-Meta #01 — Trilha + Overview](./NOTA-META-D3-01-TRILHA-OVERVIEW.md).*