---
template: dpr
version: 1
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-dpr-byd:00000003:00000000
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
entity_type: dpr_engagement
slug: byd-brasil-2026-07-dpr
tags: [byd, camacari, ev-manufacturing, dpr, d5, dexter]
title: "BYD do Brasil Ltda. — DPR (Polo Automotivo Camaçari 2025-2027)"
date: 2026-07-14
status: scaffold-dry-run
mode: DRY-RUN
target_company: BYD do Brasil Ltda.
ticker: 1211.HK / 002594.SZ / BYDDY (US OTC ADR)
engagement: job-application intelligence arsenal — D5 (external research)
author: Matheus Mendes
purpose: per-company Diagnosis / Prognosis / Recommendations packet for BYD Brasil Polo Automotivo Camaçari BA, 2025-2027 buildout
---

# DPR — Diagnosis · Prognosis · Recommendations
**Target company: BYD do Brasil Ltda. (Polo Automotivo Camaçari, BA)  Ticker / ID: 1211.HK (parent) / CNPJ lookup pending  Date: 2026-07-14**
**Engagement: Matheus Mendes applying to BYD Brasil — Business Specialist Camaçari (LinkedIn 4425953683)  Author: Matheus Mendes**

> **Status (2026-07-14):** Scaffold criado. Conteúdo das seções §1-§6 marcado TBD —
> preenchimento depende da execução LIVE do dexter `osint-reconnaissance` skill
> (requer OPENAI_API_KEY + EXASEARCH/TAVILY/PERPLEXITY). Cross-link D5 ↔ D1-D4
> em `cross-link-map.md`.

---

## 0 · Engagement Context (fill first, before any analysis)

| Field | Value |
|---|---|
| Target company | **BYD do Brasil Ltda.** (subsidiária da BYD Company Limited, Shenzhen) |
| Ticker / LEI / CNPJ / company number | Parent: **1211.HK** (HKEX) / **002594.SZ** (SZSE) / **BYDDY** (US OTC ADR) · Subsidiary CNPJ: TBD (lookup via Receita Federal / RNPC) |
| Sector / sub-sector | EV manufacturing (BEV + PHEV + batteries) · greenfield plant buildout |
| Headquarters | Shenzhen, Guangdong, China · Brasil operations: São Paulo SP (HQ) + Camaçari BA (plant 2025-2027) |
| Engagement reason | Job-application: Business Specialist Camaçari posting (LinkedIn 4425953683) — anchor Yueying Zhang (HR Director BYD Brasil, 8/10 score) |
| Compass question | "What is BYD's actual hiring cadence in Camaçari BA 2025-2027, and where does a Salvador-based candidate with [stack-fit from D1] fit into the ramp-up?" |
| Known constraints | Public-only sources; BYD Brasil is private subsidiary (no 6-K filings); Chinese parent disclosures only via HKEX 1211.HK + SZSE 002594.SZ |
| Internal stakes | (a) Offer from BYD Brasil — anchor for entire Salvador tech-job campaign, (b) D5 external-research arsenal demonstration (cross-link to D1-D4), (c) portfolio piece — instant-insider evidence |
| Out of scope | BYD's internal HR/payroll systems, confidential Camaçari plant blueprints, social engineering of BYD employees, scraping LinkedIn/Glassdoor (hiQ v. LinkedIn precedent) |

**Pre-known context (from D1 greenfield-scout, sources tier-A):**
- 24 BYD Brasil vagas in scope (Oct 2025 - Jul 2026), 8 still open
- Stack-fit mean = 80% across open roles (from `byd-stack-fit-matrix.md`)
- Top 3 hiring hubs: São Paulo SP (HQ) > Camaçari BA (plant) > Campinas SP (R&D)
- Anchor: Yueying Zhang (HR Director BYD Brasil), score 8/10 — decisor for hiring-manager outreach
- Composite vulnerability score: 59/100 (D2 econometric notebook)

---

## 1 · DIAGNOSIS — what BYD do Brasil actually is

> **STATUS:** ⏳ TBD — populate via dexter `osint-reconnaissance` skill (LIVE mode).
> Scaffold structure below; cells empty.

### 1.1 Organizational

| Dimension | Fact / data point | Source |
|---|---|---|
| Legal entity name + jurisdiction | TBD — Receita Federal CNPJ lookup (BYD DO BRASIL LTDA. expected) | TBD |
| Ultimate parent / group | TBD — BYD Company Limited (HKEX 1211.HK) | TBD |
| Ownership: founders / strategic / PE / VC / listed | TBD — parent listed; founder Wang Chuanfu (~17%) | TBD |
| Capital structure (debt, equity, leases; maturity wall) | TBD — parent 10-K via HKEX | TBD |
| Recent capital raises, refinancing, dividend policy | TBD — parent filings | TBD |
| Headcount, geography of workforce | TBD — Brasil: ~2,500 employees (industry est. 2026); parent: ~900k (2025) | TBD |
| Key-people map: CEO, CFO, CTO, head of [X — your domain] | TBD — Brasil: Tyler Li (President BYD Brasil); HR: Yueying Zhang (anchor D1) | TBD |
| Compensation signals (proxy, total comp mix, equity overhang) | TBD — Glassdoor Brasil BYD; LinkedIn salary UI | TBD |
| Recent senior departures / arrivals (last 12mo) | TBD — LinkedIn UI only | TBD |
| Board composition + notable independent directors | TBD — parent board | TBD |
| Subsidiaries and JVs (full legal entity tree) | TBD — RNPC lookup; expected: BYD ENERGY DO BRASIL, BYD AUTO DO BRASIL | TBD |
| Cap-table red flags (dual class, prefs, convertibles) | TBD | TBD |
| ESG / controversies / litigation open issues | TBD — recall history (parent), labor disputes in Camaçari | TBD |

**Open questions / things you couldn't confirm (Diagnosis only):**
- Exact CNPJ of Camaçari plant operating entity vs SP HQ
- Whether Brasil subsidiary is fully consolidated in parent 10-K
- Senior departures/arrivals at Camaçari site specifically
- Real headcount ramp trajectory 2025-2027

### 1.2 Market

| Dimension | Fact / data point | Source |
|---|---|---|
| Market size (TAM / SAM / SOM) + the source's definition | TBD — Brasil EV market 2026 ~BRL 80bi (ANFAVEA) | TBD |
| Segment share vs top 5 named competitors | TBD — BYD Brasil: #1 BEV in Brasil 2025 (per ANFAVEA monthly) | TBD |
| Pricing power (can they raise prices? by how much last 3 years?) | TBD — Dolphin/Seal pricing 2024-2026 trajectory | TBD |
| Customer concentration (top 10, % of revenue) | TBD — fleet sales (Uber/99) likely concentrated | TBD |
| Switching costs (technical, contractual, behavioral) | TBD — charging-network lock-in (BYD network partners) | TBD |
| Distribution moat (channels, sales motion, GTM motion) | TBD — 100+ dealers BR; own retail rollout | TBD |
| Brand / NPS proxies (review-mining, Glassdoor, app stores) | TBD | TBD |
| Regulation affecting the segment + named regulators | TBD — MME, ANFAVEA, BNDES, Rota 2030, import tariffs (restored 2024) | TBD |
| Macro sensitivity (cycles, FX, commodity exposure) | TBD — BRL/USD critical for imported components | TBD |
| Long-term industry growth rate (3yr, 10yr) | TBD — Brasil EV CAGR ~30% (Goldman est.) | TBD |
| Disruption signals: new entrants, tech shifts, behavioral change | TBD — GAC, Chery, MG entering Brasil | TBD |

**Bargaining position vs suppliers / customers / labor**:
- Suppliers: **TBD** — CATL (batteries), TSMC (chips), Samsung SDI, Albemarle (lithium) — parent-listed
- Customers: **TBD** — fleet + retail consumer; price-sensitive
- Labor / talent: **TBD** — automotive engineer shortage in BA; Union pressure

### 1.3 Operational

| Dimension | Fact / data point | Source |
|---|---|---|
| Value chain map (sourcing → production → distribution → after-sale) | TBD — see `byd-greenfield-map.md` D1 for partial; expand with supplier tier | TBD |
| Key partners and dependency graph (single-source risks) | TBD — CATL battery single-source for LFP; Albemarle lithium | TBD |
| Manufacturing / production footprint | TBD — Camaçari BA plant (former Ford site, 4.6M m²); capacity 150k vehicles/yr (target 2026) | TBD |
| Logistics + lead-time benchmarks | TBD — Port of Salvador (Aratu) ~15km from plant | TBD |
| COGS structure: variable vs fixed; raw materials mix | TBD — battery ~35% of BEV COGS | TBD |
| Inventory policy / days inventory outstanding | TBD | TBD |
| Working-capital cycle (DSO, DPO, DIO) | TBD — parent disclosures only | TBD |
| Capex cycle and capital intensity | TBD — parent committed ~USD 1bi to Camaçari | TBD |
| R&D intensity, patent landscape, IP defensibility | TBD — parent R&D ~7% revenue; #1 EV patents globally | TBD |
| Tech stack (publicly disclosed: cloud, ERP, CRM) | TBD | TBD |
| Cybersecurity posture (breach history, cert disclosures) | TBD — crt.sh scan time-machine-byd/ | TBD |
| Real-estate / facility exposure | TBD — Ford Camaçari lease terms | TBD |
| Energy / commodity sensitivity | TBD — electricity grid BA; lithium carbonate price | TBD |

**Hidden-asset / one-time / non-recurring items:**
- **TBD** — plant acquisition from Ford (book value vs market value gap)
- **TBD** — BNDES financing (subsidized, off-market rate)

### 1.4 Primary sources catalog (Diagnosis)

> Mandatory: at least one primary source per row above. Public-only by default; mark `*` if a confidential channel (and why it's allowed).

| Source | What it gave you | URL / file / page |
|---|---|---|
| HKEX 1211.HK annual report + interim | parent financials, segment data | TBD |
| SZSE 002594.SZ filings (Chinese-language) | China-side operations | TBD |
| Receita Federal / RNPC | CNPJ, razão social, QSA | TBD |
| ANFAVEA monthly BEV/PHEV report | Brasil registration data | TBD |
| BNDES public contracts database | financing terms | TBD |
| Diário Oficial da União (DOU) | plant installation license, fiscal incentives | TBD |
| BNDES/MME press releases | Rota 2030 credits | TBD |
| wayback CDX (time-machine-byd/) | site history, careers cadence | TBD |
| crt.sh | subdomain / cert history | TBD |
| Glassdoor / LinkedIn UI (no scraping) | org signal, salary bands | TBD |
| Portal da Transparência (Bahia) | state tax incentives | TBD |

---

## 2 · PROGNOSIS — where it's going under three scenarios

> **STATUS:** ⏳ TBD — populate via dexter `osint-reconnaissance` (LIVE) + cross-link
> to D2 econometric notebook scenarios. Composite vulnerability = 59/100 from D2.

### 2.1 Bull (probability: TBD%)

| Driver | Your number / state | Source / derivation |
|---|---|---|
| Revenue trajectory (FY+1, FY+2, FY+3) | TBD | TBD |
| Margin trajectory (gross, operating, FCF) | TBD | TBD |
| Capital intensity + reinvestment | TBD | TBD |
| Exit multiple / terminal value logic | TBD | TBD |
| Stock / valuation outcome 12mo | TBD | TBD |

**Narrative (3–5 sentences):**
TBD

**Trigger evidence you'd watch for in next 90 days:**
- Camaçari plant line 2 groundbreaking (or silence)
- Q3 2026 ANFAVEA ranking — BYD >50k units?
- New BNDES tranche announcement
- Hiring cadence at LinkedIn 4425953683 (refreshing/reposting?)

### 2.2 Base (probability: TBD%)

*(mirror the rows of Bull; same structure; the consensus world)*

**Narrative:** TBD

**Tripwires — observable events that flip the scenario:**
- BRL/USD breaks 6.0 (currency shock)
- BNDES Rota 2030 credits pulled
- New BYD Brasil subsidiary formed (capex restructure)

### 2.3 Bear (probability: TBD%)

*(steel-man. If your bear paragraph reads weaker than the bull, rewrite it.)*

**Narrative:** TBD

**Tripwires:**
- Recall at scale (battery safety)
- Labor action at Camaçari (CUT/Sindicato)
- BYD global restructuring news (parent layoffs)
- Brasil EV import tariff reinstated at higher rate

**Asymmetry check:** bull upside / bear downside = TBD : 1

### 2.4 Cross-scenario synthesis

| KPI (12mo) | Bear | Base | Bull |
|---|---|---|---|
| Revenue growth | TBD | TBD | TBD |
| EBITDA margin | TBD | TBD | TBD |
| FCF margin | TBD | TBD | TBD |
| Net debt / EBITDA | TBD | TBD | TBD |
| EV / EBITDA | TBD | TBD | TBD |
| Implied equity value | TBD | TBD | TBD |

**The single thing you'd change about your estimates if new information came out tomorrow:** TBD

---

## 3 · RECOMMENDATIONS — what to *do* (interview + post-interview)

### 3.1 Interview narrative — the 3-line story

> **STATUS:** ⏳ Partial — populated with direction from D3 cover-letter templates (T0 anchor).

1. **What BYD Brasil does better than anyone in Camaçari** — *evidence*: vertical integration (battery + vehicle in one campus); CATL co-located at Salvador port 15km away
2. **What's structurally fragile** — *evidence*: single-source LFP battery (CATL); BRL/USD exposure on imported components; labor concentration in BA
3. **What I would do about #2 in my first 90 days** — *evidence / playbook*: stand up multi-source qualification (Samsung SDI / LG ES as alternates); hedge FX via BNDES-financed local content ramp; preempt labor risk with union pre-engagement

### 3.2 Talking points — the questions *you* should ask

| # | Question to ask | Why this question earns you credibility |
|---|---|---|
| 1 | TBD | TBD |
| 2 | TBD | TBD |
| 3 | TBD | TBD |
| 4 | TBD | TBD |
| 5 | TBD | TBD |

### 3.3 Talking points — the questions *they* will ask you

| # | Likely question | Your answer (grounded in section 1 or 2) |
|---|---|---|
| 1 | TBD | TBD |
| 2 | TBD | TBD |
| 3 | TBD | TBD |

### 3.4 Red-team yourself

Before walking in, pre-answer these:
- **What's the strongest bear case against my own thesis?** TBD
- **What would I tell a friend not to take this job?** TBD
- **Where could I be wrong about my own prior?** TBD
- **What does my interviewer actually care about that I have not yet shown them?** TBD

### 3.5 Post-interview actions

- **30-day follow-up**: TBD
- **To-do for the in-house team's roadmap**: TBD
- **One portable artifact to publish (essay, dashboard, dataset)**: `byd-econometric-vulnerability-analysis.md` (D2 notebook), Professional Equity Report BYDDY (D5)

---

## 4 · One-page summary (back-of-envelope card)

```
[BYD do Brasil Ltda.] · [EV Manufacturing] · [1211.HK parent] · Snapshot 2026-07-14

WHAT IT IS      : BYD's greenfield EV plant buildout in Camaçari BA, 2025-2027
WHO RUNS IT     : Tyler Li (President BYD Brasil); Yueying Zhang (HR anchor); parent CEO Wang Chuanfu
WHO OWNS IT     : parent 1211.HK listed; founder Wang Chuanfu ~17%; free float high
WHAT MAKES $$$  : BEV passenger vehicles (Dolphin/Seal/Yuan Plus) + LFP batteries
WHAT FRAGILE   : BRL/USD on imported components; CATL single-source for LFP; BA labor concentration
TRADING STATE   : parent rev growth ~18% (2025E); Brasil subsidiary pre-revenue
OUR VIEW       : Bear (TBD%) / Base (TBD%) / Bull (TBD%); composite vuln 59/100
INTERVIEW LEV  : "I'll stand up multi-source battery qualification and FX hedging in 90 days"
```

---

## 5 · Sources — full ledger

> **STATUS:** ⏳ TBD — sources-ledger pending dexter LIVE fill.

| # | Citation (Tier) | Used in section | Linked to claim |
|---|---|---|---|
| 1 | TBD | | |
| 2 | TBD | | |
| 3 | TBD | | |

---

## 6 · Engagement log (for re-use across companies)

- **Open reuse**: EV-manufacturing market structure; ANFAVEA monthly report as a refreshable feed
- **Skipped sections and why**: Internal HR/payroll (out of scope — public-only)
- **Anti-patterns observed**: TBD
- **Tools / sources that paid off**: TBD after LIVE run

---

## Appendix · Cross-link D5

- D1 (`byd-greenfield-map.md`): vagas + hiring hubs
- D2 (`byd-econometric-vulnerability-analysis.md`): composite vulnerability 59/100
- D3 (`byd-cold-outreach-assets.md`): cover letter templates
- D4 (`byd-process-tracker.md`): outreach rows T0-Tier-1
- D5 → `cross-link-map.md`: full mapping table

> When in doubt, fetch the primary source. Secondary sources (analysts, news, aggregators) reinterpret; primaries declare.