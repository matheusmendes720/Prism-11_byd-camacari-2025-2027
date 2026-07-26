---
title: Backlog Operacional — BYD Camaçari 2025-2027
ueid: ikigai:artifact:backlog-operacional:matheus-mendes:a1b2c3d4
entity_type: artifact
parent_ueid: ikigai:deliverable:d4:process-tracker
slug: backlog-operacional-byd-camacari
tags: [byd, job-search, operational, backlog, 2026]
custom:
  _purpose: Log central de todos os próximos passos, decisões e estado de progresso
  _last_updated: 2026-07-19
  _next_review: 2026-07-22
---

# Backlog Operacional — BYD Camaçari 2025-2027
*Última atualização: 19/jul/2026 | Próxima revisão: 22/jul/2026*

---

## ESTADO ATUAL DOS WORKSTREAMS

| Workstream | Status | Última ação | Próximo passo |
|------------|--------|-------------|---------------|
| **D1** — Scout vagas | 🔴 Desatualizado | 09/jul/2026 (vagas de então) | Refresh vagas ativas + novas |
| **D2** — Análise quant | 🟡 Parcial | 19/jul (Hamilton+Granger+EVE) | Refresh 1-pager + pull ANFAVEA |
| **D3** — Outreach | 🔴 Não iniciado | — | Gerar templates + enviar Wave 1 |
| **D4** — Tracker | 🟡 Seeded, 0 ações | 09/jul seed | Executar Wave 1 + log |

---

## 🟡 PRIORIDADE ALTA — Executar esta semana (até 22/jul)

### T-1: REFREScar D1 — Vagas ativas (feitas em 09/jul, podem ter expirado)
**Responsável:** Matheus
**Deadline:** 21/jul/2026
**Passos:**
- [ ] Re-executar scout no LinkedIn para as 6 companies do tracker
- [ ] Verificar se BYD Business Specialist (Camaçari) ainda está aberta
- [ ] Verificar se BYD Especialista de Dados (Campinas) ainda está aberta
- [ ] Adicionar vagas novas (EY AI, outras que apareceram)
- [ ] Atualizar `d1-greenfield-scout/byd-greenfield-map.md`

**Decisão tomada (19/jul):** Adicionar ≥3 novas companies ao scout:
- Catho (agregador BR) — filtrar "Python + dados + Salvador"
- GUPY / Geoface (ATS BR) — verificar vagas diretas
- Revelo (remote-first BR) —工程师 de dados remotos

---

### T-2: D3 — Gerar templates de outreach
**Responsável:** Matheus + Hermes
**Deadline:** 20/jul/2026
**Passos:**
- [ ] Gerar cover letter BYD (anchor: "você enfrentou o desafio de construir Polo Automotivo do zero?")
- [ ] Gerar cover letter remote/fallback
- [ ] Gerar T0 LinkedIn connection (≤300 char)
- [ ] Gerar T1 polite follow-up
- [ ] Gerar T2 follow-up (3-5d depois)
- [ ] Gerar T3 email frio (para Yueying Zhang)
- [ ] Salvar em `d3-outreach-assets/templates/`

**Hooks quantitativos disponíveis (D2):**
- PTAX vol 14.2% a.a. (GARCH) — "você opera num ambiente de vol elevado"
- HHI bateria 4.850 — "concentração extrema em CATL"
- Regime atual CALMA (Markov) — "oportunidade de hedge agora"
- BYD share resiliente (r=+0.55) — "você tem proteção estrutural que concorrentes não têm"

---

### T-3: D4 — Executar Wave 1 outreach
**Responsável:** Matheus
**Deadline:** 22/jul/2026
**Canary rule:** ≤5 conexões LinkedIn/dia, ≤2 emails/dia, ≥2 dias entre msg mesma pessoa

#### Wave 1 — Ações concretas

| # | Empresa | Vaga | Canal | Prioridade | Deadline | Status |
|---|---------|------|-------|------------|----------|--------|
| 1 | BYD | Business Specialist Camaçari | LinkedIn DM → Yueying Zhang | 🔴 CRÍTICA | 20/jul | PENDING |
| 2 | BYD | Especialista de Dados Campinas | Easy Apply | 🟡 ALTA | 20/jul | PENDING |
| 3 | BYD | After-sale Efficiency Dev | Easy Apply | 🟡 ALTA | 20/jul | PENDING |
| 4 | FullStack Labs | Data Engineer Remote | LinkedIn DM | 🟢 MÉDIA | 21/jul | PENDING |
| 5 | BairesDev | Analista de Dados Remote | Email careers@ | 🟢 MÉDIA | 21/jul | PENDING |
| 6 | Jobbol | Analista Dados Sênior | Easy Apply | 🟢 MÉDIA | 21/jul | PENDING |
| 7 | INDI Staffing | Talent Data Analyst | LinkedIn DM recruiter | 🟢 MÉDIA | 21/jul | PENDING |
| 8 | EY | Engenheiro IA Pleno | Easy Apply | 🟡 ALTA | 21/jul | PENDING |
| 9 | Alignerr | SW Engineer AI Training | Easy Apply | 🟢 BAIXA | 22/jul | PENDING |

---

## 🟠 PRIORIDADE MÉDIA — Executar até 31/jul

### M-1: Pull ANFAVEA mensal → Granger conclusivo
**Status: ✅ COMPLETO (19/jul/2026)**
**Resultado:** REJECT H0 | lag=4 | p=0.0009 *** | N=76 mensais | r=-0.219
**Ferramenta:** `statsmodels` + `bcdata.sgs.1` (PTAX) + `bcdata.sgs.7384` (ANFAVEA)
**Decisão:** Confirmado — PTAX Granger-causa ANFAVEA com lag de 4 meses. BYD produção local tem proteção estrutural mas defasagem de 1 trimestre. Hedge proativo é crítico.
**Output:** `outputs/granger-anfavea-ptax-monthly.md`

### M-2: Cron job — PTAX GARCH+Hamilton
**Job ID:** `16bf14d9f732` (criado 19/jul)
**Schedule:** A cada 30 dias
**Alerta:** Só se regime ≠ Calma OU P(turb) > 30%
**Ação não-bloqueante:** Atualizar `outputs/hamilton-markov-ptax.md` silenciosamente

### M-3: Full D2 refresh — regen 6 HTMLs + 1-pager
**Por quê:** Outputs D2 estão desatualizados desde 09/jul. Granger/OLS novos precisam ser incorporados.
**Script:** `byd-refresh-compute.py` + `byd_narrativa_script.py`
**Verificar:** saida em `d2-econometric-vulnerability/outputs/`
**Status:** 🔲 Pendente

### M-4: BYD Annual Report 2024 — extract CapEx NE + BOM
**Por quê:** Dados primários sobre Camaçari, employees, BOM split, supplier_local_rate
**Fonte:** PDF BYD Annual Report 2024 ou investors.byd.com
**Output:** Nota em `d2-econometric-vulnerability/outputs/byd-annual-report-2024.md`
**Status:** 🔲 Pendente

### M-5: Competitor matrix — Chery/Geely/VW 2026 update
**Por quê:** Cap4 competition landscape está com dados 2024-2025, pode estar desatualizado
**Fonte:** ANFAVEA, Marcopolo, web search
**Status:** 🔲 Pendente

### M-6: Supplier research — EVE Energy, CATL Brazil, LFP cell makers
**Por quê:** Risco de supply chain concentração (Markov showed 2023 supply shock regime)
**Status:** 🔲 Pendente

### M-7: Cron job — vagas D1 refresh (já criado, aguardando)
**Job ID:** `0dcfc3c07ad6` (criado 19/jul)
**Schedule:** A cada 3 dias

### M-3: EVE Energy / Sunwoda como supplier #2
**Achado:** Samsung SDI + LG ES não fazem LFP na América Latina
**Próximo:** Investigar EVE Energy (células LFP, manufacturing Hungary/China)
**Fonte:** Site corporativo + LinkedIn. Sem call de vendas ainda.
**Decisão:** Não elevar a "alternativo #2" até ter NCM/harmonized code确认

### M-4: Atualizar hiring managers
**Arquivo:** `d1-greenfield-scout/byd-hiring-managers.md`
**Ações:**
- [ ] Confirmar Yueying Zhang no LinkedIn (ainda em BYD Brasil?)
- [ ] Adicionar hiring manager de Campinas (Especialista de Dados)
- [ ] Adicionar recruiter de FullStack Labs (tech stack fit alto)

---

## 🟢 PRIORIDADE BAIXA — Executar até 15/ago

### L-1: LinkedIn Profile otimização
**Decisão tomada:** Antes de enviar Wave 2+, profile deve refletir:
- "Data-Driven Supply Chain Analyst | Python | BYD Camaçari context"
- Headline: "Supply Chain Data | Python · Polars · SQL | BYD Polo Camaçari study"
**Métricas para A/B test:** CTA rate do BYD DM

### L-2: Cron job — vagas D1 refresh
**Frequência:** A cada 3 dias (LinkedIn postings expiram em ~14d)
**Job:** Similar ao M-2, deliver='origin' se vaga nova de alta prioridade aparecer

### L-3: Validar CapEx BYD rede NE
**Fonte primária:** ANFAVEA + site BYD Investor Relations
**Decisão:** Não usar nos templates até validar (payoffs game theory são placeholders)

---

## DECISION LOG (19/jul/2026)

| # | Timestamp | Decisão | Rationale | Resultado |
|---|-----------|---------|-----------|-----------|
| D01 | 19/jul | Não adicionar Samsung SDI como supplier #2 | Sem manufacturing LATAM + NMC incompatível com blade battery | ✅ Confirmado |
| D02 | 19/jul | Não adicionar LG ES como supplier #2 | Same as above | ✅ Confirmado |
| D03 | 19/jul | Criar cron job GARCH+Hamilton | GARCH long-run 14.67% vs Hamilton vol hoje 6.26% — gap justifica monitoring | ✅ Agendado |
| D04 | 19/jul | Cron deliver='local' (sem notificação live) | Não há canal conectado para deliver; output salva em DB | ✅ Confirmado |
| D05 | 19/jul | Adicionar EVE Energy como supplier research próximo ciclo | LFP cell maker + Hungary plant = risco geopolítico menor | 🔲 Pendente |
| D06 | 19/jul | Granger = PTAX Granger-causes ANFAVEA lag=4 p=0.0009 *** | ANFAVEA N=76 mensal, BCB SGS 1+7384. Resultado robusto. BYD produção local proteção vs. câmbio. Framing cover letter: "hedge proativo com defasagem 1 trimestre" | ✅ granger-anfavea-ptax-monthly.md gerado |
| D07 | 19/jul | Não re-regenerar 6 HTMLs do notebook | Todos já existem ePopulated | ✅ Confirmado |

---

## MÉTRICAS ATUAIS (19/jul/2026)

| Métrica | Valor | Meta | Status |
|---------|-------|------|--------|
| Vagas rastreadas D1 | 14 | ≥20 | 🟡 |
| Vagas aplicadas (Wave 0) | 0 | — | 🔴 |
| Templates D3 gerados | 6 | 6 | 🟢 |
| Engajamentos BYD | 0 | ≥3 | 🔴 |
| Fit score médio (D1) | 75 | ≥70 | 🟢 |
| D2 composite score | 72/100 | — | 🟡 |
| Regime PTAX | Calma (P=97.8%) | — | 🟢 |
| Granger PTAX→ANFAVEA | lag=4, p=0.0009 | robusto | 🟢 |

---

## PRÓXIMOS CICLOS (a cada revisão semanal)

```
Semana 1 (22/jul):  Executar Wave 1 (9 ações)
Semana 2 (29/jul):  Review responses + Wave 2
Semana 3 (05/ago):  Refresh D1 + pull ANFAVEA Granger
Semana 4 (12/ago):  Full D4 update + D3 templates v2
```
