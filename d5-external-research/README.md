---
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-external-research:00000001:00000000
entity_type: research_workstream
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:00000000:00000000
slug: byd-camacari-d5-external-research
tags: [byd, camacari, ev-manufacturing, ondern-research, finrobot, fincept, openbb, dexter, arsenal]
title: "D5 — External Research Integration (economy-intel arsenal ↔ case-study)"
custom:
  _purpose: |
    Cruzar dados do arsenal `economy-intel` (FinRobot, FinceptTerminal, OpenBB, dexter)
    com os artefatos D1-D4 do case-study ONDA 2026-07 (BYD Brasil — Polo Automotivo
    Camaçari, BA — 2025-2027 buildout). Fechar o silo existente onde os dois repos
    coexistiam sem integração.
  _outputs:
    - dpr-BYD-2026-07-14/dpr.md
    - jaib-business-specialist-camacari/jaib.md
    - time-machine-byd/report.md
    - openbb-data/byd_camari_*.parquet (10+ parquets)
    - finrobot-equity-byddy/Professional_Equity_Report_BYDDY.html
    - cross-link-map.md
  _success_criteria: |
    Cada subdir D5 tem ≥1 artefato gerado (LIVE ou DRY-RUN scaffold);
    todos com `parent_ueid` correto e referenciados em cross-link-map.md;
    pelo menos 3 artefatos (DPR, equity report, parquets) anexam-se de volta
    a D1/D2/D3/D4 via cross-link ou attachment.
  _tooling:
    - dexter  (Bun + TypeScript)
    - OpenBB  (Python + poetry)
    - FinRobot (Python)
    - FinceptTerminal (C++20 + Qt6) — DEFERRED this session (Qt 6.8.3 not installed)
---

# D5 — External Research Integration

> **Status (2026-07-14, 19:41):**
> - ✅ **Phase 0** — D5 skeleton + `.env.example` criado
> - ✅ **Phase 1 (OpenBB)** — pipeline rodou em FALLBACK mode (poetry lock desatualizado).
>   **5/7 parquets** salvos (573 KB total): prices (16 tickers, 3y), IPCA, indicators (PMI),
>   brent+NatGas, peer snapshot. 2 skipped (IMF BPM7 + DOTS APIs retornaram vazio).
> - ✅ **Phase 2 scaffolds (dexter DPR/JAIB/time-machine)** — DRY-RUN estruturado criado
>   com frontmatter ueid. LIVE fill depende de `OPENAI_API_KEY` + `EXASEARCH_API_KEY`.
> - ✅ **Phase 3 (FinRobot wrapper)** — DRY-RUN reaches PIPELINE COMPLETE. LIVE fill
>   depende de `FMP_API_KEY` + `OPENAI_API_KEY` em `FinRobot/finrobot_equity/core/config/config.ini`.
> - ⏭️ **FinceptTerminal** — DEFERRED esta sessão (Qt 6.8.3 MSVC não instalado).
>
> Ver `cross-link-map.md` para mapeamento D5 ↔ D1-D4.

Esta workstream conecta o **arsenal `economy-intel`** ao case-study **BYD-Camaçari
2025-2027** (wave ONDA 2026-07). Cada um dos 4 sub-módulos do arsenal produz um tipo
de artefato:

| Submódulo | Tipo de artefato | Onde vai em D5 |
|---|---|---|
| **dexter** (Bun) | DPR populada, JAIB, time-machine bundle | `dpr-BYD-2026-07-14/`, `jaib-*/`, `time-machine-byd/` |
| **OpenBB** (Python) | Parquets de equity + macro + commodities | `openbb-data/byd_camari_*.parquet` |
| **FinRobot** (Python) | Equity research HTML (5-page) + CSVs + charts | `finrobot-equity-byddy/` |
| **FinceptTerminal** (Qt) | Live cockpit (Asia Markets, Equity Valuation) | **DEFERRED** — Qt 6.8.3 não instalado |

## Como reproduzir

Pré-requisitos:
- Bun 1.3.14 (já em PATH)
- Python 3.12 ou 3.14 (já em PATH)
- poetry (`pip install poetry` se ausente)

```bash
# 1) Setup .env (opcional — LIVE se preenchido, DRY-RUN se vazio)
cd C:\Users\mathe\code_space\orchestration\value-factory\case-studies\byd-camacari-2025-2027\d5-external-research
cp .env.example .env
# preencher chaves...

# 2) OpenBB pipeline (data-y, primeiro deliverable)
cd C:\Users\mathe\code_space\orchestration\economy-intel\OpenBB\openbb_platform
poetry install -E all
poetry run python ..\..\..\value-factory\case-studies\byd-camacari-2025-2027\d5-external-research\openbb-data\pipeline_byd_camari.py

# 3) dexter (REPL interativo)
cd C:\Users\mathe\code_space\orchestration\economy-intel\dexter
cp env.example .env  # preencher chaves
bun install
bun run start
#   > "Run osint-reconnaissance on BYD Brasil, CNPJ lookup, output to .../d5/dpr-BYD-2026-07-14/dpr.md"
#   > "Run time-machine on byd.com + byd.com.br, output to .../d5/time-machine-byd/"
#   > "Run hiring-economics on the Business Specialist Camaçari posting (LinkedIn 4425953683)"
#   > "Run finrobot-handoff on .../d5/dpr-BYD-2026-07-14/dpr.md (DRY first, then --live)"

# 4) FinRobot equity pipeline (BYDDY)
cd C:\Users\mathe\code_space\orchestration\economy-intel
pip install -r FinRobot/requirements-equity.txt
cp FinRobot/finrobot_equity/core/config/config.ini.example FinRobot/finrobot_equity/core/config/config.ini
# preencher [API_KEYS] fmp_api_key + openai_api_key
python FinRobot/finrobot_equity/core/src/generate_financial_analysis.py \
    --company-ticker BYDDY --company-name "BYD Company Limited" \
    --config-file FinRobot/finrobot_equity/core/config/config.ini \
    --peer-tickers TSLA XPEV LI --generate-text-sections
# (then create_equity_report.py with all --*-file flags)
```

## FinceptTerminal — DEFERRED

Por que não rodar agora:
- **Qt 6.8.3 (MSVC 2022 kit)** não está instalado em `C:/Qt/`.
- MSVC 18.x (VS 2026) está disponível, mas Qt prebuilt binaries só cobrem
  MSVC 2022 (Qt 6.8.x). Compilar Qt do source = 2-4h adicionais.
- Mesmo com Qt instalado, build = 30-60 min em background; smoke-test passa.

Quando as deps forem instaladas:
```bash
cd C:\Users\mathe\code_space\orchestration\economy-intel\FinceptTerminal\fincept-qt
# Em PowerShell com DevTools prompt:
$env:QT_TLS_BACKEND='openssl'
& "C:\Program Files\Microsoft Visual Studio\18\Community\VC\Auxiliary\Build\vcvarsall.bat" x64
cmake --preset win-release
cmake --build --preset win-release --parallel 4
# Após build:
.\build\win-release\FinceptTerminal.exe --smoke-test
```

## Ordem de fases (sessão única)

| t (min) | Fase | Deliverable visível |
|---|---|---|
| 0 | D5 skeleton + `.env.example` | este README |
| 0+ | OpenBB `poetry install -E all` em background | (10-15 min) |
| 10 | OpenBB pipeline script + run | 10 parquets |
| 15 | FinRobot pip install + smoke NVDA | validação toolchain |
| 20 | dexter REPL: 4 skills (LIVE/DRY-RUN) | DPR + JAIB + time-machine |
| 30 | FinRobot BYDDY pipeline | equity report HTML |
| 50 | Cross-links D1-D4 | cross-link-map.md final |
| 55 | Verificação 8 critérios | ✅ |

## Verificação end-to-end

Ver `cross-link-map.md` para a tabela de mapeamento. Os 8 critérios de
verificação estão no plano em
`~/.claude/plans/vamos-continuar-o-research-twinkling-hartmanis.md`.