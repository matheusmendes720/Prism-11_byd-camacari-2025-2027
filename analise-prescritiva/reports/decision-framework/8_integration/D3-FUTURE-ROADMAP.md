# D3 — Future Roadmap (v2.2 → v4.0)

**Documento estratégico** · O que pode ser entregue se o D3 v2.0.1 for contratado/implementado
**Data**: 21/jul/2026
**Status**: Working draft · v2.0.1 é o baseline; v2.2+ são próximos passos
**Escopo**: Anexo de vaga mostra **design de framework**; este doc mostra **o que vem depois se virar projeto**

---

## 1. Contexto: o que temos vs o que pode vir

### 1.1 v2.0.1 (atual) — Design state-of-the-art

| Item | Status |
|---|---|
| Framework teórico (matemática, regras) | ✅ Pronto |
| Documentação estruturada (37 docs, 4 HTMLs, 49 figs) | ✅ Pronto |
| Backtesting validation 5/5 targets (projetado) | ✅ Pronto |
| Pseudocódigo Python para rules engine | ✅ Pronto |
| YAML rules (4 fixes + ~30 originais) | ✅ Pronto |
| **Código de produção rodando** | ❌ **Não existe** |
| **Data feeds real-time conectados** | ❌ **Não existe** |
| **Deploy em ambiente real** | ❌ **Não existe** |

### 1.2 Escopo deste doc

Se o D3 v2.0.1 virar um **projeto contratado** (consultoria, emprego, partnership), há 4 caminhos incrementais (v2.2 → v4.0) para transformar o design em sistema operacional. Cada um tem escopo, prazo, custo e entregáveis definidos.

---

## 2. v2.2 — Implementation Sprint (4-6 semanas)

### 2.1 Objetivo

Transformar o design D3 v2.0.1 em **código Python production-grade** + **data feeds real-time** + **dashboard interativo**. Resultado: sistema que **roda** (não só descreve).

### 2.2 Escopo

| Componente | Tecnologia | Tempo | Owner |
|---|---|---|---|
| Rules engine (Python) | FastAPI + asyncio + YAML loader | 1.5 sem | Eng. senior |
| Data feeds (5 primários) | BCB API, Bacen, MTE, ANFAVEA, MDIC | 1.5 sem | Eng. pleno |
| NPV live layer | NumPy + Pandas + Parquet storage | 1 sem | Eng. senior |
| Dashboard interativo | Plotly Dash ou Streamlit | 1 sem | Eng. pleno |
| Re-backtesting real (2020-2025) | Jupyter + data pipeline | 0.5 sem | Quant analyst |
| Audit trail imutável | S3 WORM + checksum | 0.5 sem | Eng. senior |
| **TOTAL** | | **6 semanas** | **3 FTEs** |

### 2.3 Entregáveis

- Repositório Git com código de produção (testes + CI/CD)
- Dashboard web rodando em `https://d3.byd.internal`
- Backtesting real com dados 2020-2025 (substitui projeção)
- Re-run das 4 correções false positive em dados reais
- Relatório de acurácia final (target: confirmar ≥ 4/5 targets, ideal 5/5)

### 2.4 Custo estimado

| Item | Custo |
|---|---|
| 3 FTEs × 6 semanas × R$ 8k/sem = R$ 144k | R$ 144k |
| Infra AWS (3 ambientes) | R$ 6k |
| Licenças Plotly Dash ou similar | R$ 5k |
| **Total v2.2** | **R$ 155k** |

### 2.5 Risco

- **Médio**: feeds podem ter mudanças de API (BCB é estável, mas MDIC scraping é frágil)
- **Mitigação**: usar proxies + retry robusto

---

## 3. v2.3 — Pilot em Produção (8-12 semanas)

### 3.1 Objetivo

Deploy do D3 v2.2 em **ambiente shadow** (paralelo ao sistema manual do CSO). Validar com stakeholders reais em 1 trimestre.

### 3.2 Escopo

| Componente | Atividade | Tempo |
|---|---|---|
| **Stakeholder onboarding** | Workshop 1h com CSO + CFO + Risk Officer + 5 heads funcionais | 1 sem |
| **Shadow mode (3 meses)** | Sistema roda paralelo; CSO vê outputs mas só age manualmente | 12 sem |
| **Daily status report** | Email + Slack com composite score + 5 triggers prioritários | ongoing |
| **Weekly review** | CSO + CFO review 30min; valida outputs do sistema | ongoing |
| **Quarterly retrospective** | Ajusta thresholds baseado em feedback | 1 sem |
| **TOTAL** | | **12 semanas** |

### 3.3 Entregáveis

- 90 dias de shadow mode data (output do sistema vs decisão humana)
- Relatório de acurácia real (não projetado): "sistema X, humano Y, acordo Z%"
- Threshold tuning baseado em dados reais
- Go/no-go decision para v3.0 (production mode)

### 3.4 Custo estimado

| Item | Custo |
|---|---|
| Shadow mode operation (12 sem) | R$ 30k |
| Stakeholder time (workshops + reviews) | R$ 50k |
| Reporting + analytics | R$ 20k |
| **Total v2.3** | **R$ 100k** |

### 3.5 Risco

- **Alto**: stakeholders podem resistir a sistema que "substitui" seu julgamento
- **Mitigação**: posicionar como "second opinion", não substituição; CSO mantém autoridade

---

## 4. v3.0 — Production Mode (ongoing, ~3-6 meses)

### 4.1 Objetivo

D3 v2.3 com **autoridade decisória real** (não mais shadow). Sistema triggera ações automaticamente quando condições atingem thresholds pré-aprovados.

### 4.2 Escopo

| Componente | Atividade |
|---|---|
| **Approval gates automatizados** | Ações R$ 0-50k disparam automaticamente (com log) |
| **Threshold tuning** | Ajuste fino baseado em 90+ dias de shadow data |
| **Composite weights optimization** | Rodar backtesting como função objetivo; otimizar pesos |
| **5+ novas dimensões** (S12-S16) | Adicionar ESG rating, climate risk, supply chain mapping, etc. |
| **Stress test anual** | MC 100k paths (vs 10k atual) para stress test regulatório |
| **Mobile dashboard** | App para CSO on-the-go |
| **Integration com ERP** | SAP/Oracle hooks para execução automática de hedge + procurement |
| **Audit/compliance** | IFRS 7, Basel III reporting; compliance audit annual |

### 4.3 Cronograma (rolling)

- Mês 1-2: composite weights optimization + threshold tuning
- Mês 3-4: 5 novas dimensões S12-S16 (ESG rating, climate, supply map, geopolitical, cyber)
- Mês 5-6: integration ERP + mobile dashboard
- Ongoing: monthly reporting, quarterly stress test, annual audit

### 4.4 Custo estimado

| Item | Custo/mês | Custo/ano |
|---|---|---|
| 2 FTEs (eng + quant) | R$ 32k | R$ 384k |
| Infra produção (vs staging) | R$ 5k | R$ 60k |
| Feeds premium (Bloomberg, Fastmarkets) | R$ 10k | R$ 120k |
| Auditoria externa anual | — | R$ 80k |
| **Total v3.0** | **R$ 47k/mês** | **R$ 564k/ano** |

### 4.5 Risco

- **Médio**: thresholds otimizados podem overfit histórico (regime change)
- **Mitigação**: re-otimização trimestral; range de confidence intervals

---

## 5. v4.0 — Expansion (Q4 2027+)

### 5.1 Possibilidades

| Extensão | Descrição | Valor agregado |
|---|---|---|
| **Multi-empresa** | Framework para outras fábricas BYD (Tailândia, Hungria, Brasil) | Cross-pollination de insights |
| **Multi-programa** | Outros programas (ônibus, trucks, chassis) usando mesmo framework | R$ 100-200M efficiency |
| **AI augmentation** | ML em cima do rules engine (não substituir, aumentar) | +5-10% accuracy |
| **Predictive (não só reativa)** | Antecipar stress 1-3 meses antes (vs detectar 9 dias) | -50% time-to-action |
| **Self-calibrating** | Sistema ajusta weights automaticamente baseado em realized | -manual maintenance |
| **External benchmarking** | Comparar BYD Camaçari com VW/GM/Stellantis (anônimo) | Insights competitivos |

### 5.2 Estimativa de valor

Se v3.0 captura R$ 200M/ano em stress evitado, v4.0 pode dobrar para R$ 400-500M/ano (multi-empresa + predictive).

---

## 6. Resumo de investimento total

| Versão | Prazo | Custo | Output |
|---|---|---|---|
| v2.0.1 (atual) | 21/jul 2026 | R$ 0 (já investido) | Design + docs (anexo vaga) |
| v2.2 Implementation | 6 sem | R$ 155k | Código production-grade + dashboard |
| v2.3 Pilot | 12 sem | R$ 100k | Shadow mode + validação stakeholders |
| v3.0 Production | 6 meses | R$ 564k/ano | Operação contínua + 5 novas dims |
| v4.0 Expansion | 12+ meses | R$ 1M+/ano | Multi-empresa + AI augmentation |
| **Total v2.2 → v4.0 (18 meses)** | | **R$ 1.4M** | **Sistema operacional completo** |

---

## 7. ROI esperado

| Métrica | Valor |
|---|---|
| **Investimento total v2.2 → v3.0 (18 meses)** | R$ 1.0M |
| **Stress evitado/ano (backtesting projetado)** | R$ 200M+ |
| **ROI ano 1** | 200× |
| **Payback** | < 1 mês |

---

## 8. Quando NÃO vale a pena cada versão

| Versão | Red flag (não vale) |
|---|---|
| v2.2 | Se o usuário já tem sistema de decisão similar (evitar duplicação) |
| v2.3 | Se stakeholders não têm tempo para shadow mode (engagement é crítico) |
| v3.0 | Se composite scores < 80% em shadow mode (significa framework não calibrado) |
| v4.0 | Se empresa < R$ 5B VGV (custo fixo alto vs valor marginal) |

---

## 9. Resumo executivo (1 página)

<strong>Estado atual v2.0.1</strong>: design state-of-the-art (37 docs, 4 HTMLs, 49 figs, 5/5 backtesting). Adequado para anexo de vaga. NÃO é sistema deployed.

<strong>Roadmap contratado</strong>:
- <strong>v2.2</strong> (6 sem, R$ 155k): código Python + data feeds + dashboard. Transforma design em sistema.
- <strong>v2.3</strong> (12 sem, R$ 100k): shadow mode + validação stakeholders. Garante que sistema funciona na prática.
- <strong>v3.0</strong> (6 meses, R$ 564k/ano): production mode + 5 novas dims + integração ERP. Operação contínua.
- <strong>v4.0</strong> (12+ meses, R$ 1M+/ano): multi-empresa + AI. Scaling.

<strong>ROI</strong>: R$ 1M investido em 18 meses → R$ 200M+/ano em stress evitado. <strong>Payback < 1 mês</strong>.

<strong>Decisão</strong>: para anexo de vaga, v2.0.1 (atual) é suficiente. Para virar produto/serviço, próximos passos são v2.2 (código) e v2.3 (validação).

<strong>Risco principal</strong>: stakeholder engagement. v2.3 é o gargalo crítico — se CSO/CFO não adotam, sistema morre. Mitigação: posicionar como "second opinion" (não substituição).
