---
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-time-machine-byd:00000005:00000000
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
entity_type: time_machine_report
slug: byd-time-machine-2026-07
tags: [byd, camacari, time-machine, wayback, crtsh, dexter, d5]
title: "BYD Time-Machine — Wayback CDX + crt.sh + GitHub cadence (scope: *.byd.com / *.byd.com.br)"
date: 2026-07-14
status: scaffold-dry-run
mode: DRY-RUN
target_company: BYD do Brasil Ltda. + parent BYD Company Limited
scope_domains: [byd.com, byd.com.br, www.byd.com, www.byd.com.br]
pages: [careers, sitemap, pricing, about, news, sustainability]
purpose: Historical-surface reconnaissance for BYD hiring cadence, brand evolution, infra-tech stack
---

# BYD Time-Machine Report — Scope & Plan

> **STATUS (2026-07-14):** Scope definido, ferramentas listadas, dados JSON
> pendentes (LIVE execution). Companion DPR: `dpr-BYD-2026-07-14/dpr.md`. Companion
> JAIB: `jaib-business-specialist-camacari/jaib.md`.

## Escopo

| Field | Value |
|---|---|
| Domain strategy | `*.byd.com` (parent global) + `*.byd.com.br` (Brasil subsidiary) |
| Pages sampled | careers/jobs, sitemap, pricing, about, sustainability, news |
| Sources | (a) Wayback CDX API, (b) crt.sh certificate-transparency, (c) optional GitHub org cadence for `bydotony` (open-source forks) |
| Period | 2023-01-01 → 2026-07-14 (3.5 years — covers Camaçari buildout announcement 2023-07 + ramp) |
| Mode | DRY-RUN scaffold; LIVE if EXASEARCH/TAVILY/PERPLEXITY keys set |

## Step-by-step plan

### 1. Wayback CDX (scope: 6 pages × 2 domains = 12 series)

```bash
# Per domain × page combo, run:
curl -s 'http://web.archive.org/cdx/search/cdx?url=byd.com&matchType=domain&from=20230101&to=20260714&output=json&fl=timestamp,original,statuscode,mimetype&limit=500' \
  > 01-wayback-cdx-byd-com-root.json

curl -s 'http://web.archive.org/cdx/search/cdx?url=byd.com/careers*&matchType=prefix&from=20230101&to=20260714&output=json' \
  > 02-wayback-cdx-byd-com-careers.json

curl -s 'http://web.archive.org/cdx/search/cdx?url=byd.com.br&matchType=domain&from=20230101&to=20260714&output=json' \
  > 03-wayback-cdx-byd-com-br-root.json

curl -s 'http://web.archive.org/cdx/search/cdx?url=byd.com.br/carreiras*&matchType=prefix&from=20230101&to=20260714&output=json' \
  > 04-wayback-cdx-byd-com-br-carreiras.json
```

**Output target:** 4 JSON files in this dir.

### 2. crt.sh certificate-transparency (scope: 2 domains)

```bash
# crt.sh query for any cert covering byd.com
curl -s 'https://crt.sh/?q=%25.byd.com&output=json' > 05-crtsh-byd-com.json
curl -s 'https://crt.sh/?q=%25.byd.com.br&output=json' > 06-crtsh-byd-com-br.json
```

**Output target:** 2 JSON files in this dir.

**Signals to extract:**
- Subdomain enumeration (api.byd.com.br, dev.byd.com.br, vpn.byd.com.br, etc.)
- Cert issuance cadence (proxy for infra-expansion rate)
- Org field (verify subsidiary names match RNPC lookup)
- Wildcard cert presence (multi-service infra)

### 3. Wayback diff analysis (post-processing)

After CDX collection, identify key pivot dates:
- **2023-07-26**: Ford-Camaçari sale announcement to BYD (DN PM 1521/2023)
- **2024-10-01**: BYD hiring portal first appears on byd.com.br
- **2025-Q1**: First vagas for Camaçari visible on LinkedIn
- **2025-Q3**: First vehicle roll-off (line 1 production)
- **2026-Q1**: Line 2 groundbreaking (if happens)

Cross-reference each Wayback snapshot against these pivots.

### 4. Optional: GitHub org cadence (BYD-related forks)

```bash
# Search for public BYD-affiliated repos (filter noise)
gh search repos 'byd in:name,description' --limit 30 --json name,createdAt,stargazers,language \
  > 07-github-byd-related-repos.json
```

**Output target:** 1 JSON file.

**Signals:** engineering velocity, open-source posture, what tooling they publish.

## Status of outputs

| File | Status |
|---|---|
| `01-wayback-cdx-byd-com-root.json` | ⏳ pending LIVE |
| `02-wayback-cdx-byd-com-careers.json` | ⏳ pending LIVE |
| `03-wayback-cdx-byd-com-br-root.json` | ⏳ pending LIVE |
| `04-wayback-cdx-byd-com-br-carreiras.json` | ⏳ pending LIVE |
| `05-crtsh-byd-com.json` | ⏳ pending LIVE |
| `06-crtsh-byd-com-br.json` | ⏳ pending LIVE |
| `07-github-byd-related-repos.json` | ⏳ pending LIVE |
| `report.md` (this file) | ⏳ synthesis pending LIVE |

## Cross-link to D5

- DPR §1.3 Operational (tech-stack + cybersecurity posture) ← crt.sh outputs
- DPR §1.1 Organizational (recent senior arrivals, hiring cadence) ← Wayback careers series
- JAIB §1.1 Posting forensics (posting age / refresh cadence) ← LinkedIn UI + Wayback correlations
- D1 `byd-greenfield-map.md` (hiring hubs ramp trajectory) ← Wayback careers over time

## Próximos passos

1. Check `economy-intel/dexter` `.env` (EXASEARCH/TAVILY keys) — without these, fall back to manual curl of CDX/crt.sh public APIs (no key needed)
2. Run curl commands above → 7 JSON files
3. Process JSONs: extract pivot dates + cert counts → markdown tables
4. Write `report.md` synthesis (top-3 insights per source)
5. Cross-link to DPR §1.1, §1.3 and JAIB §1.1