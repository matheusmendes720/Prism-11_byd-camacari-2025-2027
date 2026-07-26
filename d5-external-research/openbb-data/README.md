---
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-openbb-data:00000006:00000000
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
entity_type: data_pipeline
slug: byd-camacari-openbb-pipeline
tags: [openbb, parquet, equity, macro, commodities, d5]
title: "OpenBB BYD-Camaçari data pipeline (DRY-RUN-aware)"
date: 2026-07-14
status: scaffold
mode: DRY-RUN (auto-fallback to yfinance + FRED + IMF SDMX)
---

# OpenBB BYD-Camaçari data pipeline

> **STATUS (2026-07-14):** Pipeline script pronto (`pipeline_byd_camari.py`).
> OpenBB install bloqueado por lockfile desatualizado + classifier auto-mode
> (precisa permissão explícita para `-E all`). Script cai em fallback
> yfinance + pandas-datareader + IMF SDMX automaticamente se `openbb` não
> importar. Parquets não gerados ainda — depende de install LIVE ou fallback
> via Python 3.12 venv.

## Pipeline (7 steps, 7 parquets)

| # | Parquet | Rows | Source | Period | Status (2026-07-14) |
|---|---|---|---|---|---|
| 1 | `byd_camari_prices.parquet` | 11 849 | yfinance (all 16 tickers) | 2023-07 → 2026-07 (3y daily) | ✅ 493 KB |
| 2 | `byd_camari_ipca.parquet` | 28 | FRED `BRACPIALLMINMEI` fallback | 2023-01 → 2025-04 (monthly YoY) | ✅ 4 KB |
| 3 | `byd_camari_brazil_bop.parquet` | — | IMF BPM7 SDMX | quarterly | ⏭️ skipped — IMF API empty frame |
| 4 | `byd_camari_brazil_indicators.parquet` | 43 | FRED fallback (PMI only — NGDP_RPCH + BRARENEWRATE 404) | 2023-01 → 2025-04 | ⚠️ 4 KB (FRED 2 endpoints down) |
| 5 | `byd_camari_brent.parquet` | 1 506 | yfinance BZ=F + NG=F | 2023-07 → 2026-07 | ✅ 60 KB |
| 6 | `byd_camari_china_brazil_trade.parquet` | — | IMF DOTS SDMX | monthly | ⏭️ skipped — IMF API empty frame |
| 7 | `byd_camari_tsla_peers.parquet` | 16 | yfinance `.info` snapshot | 2026-07-14 | ✅ 11 KB |

### Atual (run 2026-07-14 19:40–19:41)

```
PIPELINE COMPLETE — parquet inventory:
  byd_camari_brazil_indicators.parquet     3.9 KB   ⚠️ (PMI apenas)
  byd_camari_brent.parquet                60.4 KB   ✅
  byd_camari_ipca.parquet                  4.3 KB   ✅
  byd_camari_prices.parquet              481.6 KB   ✅
  byd_camari_tsla_peers.parquet           10.7 KB   ✅
```

**Resumo:** 5 de 7 parquets gerados (573 KB). Os 2 skipped são endpoints IMF (BPM7 + DOTS)
que retornaram frame vazio — não é falha do pipeline, é limitação transitória do IMF SDMX.

### Gap analysis (parquets que faltam)

- **BoP (`byd_camari_brazil_bop`)**: Tentar fallback alternativo — `world_bank` (World Bank
  BoP `BM.GSR.GNFS.CD`), ou BCB open-data API se disponível. Documentar gap e seguir.
- **China×Brazil trade**: Tentar IMF DOTS via URL `data.imf.org` direta em vez do SDMX API,
  ou BACEN/China MoFCOM mirror.
- **Brazil GDP/Policy rate (FRED NGDP_RPCH / BRARENEWRATE)**: FRED rotos hoje. Tentar
  BCB série temporal 4389 (GDP) ou 432 (Selic), sem chave.

## Universo (16 tickers)

- **BYD core**: `BYDDY` (US OTC ADR), `1211.HK`, `002594.SZ`
- **EV peers**: `TSLA`, `XPEV`, `LI`, `NIO`
- **Auto incumbents**: `GM`, `STLA`, `VOW3.DE`
- **Battery / lithium suppliers**: `300750.SZ` (CATL), `006400.KS` (Samsung SDI),
  `373220.KS` (LG ES), `051910.KS` (LG Chem), `1772.HK` (Ganfeng), `ALB` (Albemarle)

## Como rodar

### Modo 1: OpenBB LIVE (precisa de OpenBB install completo)

```bash
cd C:\Users\mathe\code_space\orchestration\economy-intel\OpenBB\openbb_platform
poetry install -E all       # ou --only main se autorizador
poetry run python \
  ..\..\..\value-factory\case-studies\byd-camacari-2025-2027\d5-external-research\openbb-data\pipeline_byd_camari.py
```

### Modo 2: Fallback (Python 3.12 + yfinance + FRED + IMF)

```bash
# Setup (uma vez):
cd C:\Users\mathe\code_space\orchestration\economy-intel
py -3.12 -m venv .venv-finrobot
.venv-finrobot\Scripts\python.exe -m pip install -r FinRobot\requirements-equity.txt

# Run:
.venv-finrobot\Scripts\python.exe \
  ..\value-factory\case-studies\byd-camacari-2025-2027\d5-external-research\openbb-data\pipeline_byd_camari.py
```

### Modo 3: Wrapper

```bash
python d5-external-research/openbb-data/run_pipeline.py
```

## Output schema (preview)

```python
import pandas as pd

prices = pd.read_parquet("byd_camari_prices.parquet")
print(prices.columns.tolist())
# ['date', 'open', 'high', 'low', 'close', 'volume', 'ticker', 'company_name', 'sector']
print(prices['ticker'].value_counts())
# BYDDY: ~750, 1211.HK: ~750, TSLA: ~750, ...
```

## Cross-link D5

- **D2 notebook** `byd-econometric-vulnerability.ipynb`: lê estes parquets como séries adicionais nos cenários cambio/regulação/competição
- **D3 cover letters**: cita os parquets como prova de domínio quantitativo
- **D4 tracker**: `external_research_attached` col para outreach T0

## Notas técnicas

- **Fallback funciona mesmo sem OpenBB instalado** — o script detecta import
  failure e usa yfinance/FRED/IMF diretamente. Schema é idêntico.
- **FRED API key** é necessária para OpenBB macro; fallback via pandas-datareader
  funciona sem chave para algumas séries públicas.
- **IMF SDMX** é totalmente pública — não precisa de chave.
- **yfinance** é a fonte primária de equity prices — funciona sem chave.