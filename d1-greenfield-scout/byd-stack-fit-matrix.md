---
ueid: ikigai:artifact:byd-stack-fit-matrix:00000000:00000000
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-market-research:00000000:00000000
slug: byd-stack-fit-matrix
title: "BYD stack-fit matrix — vaga × stack × meu match (W1)"
artifact_type: data
is_public: false
created_at: 2026-07-09T00:00:00Z
updated_at: 2026-07-12T00:00:00Z
source: user
tags: [persona/matheus, deliverable/d1-output, empresa/byd, mode/stack-fit-analysis]
custom:
  _purpose: "Matriz qualitativa vaga × stack_required × meu_match; gate: ≥ 1 vaga com fit ≥ 60%"
  _my_stack_profile:
    core: [python, polars, pandas, sql, statsmodels, scikit-learn]
    intermediate: [plotly, jupyter, duckdb, numpy, scipy]
    learning: [spark, dbt, airflow, kubernetes, cloud (aws/gcp)]
    soft: [financial markets, econometria, vulnerability analysis]
  _vaga_columns_reference:
    - "Linguagem principal (Python/R/SQL/Excel/etc.)"
    - "Stack data (Polars/Pandas/Spark/dbt/etc.)"
    - "Domínio (finanças/operacional/marketing/etc.)"
    - "Seniority (junior/pleno/senior)"
    - "Soft skills (comunicação, ownership, etc.)"
---

# BYD Stack-Fit Matrix — vaga × stack × meu match

> **Janela-alvo:** cross-reference entre greenfield-map (≥ 3 vagas) +
> meu stack profile.
> **Gate criteria:** ≥ 1 vaga com fit ≥ 60% (matheus consegue entregar
> valor em ≤ 1 mês ramp-up).

## Matriz qualitativa (portada de `byd-greenfield-map.md` 2026-07-09 Wd 1 deep refresh)

> **Gate criteria ATINGIDO:** 17 vagas com fit ≥ 65 (de 23 mapeadas + 1 Business Specialist = 24 totais; 7 drops por desalinhamento vertical). **Hipótese central validada** — mercado BR Salvador/remote confirma o pipeline ≥ 14 vagas data-fit, BYD anchor + Salvador diversification.

### Priority 1 — Top 5 (alta fit + BYD anchor OR Salvador top-fit)

| # | Vaga (link greenfield-map) | Empresa | Linguagem | Stack data | Domínio | Seniority | Fit (0-100) | Ramp-up estimate | Notes |
|---|---------------------------|---------|-----------|------------|---------|-----------|-------------|------------------|-------|
| 1 ⭐ | [Business Specialist (BYD Brasil)](https://br.linkedin.com/jobs/view/business-specialist-at-byd-brasil-4425953683) | BYD Brasil | Excel + Python (nice) | data-driven, cost/variance, invoice audit | Supply chain / financeiro | Pleno-sênior | 75 | 2-4 wd | **ANCHOR #1** — Camaçari, BA. Hiring manager Yueying Zhang (8/10). Função Supply Chain; quant-adjacent (não pede Python/SQL diretamente, mas meu stack core cobre o exigido). |
| 2 ⭐ | Data Engineer - Remote | FullStack Labs | Python | data eng, pipeline | data puro | Pleno-sênior | 90 | ≤ 1 wd | **TOP-1 TECH FIT** — Salvador-BA based remote-friendly; posted 6h. Stack match 100% (Python + pipeline). |
| 3 ⭐ | Especialista de Dados | BYD Brasil | SQL/BI | data specialist | data | Especialista | 85 | 1-2 wd | BYD pure data role; Campinas SP; remote negociável. Domínio data puro + soft: stakeholder mgmt. |
| 4 ⭐ | Analista de Dados Remoto | BairesDev | Python | data analysis | data | Pleno | 85 | 1-2 wd | BairesDev established remote; Salvador location. Pure Python/data. |
| 5 ⭐ | Engenheiro de Dados Pleno | Jobbol | Python | data eng | data eng | Pleno | 85 | 1-2 wd | Job portal agregador; Salvador location. Python + data eng. |

### Priority 2 — Tier 1 Salvador/remote diversification (8 vagas)

| # | Vaga | Empresa | Linguagem | Stack data | Domínio | Seniority | Fit (0-100) | Ramp-up estimate | Notes |
|---|------|---------|-----------|------------|---------|-----------|-------------|------------------|-------|
| 6 | Senior Data Scientist | AgileEngine | Python | data science, remote | DS | Sênior | 85 | 1-2 wd | remote-friendly senior role; alinhamento forte com meu core (Python + statsmodels + sklearn). |
| 7 | Talent Data Analyst Remote | INDI Staffing | Python preferred | data analysis | RH/staffing | Pleno-Temp | 80 | 1-2 wd | staffing agency; fresh (1d posted); ramp-up em domínio HR é curto. |
| 8 | Analista de Dados | Jobbol | Python | data analysis | data | Pleno | 80 | 1-2 wd | fresh portal posting; pure data. |
| 9 | Engenheiro(a) IA Pleno 1 | EY | Python | AI/ML | consultoria + AI | Pleno | 80 | 1-2 wd | EY brand + AI work; Salvador. Domínio consultoria = soft skill ownership. |
| 10 | Engenheiro(a) IA Pleno | EY | Python | AI + deep learning | consultoria + AI | Pleno | 80 | 1-2 wd | EY 2nd AI role; pode ser mesmo processo — aplicar 1 vez. |
| 11 | Engenheiro Software (AI training) | Alignerr | Python | AI/ML training | AI training | Pleno | 80 | 1-2 wd | fresh (17h posted); evaluate model outputs + data quality. Fit stack core + learning curve rasa. |
| 12 | Analista Dados ERP/CRM Remoto | BairesDev | Python | ERP/CRM data | data + ERP | Pleno | 75 | 2-4 wd | BairesDev niche; ramp-up em ERP/CRM (~2 wd). Salvador remote. |
| 13 | After-sale Efficiency Developer | BYD Brasil | Python (preferred) | data-driven systems | pós-venda | Pleno | 75 | 1-2 wd | BYD data systems; Campinas SP. Domínio pós-venda ≠ meu core mas stack match forte. |

### Stretch (fit 65-75, vertical tangencial) + Drops

| # | Vaga | Empresa | Fit (0-100) | Vertical | Notes |
|---|------|---------|-------------|----------|-------|
| 14 | Analista Financeiro AP Pleno | BYD Brasil | 70 | financeiro | secondary; Campinas SP, remote incerto. Stack Excel + SAP — ramp-up em SAP > 4 wd. |
| 15 | Analista de Custos Pleno | BYD Brasil | 70 | financeiro | fresh BYD; menos data-fit. Domínio custos/finance ≠ meu core (soft: financial markets ok). |
| 16 | Desenvolvedor Qlik Sense | Humgroup | 70 | BI tooling | ramp-up em Qlik (~2 wd). Stack intermediário: BI tooling novo. |
| 17 | Supervisor(a) TI Aplicações Digitais | BYD Brasil | 65 | TI gestão | BA 2º BYD (anchor local Camaçari); tech supervisor (não data). Stack SAP + digital apps ≠ meu core. |
| 18 | Analista Controladoria SR | BYD Brasil | 65 | controladoria | drop candidato — não data. |
| 19 | Analista Fiscal Pleno | BYD Brasil | 60 | fiscal | drop — não data. |
| 20 | Analista Controles Internos PL | BYD Brasil | 60 | controls | drop — não data. |
| 21 | Supervisor Projetos SAP | BYD Brasil | 60 | TI/SAP | drop — não data. |
| 22 | Analista Infraestrutura | BYD Brasil | 55 | TI | drop — não data. |
| 23 | Assistente Contas a Pagar | Grupo Cacel (VW/Chevrolet/BYD dealer) | 30 | admin | drop — admin, não analytics. Senioridade assistente abaixo do meu alvo. |
| 24 | Analista de Compras Junior - Marketing | BYD Brasil | 40 | marketing/procurement | drop — procurement, não analytics. Junior abaixo do meu alvo. |

## Fit scoring (rubrica composta)

| Componente | Peso | Score 0-100 | Reasoning |
|------------|------|-------------|-----------|
| Linguagem match | 25% | ___ | ___ |
| Stack data match | 30% | ___ | ___ |
| Domínio match | 20% | ___ | ___ |
| Seniority match | 15% | ___ | ___ |
| Soft skills match | 10% | ___ | ___ |
| **TOTAL** | **100%** | **___** | weighted sum |

## Ramp-up estimate (semanas até produtividade 80%)

- **≤ 1 wd**: fit ≥ 80% (uso direto do meu stack)
- **1-2 wd**: fit 60-80% (precisa aprender 1 lib específica)
- **2-4 wd**: fit 40-60% (precisa aprender 1 framework novo)
- **> 4 wd**: fit < 40% (escopo novo; re-evaluate)

## Decision gate (synthesis com greenfield-map + hiring-managers)

> **Status 2026-07-12:** gate criteria **ATINGIDOS**. ≥ 3 vagas BR + fit médio ≥ 60% (média ponderada das top 13 = **80%**); ≥ 1 manager high-score (Yueying Zhang **8/10**). **D1 → D3 cold outreach ENABLED**.

| Pri | Vaga | Stack fit | Manager score | Outreach priority | D3 batch | Status (2026-07-12) |
|-----|------|-----------|---------------|-------------------|----------|---------------------|
| **1** | Business Specialist BYD Camacari | 75 | **8** (Yueying Zhang) | **1** | T0 anchor — HOJE 2026-07-09 | READY — email + LinkedIn template A prontos |
| **1** | Data Engineer Remote (FullStack Labs) | 90 | TBD (recruiter) | **1** | T1 — HOJE | READY — cover A1/A2/A3 em `byd-cover-letters-final.md` |
| **1** | Especialista de Dados BYD | 85 | TBD (BYD TA) | **1** | T1 — HOJE | READY — covered in Salvador Tier 1 outreach |
| **2** | Analista de Dados Remoto (BairesDev) | 85 | TBD (TA LATAM) | **2** | T1 portal + email | READY — cover B1/B2 |
| **2** | Engenheiro de Dados Pleno (Jobbol) | 85 | n/a (platform) | **2** | C1 platform apply | READY |
| **2** | Senior Data Scientist (AgileEngine) | 85 | TBD (LATAM) | **2** | T1 portal | READY |
| **2** | Talent Data Analyst Remote (INDI) | 80 | TBD (recruiter) | **2** | D1 + email | READY — cover D1/D2 |
| **2** | Engenheiro Software AI training (Alignerr) | 80 | TBD (recruiter) | **2** | E1 + email | READY — cover E1/E2 |
| **2** | Analista de Dados (Jobbol) | 80 | n/a | **2** | platform apply | READY |
| **2** | Engenheiro(a) IA Pleno 1 (EY) | 80 | TBD (Salvador tech mgr) | **2** | portal + LinkedIn | READY |
| **3** | Engenheiro(a) IA Pleno (EY) | 80 | TBD | **3** | roll-up com #9 (mesmo processo) | low priority |
| **3** | After-sale Efficiency Developer (BYD) | 75 | TBD | **3** | follow-up rolling | low priority |
| **3** | Analista Dados ERP/CRM Remoto (BairesDev) | 75 | TBD | **3** | follow-up rolling | low priority |
| **3** | Analista Financeiro AP Pleno (BYD) | 70 | TBD | **3** | follow-up rolling | secondary; remote incerto |
| **3** | Analista de Custos Pleno (BYD) | 70 | TBD | **3** | follow-up rolling | fresh BYD; menos data-fit |
| **3** | Desenvolvedor Qlik Sense (Humgroup) | 70 | TBD | **3** | follow-up rolling | BI specialist; ramp-up Qlik |
| **3** | Supervisor(a) TI Aplicações Digitais (BYD Camacari) | 65 | TBD | **3** | drop candidate | tech supervisor; não data |
| drop | Controladoria / Fiscal / SAP / Infra | < 65 | n/a | **drop** | drop | desalinhamento vertical |
| drop | Assistente AP / Compras Jr | < 45 | n/a | **drop** | drop | senioridade abaixo do alvo |

- **Priority 1** (alta fit + high-score manager): **3 vagas** → first batch D3 cold outreach (Wd 3, HOJE 2026-07-09) — T0 anchor + T1 Lean
- **Priority 2** (média fit + Salvador diversification): **8 vagas** → second batch (rolling Wd 1-2) — T1 templates prontos em `byd-cover-letters-final.md`
- **Priority 3** (fit 65-80 OU vertical tangencial): **6 vagas** → follow-up tardio (Wd 3-4) se P1+P2 não converterem
- **Drop** (fit < 65 OU não-data OU senioridade desalinhada): **7 vagas** → descartar; liberar capacidade para P1+P2

## Cross-link

- Parent: `data/matheus/deliverables/byd-market-research.md` (D1 entity)
- Parallel: `data/matheus/deliverables/byd-d1-outputs/byd-greenfield-map.md`
- Parallel: `data/matheus/deliverables/byd-d1-outputs/byd-hiring-managers.md`
- Next: alimenta `data/matheus/deliverables/byd-cold-outreach-assets.md` (D3)

## Notes for future iterations

- Se BYD mudar stack (e.g., migrar para Snowflake), update esta matriz
- Se eu aprender nova lib/framework (e.g., dbt), update `_my_stack_profile`
- Manter disciplina de 1 fonte por stack claim (LinkedIn job description
  é ground truth; não inventar stack required)