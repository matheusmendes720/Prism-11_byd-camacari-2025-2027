---
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-cross-link-map:00000002:00000000
entity_type: cross_reference_map
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
slug: byd-camacari-d5-cross-link-map
tags: [byd, camacari, cross-link, integration, d5]
title: "D5 Cross-link Map — arsenal artifacts ↔ D1-D4"
custom:
  _purpose: |
    Mapear cada artefato D5 às workstreams D1-D4 existentes, mostrando como os
    outputs do arsenal `economy-intel` retro-alimentam o case-study ONDA 2026-07.
  _inputs:
    - dpr-BYD-2026-07-14/dpr.md
    - jaib-business-specialist-camacari/jaib.md
    - time-machine-byd/report.md
    - openbb-data/byd_camari_*.parquet
    - finrobot-equity-byddy/Professional_Equity_Report_BYDDY.html
  _outputs:
    - cross-link-map.md (este arquivo)
---

# D5 Cross-link Map

> **Tabela de mapeamento** entre artefatos D5 (gerados pelo arsenal `economy-intel`)
> e as workstreams D1-D4 existentes.

## Status atual (2026-07-14, 19:41)

| Artefato D5 | Status | Tamanho | Alimenta D1 | Alimenta D2 | Anexa a D3 | Medido em D4 |
|---|---|---|---|---|---|---|
| `dpr-BYD-2026-07-14/dpr.md` | ⏳ scaffold pronto, LIVE pendente (OPENAI_API_KEY + EXA/TAVILY) | ~500 L | stack-fit context (§1.3 Operational) | vulnerability composite (§2 PROGNOSIS) | T0 anchor + Tier-1 fallback | `external_research_attached` |
| `time-machine-byd/report.md` | ⏳ scaffold pronto, LIVE pendente | ~80 L | vagas BYD posting cadence (§1.1 Organizational) | brand risk (§1.2 Market) | credibility proof | — |
| `jaib-business-specialist-camacari/jaib.md` | ⏳ scaffold pronto, LIVE pendente | ~150 L | hiring-manager anchor enrichment (§1.1) | economic-objective decomposition | direct attachment to T0 application | T0 row attachment column |
| `openbb-data/byd_camari_prices.parquet` | ✅ | 482 KB | — | cambio scenario | — | — |
| `openbb-data/byd_camari_ipca.parquet` | ✅ | 4 KB | — | regulação scenario | — | — |
| `openbb-data/byd_camari_brazil_indicators.parquet` | ⚠️ (PMI only — FRED GDP+rate 404) | 4 KB | — | vulnerability composite denominator | — | — |
| `openbb-data/byd_camari_brent.parquet` | ✅ | 60 KB | — | supply-chain scenario | — | — |
| `openbb-data/byd_camari_tsla_peers.parquet` | ✅ | 11 KB | — | competition-landscape scenario | — | — |
| `openbb-data/byd_camari_brazil_bop.parquet` | ⏭️ skipped (IMF BPM7 empty) | — | — | regulação scenario | — | — |
| `openbb-data/byd_camari_china_brazil_trade.parquet` | ⏭️ skipped (IMF DOTS empty) | — | supply-chain (§1.3) | supply-chain scenario | — | — |
| `finrobot-equity-byddy/Professional_Equity_Report_BYDDY.html` | ⏳ wrapper DRY-RUN OK, LIVE pendente (FMP + OpenAI) | — | — | competition-landscape scenario | T0 anchor attachment | T0 row attachment column |

Legenda: ✅ gerado · ⏳ em progresso · ❌ bloqueado por chave ausente

## Como cada artefato retro-alimenta o case-study

### `dpr-BYD-2026-07-14/dpr.md` → D1/D2/D3/D4

- **D1**: §1.3 Operational da DPR cita fornecedores-asiáticos (CATL, TSMC, Samsung,
  Albemarle) que aparecem em `byd-stack-fit-matrix.md` como requisitos técnicos.
  Permite ratificar ou ampliar a lista de stack-fits identificados no D1.
- **D2**: §2 PROGNOSIS da DPR (cenários Bull/Base/Bear) pode alimentar uma extensão
  do notebook `byd-econometric-vulnerability.ipynb` Section 5 (composite index).
- **D3**: Anexar PDF/HTML da DPR ao T0 anchor email para Yueying Zhang como prova
  de domínio. Citar §1.1 Organizational (histórico BYD Brasil) e §1.4 Sources
  Catalog (rigor de pesquisa).
- **D4**: Adicionar coluna `external_research_attached` ao schema de `outreach`
  (True se DPR anexada).

### `time-machine-byd/report.md` → D1/D3

- **D1**: Evolução da página de careers BYD (`byd.com/br/careers` no Wayback)
  mostra cadência de contratações ao longo de 2025-2027 — confirma o ramp-up
  identificado em `byd-greenfield-map.md`.
- **D2**: crt.sh certificate-transparency data mostra subdomínios ativos
  (api.byd.com.br, dev.byd.com.br, vpn.byd.com.br) — sinaliza infra-tech stack.
- **D3**: Anexar 2-3 prints Wayback como prova de "instant insider" no outreach.

### `jaib-business-specialist-camacari/jaib.md` → D1/D3/D4

- **D1**: §Hiring Manager da JAIB enriquece `byd-hiring-managers.md` com score
  fino de Yueying Zhang (decisor vs influenciador, tenure na BYD, etc).
- **D3**: Anexar JAIB ao email T0 (Yueying) — é literalmente o data-product
  projetado na seção "1-2 day data product".
- **D4**: Atualizar `process` row do T0 com link para JAIB.

### `openbb-data/*.parquet` → D2

- **D2**: Notebook `byd-econometric-vulnerability.ipynb` ganha nova seção
  "External Research Integration" (cell #15+): lê 5-6 parquets OpenBB e plota
  séries adicionais nos cenários cambio/regulatório/competição.

### `finrobot-equity-byddy/Professional_Equity_Report_BYDDY.html` → D2/D3/D4

- **D2**: Citação no 1-pager summary (`outputs/1-pager-summary.md`) e referência
  no `byd-econometric-vulnerability-analysis.md`.
- **D3**: **Anexo principal** ao T0 anchor email. Demonstra domínio quantitativo
  da operação BYD global e das cadeias de suprimento críticas para Camaçari.
  Peso: ~12 páginas, $500+ de valor percebido.
- **D4**: `external_research_attached = True` para outreach T0.

## Próximos passos para finalizar

1. ✅ **OpenBB install completado em fallback mode** → pipeline rodou → **5/7 parquets** (573 KB total).
2. ⏳ **FinRobot pip install completado em Python 3.12 venv** → wrapper DRY-RUN reaches
   PIPELINE COMPLETE. LIVE pendente de `FMP_API_KEY` + `OPENAI_API_KEY` em `config.ini`.
3. ⏳ **dexter LIVE** (precisa `OPENAI_API_KEY` + `EXASEARCH_API_KEY`/`TAVILY_API_KEY`) → 4 skills
   em sequência → DPR/JAIB/time-machine populados com seções §1-§6.
4. ⏭️ **BoP + China×Brazil trade** — IMF SDMX retornou vazio; tentar fallback World Bank API
   ou BCB antes de LIVE dexter preencher a coluna de supply-chain.
5. ⏳ Atualizar este mapa com ✅ para cada linha quando LIVE fill completa.
6. ⏳ Atualizar `byd-econometric-vulnerability-analysis.md` com cross-link D5 (parquets).
7. ⏳ Atualizar `byd-cold-outreach-assets.md` com anexo `Professional_Equity_Report_BYDDY.html` quando gerado.
8. ⏳ Atualizar `byd-process-tracker.md` com coluna `external_research_attached`.

**Bloqueador LIVE:** chaves de API que o usuário prometeu listar mas ainda não foram fornecidas.
- `FinRobot.config.ini`: precisa `fmp_api_key` + `openai_api_key`
- `dexter/.env`: precisa `OPENAI_API_KEY` + (uma de) `EXASEARCH_API_KEY`/`TAVILY_API_KEY`/`PERPLEXITY_API_KEY`/`LANGSEARCH_API_KEY`