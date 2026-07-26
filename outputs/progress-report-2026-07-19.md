# BYD Camaçari — Relatório de Progresso
**Data:** 19/jul/2026  |  **Sessão:** Progresso preditivo + analytics
**Responsável:** Matheus (execução) + Hermes (automação)

---

## Estado Real do Case Study

| Dimensão | Planejado | Executado | Gap |
|----------|-----------|-----------|-----|
| Outreach enviado | 18 | **0** | 🟡 18 pendentes |
| Vagas aplicadas | 6 | **0** | 🔴 6 pendentes |
| Decisões logadas | 6 | 6 | 🟢 |
| Templates D3 | 6 | 6 | 🟢 |
| Cron jobs ativos | 2 | 2 | 🟢 |
| Métricas D2 atualizadas | — | 2 novas | 🟢 |

**Bottleneck atual: execução manual (Matheus)** — automação está pronta, ação humana pendente.

---

## 🟢 O Que Foi Feito Esta Sessão (19/jul)

### D2 — Analytics Preditivos (2 novos outputs)

**1. Granger PTAX → ANFAVEA** (`outputs/granger-anfavea-ptax-monthly.md`)
- N=76 mensais (01/2020→12/2025) via BCB SGS live
- **REJECT H0** com p=0.0009 (***) no lag=4
- Interpretação: câmbio afeta produção com 1 trimestre de defasagem
- BYD produção local = proteção estrutural, mas janela de hedge é 3-4 meses
- Dados: PTAX=bcdata.sgs.1, ANFAVEA=bcdata.sgs.7384

**2. OLS Pass-Through** (`outputs/ols-pass-through-bom-ipca-ptax.md`)
- ΔANFAVEA = β0 + β1·ΔPTAX + β2·ΔIPCA + ε
- **β1(ΔPTAX) = -0.86 (t=-2.02, p<0.05)** — significativo
- R² = 7.6% — câmbio explica ~8% da variância de produção
- BYD (42% imported BOM): 10% depreciação PTAX → -4.2pp no BOM
- Dado: BCB SGS 13522 (IPCA mensal)

### Consolidação D2 — Métricas Atuais

| Métrica | Valor | Status |
|---------|-------|--------|
| Composite vulnerability | 72/100 | 🟡 |
| Regime PTAX | Calma (P=97.8%) | 🟢 |
| GARCH half-life | 73.3 dias | 🟢 |
| Granger PTAX→ANFAVEA | lag=4, p=0.0009 *** | 🟢 |
| OLS β_PTAX | -0.86 (t=-2.02**) | 🟢 |
| BYD BOM impact/10% dep. | -4.2pp | 🟡 |
| PTAX atual | R$ 5,1176 | — |

---

## 🔴 Prioridade Imediata — Matheus (ação manual)

### Wave 1 — Fazer Até 22/jul

| # | Ação | Canal | Tempo |
|---|------|-------|-------|
| 1 | Enviar DM para **Yueying Zhang** (BYD Hiring) | LinkedIn | 5 min |
| 2 | Easy Apply: **BYD Especialista Dados Campinas** | LinkedIn Easy Apply | 10 min |
| 3 | Easy Apply: **BYD After-sale Efficiency Dev** | LinkedIn Easy Apply | 10 min |
| 4 | LinkedIn DM: **FullStack Labs** recruiter | LinkedIn | 5 min |
| 5 | Email: **BairesDev** careers@ | Email | 5 min |
| 6 | Easy Apply: **Jobbol** Analista Dados Sênior | LinkedIn Easy Apply | 10 min |

**Script助手:** `d4-process-tracker/byd-tracker-wave1-action.py` — cria as entradas no tracker automaticamente após enviar cada mensagem.

### Cron Jobs Ativos

| Job | Schedule | Próxima |
|-----|----------|---------|
| BYD PTAX GARCH+Hamilton | a cada 30d | 18/ago |
| D1 vaga refresh | a cada 3d | 22/jul |

---

## 🟠 Próximos Passos Analíticos (Hermes pode executar)

| ID | Tarefa | Ferramenta | Status |
|----|--------|------------|--------|
| M-3 | Full refresh D2: regen todos os 6 HTMLs + 1-pager | `byd-refresh-compute.py` | 🔲 |
| M-4 | BYD annual report 2024 — extract CapEx NE, employment, BOM | PDF extractor | 🔲 |
| M-5 | Competitor matrix: Chery, Geely, Volkswagen — update 2026 | web research | 🔲 |
| M-6 | Supplier research: EVE Energy, CATL Brazil, LFK | web search | 🔲 |
| L-2 | Cron job: vagas D1 refresh (já criado, aguardando) | cron | ⏳ |
| L-3 | Validar CapEx BYD NE (Camaçari + outras plantas) | BCB + ANFAVEA | 🔲 |

---

## 📊 D4 Tracker — Estado

```
outreach planejados: 18
  └── enviados: 0  ← BOTTLENECK
  └── BYD: 4 (3 duplicados skipados, 1 Yueying DM pendente)
  └── FullStack Labs: 2
  └── BairesDev: 3
  └── EY: 1
  └── Alignerr: 3
  └── INDI Staffing: 2
  └── Jobbol: 3

process rows: 12 (6 companies × vaga)
  └── aplicados: 0

decision_log: 6 entradas
```

---

## 📁 Arquivos Novos (19/jul)

- `d2-econometric-vulnerability/outputs/granger-anfavea-ptax-monthly.md`
- `d2-econometric-vulnerability/outputs/ols-pass-through-bom-ipca-ptax.md`
- `d4-process-tracker/byd-tracker-wave1-action.py`
- `backlog-operacional.md` (atualizado)

---
ueid: ikigai:artifact:progress-report:20260719
entity_type: artifact
tags: [progress, report, byd, case-study, 2026]
custom:
  _purpose: Consolidar progresso da sessão e explicitar gap execução
