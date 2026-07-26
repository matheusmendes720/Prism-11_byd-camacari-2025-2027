---
ueid: ikigai:deliverable:d1-market-research:byd-camari:2026-07
entity_type: deliverable
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
slug: byd-market-research
title: "D1 — BYD market intelligence + greenfield detection"
status: draft
ikigai_vectors: [market]
vector_weights_snapshot: {passion: 0.10, skill: 0.20, market: 0.60, revenue: 0.05, course: 0.05}
phase_at_creation: fundacao
regime_at_creation: push
horizon_days: 3
artifact_path: null
artifact_type: document
is_public: false
created_at: 2026-07-09T00:00:00Z
updated_at: 2026-07-09T00:00:00Z
source: user
tags: [persona/matheus, horizon/3d, deliverable/d1, workstream/w1, empresa/byd]
custom:
  _horizon_rationale: "3 wd research sprint — dentro do Literal[1-7] bucket"
  _deliverable_role: "blocking (W1 sequential, gates D2+D3)"
  _outputs:
    - "d1-greenfield-scout/byd-greenfield-map.md -- vagas BR (29 mencoes, 4 confimadas)"
    - "d1-greenfield-scout/byd-hiring-managers.md -- 7 hiring managers (BYD + fallbacks)"
    - "d1-greenfield-scout/byd-hiring-managers-salvador.md -- 10 empresas Salvador/remote"
    - "d1-greenfield-scout/byd-stack-fit-matrix.md -- fit matrix 6x4 por empresa"
  _success_criteria:
    - "≥ 3 vagas BR-confirmadas (publicadas em 2026-06-01+)"
    - "≥ 1 hiring manager identificado por vaga-alvo"
    - "Stack fit score médio ≥ 60% (weighted por vaga)"
---

# D1 — BYD market intelligence (W1, 3 wd)

> **Objetivo:** provar que BYD está contratando em jul/ago 2026 com
> stack Python-adjacent e mapear decision makers.

## Inputs (proveniência)

- **Public ATS**: LinkedIn Jobs, Glassdoor, Catho, Indeed BR
- **Greenhouse public API**: `https://boards.greenhouse.io/byd` (se aplicável)
- **LinkedIn search**: "BYD Brasil" + filtros (Brazil, past month, data/analytics/quant)
- **Google News API** (free tier): "BYD contrata" + "BYD vagas"
- **RocketReach / Snov.io** (free tier): emails decision makers

## Outputs (deliverable artifacts)

1. **byd-greenfield-map.md** (markdown): tabela de vagas abertas com colunas
   [vaga, link, data_publicação, stack_required, seniority, location, fit_score]
2. **byd-hiring-managers.md** (markdown): tabela decision-makers com colunas
   [nome, cargo, LinkedIn, email_pattern, score_alinhamento]
3. **byd-stack-fit-matrix.md** (markdown): matriz vaga × stack_required × meu_match
   (análise qualitativa; quanto da stack eu já domino vs aprenderia on-the-job)

## Decisão gate (entrega → destrava D2 + D3)

Se D1 confirma hipótese (≥ 3 vagas BR + ≥ 1 manager) → segue D2 + D3.
Se D1 mostra "0 vagas relevantes em jul-ago" → re-avalia escopo onda:

- (a) Estender janela para set-out 2026 (próximo ciclo hiring);
- (b) Pivotar para próxima empresa-alvo (denunciate em D1);
- (c) Aceitar que BYD não é Q3 fit e voltar Q3-1 escopo original (30 empresas + 2-3 verticals).

Decisão final fica registrada no Q3-2 retro (2026-08-07).

## Riscos & mitigations

| Risco | Prob | Impact | Mitigation |
|------|------|--------|------------|
| Greenhouse rate-limit (HTTP 429) | M | H | cached results + manual fallback (page-by-page scrape < 50 req) |
| BYD não publica vagas em jul | M | H | D1 confirma em ≤ 3 d; pivot rápido para Q3-2 |
| Emails/LinkedIn de managers protegidos | H | M | Google + RocketReach + Snov free tier + manual verify |
| Stack fit < 60% em todas vagas | L | H | re-evaluate Q3-2 retro (DEC-08 implications) |

## Próximo passo

Após D1 entregue: W2 começa D2 (econometric vulnerability analysis) +
W3 começa D3 em paralelo.

