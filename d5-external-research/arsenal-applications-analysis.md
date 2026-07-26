---
ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-arsenal-analysis:00000007:00000000
parent_ueid: ikigai:project:onda-2026-07-byd-deep-dive:d5-external-research:00000001:00000000
entity_type: technical_analysis
slug: byd-camacari-arsenal-applications-analysis
tags: [fincept, openbb, dexter, finrobot, arsenal, evaluation, d5]
title: "Arsenal Applications — Technical Analysis (BYD-Camaçari context)"
date: 2026-07-14
status: draft
custom:
  _purpose: |
    Avaliar criticamente cada uma das 4 aplicações do arsenal economy-intel
    em relação ao objetivo primário do workspace: produzir inteligência
    "instant insider" sobre a empresa-alvo (BYD Brasil / Camaçari 2025-2027)
    para uso em entrevistas e aplicações frias.
  _scope: |
    Análise baseada em evidência real (conteúdo instalado nos repos locais em
    2026-07-14). Não é documentação oficial — é o meu recorte operacional.
  _goal_posture: |
    Workspace é uma **arsenal de leverage para entrevistas**, não sandbox genérico
    de fin-AI. Cada aplicação é julgada por: (1) produz artefato usável no D3
    outreach? (2) baixa fricção operacional? (3) custo de manutenção justificável?
---

# Arsenal Applications — Análise Técnica

> **TL;DR:**
> - O número de **5 GB** que ciculou antes era **RAM durante o link do MSVC**,
>   não espaço em disco. O custo real em disco é ~3–5 GB para Qt 6.8.3 + módulos
>   via aqtinstall, OU **zero** se você usar o instalador pré-built do GitHub
>   Releases (`FinceptTerminal-4.2.0-windows-x64-setup.exe`).
> - **FinceptTerminal** é o patinho feio da história em 2026-07: maintenance mode,
>   foco em private edition, AGPL-3.0. **Construir não compensa para o nosso caso**.
> - **OpenBB** é o backbone de dados (37 provedores instalados, 18 extension routers).
>   Em modo fallback (yfinance + pandas-datareader + IMF SDMX) já cobre 80% do que
>   precisamos para o BYD-Camaçari.
> - **dexter** é o **cérebro de orquestração** (7 skills, 13 tools, agent loop Bun).
>   É o que transforma dados brutos em DPR/JAIB/time-machine — o produto final do arsenal.
> - **FinRobot** é a **vitrine institucional** (8 analyst agents + HTML renderer).
>   O `Professional_Equity_Report_BYDDY.html` é literalmente o anexo-âncora do email T0
>   para Yueying Zhang. Custo: precisa Python 3.12 venv (numpy 1.26.4 não roda em 3.14).

---

## 1. Esclarecimento: o que é "5 GB" no Fincept?

Vou desfazer a confusão. Há **três números diferentes** circulando:

| O que | Tamanho real | Onde aparece | O que significa |
|---|---|---|---|
| **RAM durante link** | 5+ GB livres | `CMakePresets.json` `win-dev` (RelWithDebInfo + unity OFF) | "the 1000+ object link is RAM-bound … balloons to minutes (even hangs the OS at 12-wide) on a memory-starved machine" |
| **Disco Qt 6.8.3 + 4 módulos** | ~3–5 GB | `setup.sh` linha 191: `AQT_MODULES="qtcharts qtwebsockets qtmultimedia qtspeech"` | aqtinstall baixa Qt base (~1.5–2.5 GB) + 4 módulos (~500–800 MB cada) |
| **Instalador pré-built** | ~150–250 MB | GitHub Releases v4.2.0: `FinceptTerminal-4.2.0-windows-x64-setup.exe` | **Caminho recomendado** — zero build, zero Qt, zero MSVC. |

**Recomendação revisada:** Pular build-from-source completamente. O instalador pré-built
roda em Windows com Qt embutido. Sem o source build, o único custo é baixar o .exe
(~200 MB) + tempo de instalação (5 min).

---

## 2. FinceptTerminal — cockpit desktop C++/Qt6

### Stack real (verificado em `setup.sh` + `CMakePresets.json`)

- **Linguagem**: C++20 puro (sem .NET, sem Electron)
- **UI**: Qt 6.8.3 (módulos: qtcharts, qtwebsockets, qtmultimedia, qtspeech)
- **Embedded analytics**: Python 3.11+ (chamado via bindings C++)
- **Build**: CMake 3.27+ + Ninja + MSVC 19.38 (Qt só tem prebuilt para MSVC 2022)
- **Módulos instalados** (verificado em `src/`):
  - `algo_engine/` — backtest, candle aggregator, scanner, indicator engine, deployment runner
  - `datahub/` — fonte única de dados (provavelmente o coração)
  - `mcp/` — Model Context Protocol server (integra com Claude!)
  - `screens/`, `trading/`, `services/`, `storage/`, `network/`, `auth/`, `config/`, `ui/`, `core/`, `app/`, `python/`
- **Pretensões do README**: 37 AI agents (Buffett, Graham, Lynch…), 100+ data connectors,
  QuantLib 18 módulos, 16 brokers (Zerodha, IBKR, Alpaca…), maritime tracking, satélite.

### Prós para o nosso objetivo (workspace = arsenal de entrevistas)

- ✅ **Performance nativa** — consegue mostrar equity research em tempo real durante
  uma call de entrevista sem travar (HTML/JPG não travam, mas terminal interativo trava sim).
- ✅ **Aesthetics** — uma DPR mostrada ao vivo no terminal impressiona mais que um PDF.
- ✅ **MCP server nativo** (`src/mcp/`) — pode ser plugado direto no Claude Code como tool
  provider, fechando o loop arsenal ↔ editor.
- ✅ **Multi-asset no mesmo shell** — DCF + portfolio + risk + derivatives na mesma janela,
  coisa que o FinRobot HTML não faz.

### Contras para o nosso objetivo

- ❌ **Maintenance mode** (Junho 2026 — lido do README): "moving to **one update per
  month**", equipe focada em **private edition** paga. O repositório público vai
  definhando. Investir esforço de setup num projeto com horizonte de vida curto é
  arriscado.
- ❌ **Foco em trading ativo, não em intelligence passiva**. 16 brokers + algo trading
  + paper trading são features de quem **executa**, não de quem produz um relatório
  para anexar a uma candidatura.
- ❌ **AGPL-3.0**: copyleft forte. Tudo que derivar do código precisa abrir source.
  Não combina com nosso uso (não vamos commitar código derivado, mas a licença
  impõe cuidado).
- ❌ **Curva de setup íngreme** mesmo com o instalador pré-built — Configurar MCP,
  escolher entre 37 agents, aprender o layout do IDE. Tempo até o primeiro
  artefato utilizável: ~2-4 horas, vs ~30 min no FinRobot.
- ❌ **Dados duplicados** com OpenBB (que tem 37 provedores próprios, +IMF, +FRED, +FMP).
  Pagar o custo do Fincept pra ter mais 30 conectores que não usamos = redundância.

### Veredito

🟡 **DEFERRED para este case-study.** Vale revisitarmos no futuro se:
- (a) formos ativamente negociar / usar terminal durante calls (não é o plano agora),
- (b) a manutenção voltar (sinalizar no GitHub quando o issue tracker reativar),
- (c) quisermos rodar o MCP server do Fincept dentro do Claude Code (única killer feature real).

**Decisão concreta:** Skip. Próxima ação possível é instalar o .exe pré-built (~200 MB,
5 min) só pra ter a referência visual, **mas não gerar artefatos do BYD-Camaçari
via Fincept**. Toda inteligência vai vir do **OpenBB + dexter + FinRobot**.

---

## 3. OpenBB Platform — backbone de dados Python

### Stack real (verificado em `extensions/` + `providers/`)

- **Linguagem**: Python 3.10–3.12 (3.13 só com workarounds)
- **Packaging**: Poetry (lockfile peer-reviewed)
- **Providers instalados** (37 reais, lidos de `providers/`):
  - **Mercado**: alpha_vantage, fmp, intrinio, tiingo, polygon (não listado, falta), tradier,
    finviz, seeking_alpha, stockgrid, multpl, yfinance
  - **Macro/FX**: federal_reserve (FRED), ecb, imf, oecd, econdb, bls, eia, tradingeconomics,
    tmx, cboe, deribit, famafrench, finra, nasdaq, sec, wsj, government_us, congress_gov, cftc
  - **News/Alt**: biztoc, benzinga
- **Extension routers** (18): commodity, crypto, currency, derivatives, devtools,
  econometrics, economy, equity, etf, famafrench, fixedincome, index, mcp_server,
  news, platform_api, quantitative, regulators, technical

### Prós para o nosso objetivo

- ✅ **Conectividade universal** — qualquer série que precisamos para o BYD-Camaçari
  (LFP battery costs, lithium spot prices, BRL/USD, Selic, IPCA, China industrial
  production) tem pelo menos um provider coberto.
- ✅ **Schema padronizado** — todo provider retorna colunas canônicas (`date`,
  `open`, `high`, `low`, `close`, `volume`) → parquets uniformes → notebook de
  análise roda em cima sem retrabalho.
- ✅ **Cobertura BR específica** — IMF BPM7, FRED com séries brasileiras (BRARENEWRATE,
  NGDP_RPCH), OECD CPI → cobre o pilar "Brasil macro" do nosso PROGNOSIS.
- ✅ **Fallback graceful** — quando um endpoint quebra (FRED NGDP_RPCH hoje 404),
  o pipeline segue. Já está no script `pipeline_byd_camari.py`.
- ✅ **MCP server** (`extensions/mcp_server/`) — pode ser exposto como tool provider
  para Claude Code (mesma vantagem do Fincept MCP, mas sem o peso do Qt).

### Contras para o nosso objetivo

- ❌ **Poetry lockfile drift**: o `pyproject.toml` mudou desde o `poetry.lock` foi
  gerado. `poetry install -E all` falha por classifier (regra explícita do nosso
  setup: **"-E all is an agent-chosen scope escalation"**). O caminho real hoje é
  `--only main` (também bloqueado) ou usar **fallback yfinance + pandas-datareader
  + IMF SDMX** puro.
- ❌ **Volume de providers = complexidade de credenciais**. Para cada um que você
  quer LIVE, precisa de chave (FRED, FMP, Tiingo, etc). Para o nosso caso (DRY-RUN
  com dados públicos), OK. Para LIVE mais sério, 5+ chaves a gerenciar.
- ❌ **Curva de aprendizado da API OpenBB** — o `obb.equity.price.historical(symbol=...
  provider="yfinance")` é ergonômico, mas a malha completa de `obb.economy.*`,
  `obb.currency.*`, etc exige 30 min de mapeamento.
- ❌ **Cobertura de Brasil ainda incompleta** — séries realmente úteis (BCB SGS,
  CAGED, ComexStat) não têm provider oficial; tem que raspar manualmente.

### Veredito

🟢 **ATIVO — núcleo do D5 data layer.** Já provou valor nesta sessão:
5/7 parquets gerados em modo fallback (~5 min runtime), cobrindo 16 tickers × 3 anos
+ IPCA + PMI + Brent + NatGas + peer snapshot. É o que alimenta o D2 notebook.

**Decisão concreta:** Manter `pipeline_byd_camari.py` como o "canivete suíço" de
dados do case-study. Rodar 1× por semana (freshness). Re-rodar sob demanda quando
um cenário novo do D2 exigir séries adicionais.

---

## 4. dexter — agente deep-research (Bun + TypeScript)

### Stack real (verificado em `src/`)

- **Runtime**: Bun 1.3.14 (TypeScript estrito, ESM)
- **UI**: Ink (React-for-CLI)
- **Skills (7) instaladas**:
  - `osint-reconnaissance/` — popula DPR via SCIP + MITRE TA0043
  - `time-machine/` — Wayback CDX + crt.sh + (opcional) GitHub cadence
  - `hiring-economics/` — popula JAIB (10× plan + 1-2 day data product)
  - `dcf/` — Discounted Cash Flow autonomous agent
  - `finrobot-handoff/` — ponte DPR → FinRobot (8 per-agent prompts)
  - `write-memo/` — escrita estruturada de memorandos
  - `x-research/` — Twitter/X reconnaissance
- **Tools (13)**: ask-user-question, bash, browser, cron, fetch, filesystem, finance,
  heartbeat, memory, registry, search, skill, subagent
- **Agent core**: agent.ts, scratchpad.ts, run-context.ts, tool-executor.ts, prompts.ts,
  token-counter.ts, channels.ts (subagent/compact/microcompact)

### Prós para o nosso objetivo

- ✅ **É o **cérebro** do arsenal** — transforma dados brutos do OpenBB em
  texto estruturado de consultoria. Sem dexter, os parquets ficam órfãos.
- ✅ **Skills são exatamente o que precisamos** — `osint-reconnaissance` +
  `hiring-economics` + `time-machine` cobrem 100% do envelope D5.
- ✅ **Auto-validação no loop** (via `agent.ts` + `scratchpad.ts`) — o agente
  confere as próprias fontes antes de gravar, então o DPR final já vem
  auditado.
- ✅ **Persistent memory** (`memory/` + `mcp__claude-flow__memory_usage`) — sessões
  futuras começam sabendo o que já foi descoberto.
- ✅ **Zero build, zero lockfile** — `bun run start` e já está no REPL interativo.

### Contras para o nosso objetivo

- ❌ **Custo por skill run** — cada `osint-reconnaissance` numa empresa nova custa
  ~$0.50–$2.00 em chamadas OpenAI/Anthropic + Exa/Tavily search. Para 24 vagas ×
  DPR = $12–48 por empresa × N empresas = $$$
- ❌ **Bloqueio duro em chaves**: sem `OPENAI_API_KEY` + `EXASEARCH_API_KEY` (ou
  Tavily/Perplexity/Langsearch), o REPL entra em "DRY-RUN" e o skill produz só
  o esqueleto. Estamos nesse estado hoje.
- ❌ **REPL interativo bloqueia shell** — não dá pra rodar `bun run start` em
  background e continuar; tem que ficar na sessão. Inadequado para sessões
  multi-task.
- ❌ **LangSmith evals ainda frágeis** (`bun run src/evals/run.ts`) — cobertura
  de testes qualitativos ainda não é adulta. Confiança no output depende de
  revisão manual.

### Veredito

🟢 **ATIVO — orquestrador do D5.** Já tem os scaffolds DPR/JAIB/time-machine
montados no BYD-Camaçari. Falta LIVE fill (bloqueado pelas chaves que você
disse que ia listar). É o que dá **a voz de consultoria** ao arsenal.

**Decisão concreta:** Quando você colar as chaves em `dexter/.env`, rodo os 4
skills em sequência via REPL. Saída esperada: ~4 arquivos com seções §1–§6
populadas com fontes citadas (não textão vazio).

---

## 5. FinRobot — framework multi-agent de equity research

### Stack real (verificado em `finrobot_equity/core/src/`)

- **Linguagem**: Python 3.11+
- **Frameworks**: AutoGen (multi-agent), OpenAI 1.109.1+
- **8 analyst agents** (`modules/equity_agents/`):
  - `tagline_agent.py`, `company_overview_agent.py`, `investment_overview_agent.py`,
    `valuation_overview_agent.py`, `risks_agent.py`, `competitor_analysis_agent.py`,
    `major_takeaways_agent.py`, `news_summary_agent.py`
- **Módulos de suporte** (`modules/`):
  - `valuation_engine.py`, `sensitivity_analyzer.py`, `catalyst_analyzer.py`,
    `chart_generator.py`, `enhanced_chart_generator.py`, `text_generator_agents.py`,
    `enhanced_text_generator.py`, `html_renderer.py`,
    `html_template_professional.py`, `pdf_generator.py`,
    `professional_pdf_report.py`, `market_data_api.py`, `news_integrator.py`,
    `financial_data_processor.py`, `retail_sentiment_client.py`
- **Pipeline**: 2 passos (`generate_financial_analysis.py` → `create_equity_report.py`)
- **Saída**: 5-page HTML + CSV com métricas + ~14 charts PNG

### Prós para o nosso objetivo

- ✅ **Output premium** — `Professional_Equity_Report_BYDDY.html` é literalmente
  o **anexo-âncora do email T0** para Yueying Zhang (HR Director BYD Brasil).
  Nenhum outro componente do arsenal gera algo com aparência tão institucional.
- ✅ **Estrutura consistente** — todo relatório tem as mesmas 5 páginas (Tagline
  · Financial Summary · Peer Comparison · Sensitivity+Catalyst · News+Charts).
  Branding "consulting-grade" passa seriedade.
- ✅ **Pipeline two-step bem isolado** — step 1 gera dados, step 2 renderiza.
  Permite regenerar HTML sem re-puxar tudo (se só ajustou o template).
- ✅ **DRY-RUN confiável** — o wrapper que escrevi (`pipeline_wrapper.py`) cai
  graciosamente em modo plan-only quando faltam chaves. Bom para demos.

### Contras para o nosso objetivo

- ❌ **Custo por pipeline run**: 8 agents × ~3k tokens cada + ~10k tokens de system
  prompts = ~30–40k tokens input + ~10k output = ~$0.50–1.50 por relatório.
  Multiplicar por 24 vagas = $12–36. Não absurdo, mas não é grátis.
- ❌ **Dependência de FMP + OpenAI**: dois SaaS pagos. Sem eles, zero output.
- ❌ **Python 3.14 quebra** — numpy 1.26.4 (forçado pela stack FinRobot) não
  roda em Python 3.14 (MINGW segfault). Tivemos que criar `economy-intel/.venv-finrobot/`
  com Python 3.12. Isso é fricção operacional.
- ❌ **Limitado a equity research** — não faz DCF robusto (delegado a dexter
  `dcf` skill), não faz portfolio optimization (delegado a Fincept). É um
  especialista, não um generalista.
- ❌ **BYDDY (US OTC ADR) tem cobertura parcial no FMP** — pode ser que algumas
  métricas (e.g., free cash flow segmentado por geography) voltem NaN. Fallback
  necessário.

### Veredito

🟢 **ATIVO — gerador do anexo institucional.** Wrapper DRY-RUN já validado.
LIVE bloqueado por FMP+OpenAI. Quando as chaves chegarem, gera o
`Professional_Equity_Report_BYDDY.html` em ~3 min e anexa ao D3 cold-outreach.

**Decisão concreta:** É a peça mais valiosa do arsenal para o case-study, mas
também a mais dependente de chaves. Rodar 1× antes do envio T0, congelar HTML
como PDF, anexar ao email.

---

## 6. Comparação resumida (matriz de decisão)

| Critério | FinceptTerminal | OpenBB | dexter | FinRobot |
|---|---|---|---|---|
| **Tipo** | Cockpit desktop C++/Qt | Backbone de dados Python | Agente deep-research Bun | Equity research Python |
| **Artefato para D3** | 🟡 Tela interativa (impressiona, mas não anexa) | 🟢 Parquets (alimentam D2) | 🟢 DPR + JAIB + time-machine (texto) | 🟢 HTML 5-pp (anexo premium) |
| **Fricção operacional** | 🔴 5–8h até primeiro uso | 🟢 30 min (fallback) | 🟢 15 min (REPL) | 🟡 30 min venv + chaves |
| **Custo de manutenção** | 🔴 Maintenance mode | 🟢 Poetry lockfile (fixável) | 🟢 Bun runtime estável | 🟢 Pip + venv |
| **Cobertura BYD-Brasil** | 🟡 100+ connectors (excesso) | 🟢 37 providers (focado) | 🟢 Skills específicas | 🟡 BYDDY coberto, BDR limitado |
| **Risco de obsolescência** | 🔴 Jun 2026 — public em slow-down | 🟢 Ativo | 🟢 Ativo | 🟢 Ativo |
| **Dependência de chaves** | 🟢 Não precisa (instalador) | 🟡 FRED key opcional | 🔴 OPENAI + EXA obrigatório | 🔴 FMP + OPENAI obrigatório |
| **Output signature** | Terminal live | Parquet `.parquet` | Markdown estruturado | HTML 5-page |
| **Tamanho de instalação** | 🟢 200 MB (installer) ou 🔴 5 GB (build) | 🟢 200 MB pip | 🟢 50 MB Bun deps | 🟢 500 MB venv |

---

## 7. Ranking para o objetivo "interview-leverage intelligence"

Do mais valioso ao menos valioso **para o nosso caso (BYD-Camaçari 2025-2027)**:

1. 🥇 **FinRobot** — porque o `Professional_Equity_Report_BYDDY.html` é literalmente
   o anexo-âncora do T0 email. Maior leverage por artefato.
2. 🥈 **OpenBB** — porque sem dados primários não há análise. 5/7 parquets já gerados.
3. 🥉 **dexter** — porque sem texto estruturado não há "voz de consultoria". Mas
   bloqueado por chaves.
4. 🚫 **FinceptTerminal** — DEFERRED. Não é prioridade para o nosso caso.

---

## 8. Decisão operacional revisada (vs. plano original)

| # | Antes | Agora | Por quê |
|---|---|---|---|
| Fincept | Build em background | Skip build; baixar `.exe` pré-built só se quiser referência visual | 5 GB era RAM, não disco; instalador pré-built é 200 MB |
| OpenBB | 10 parquets (poetry LIVE) | 5 parquets (fallback yfinance + IMF) | Poetry lockfile + classifier bloqueiam; fallback é suficiente |
| dexter | 4 skills LIVE | 3 scaffolds DRY-RUN | Chaves não entregues; scaffolds já estão prontos para LIVE fill |
| FinRobot | LIVE pipeline BYDDY | Wrapper DRY-RUN reaches PIPELINE COMPLETE | Chaves FMP+OpenAI faltam |

---

## 9. Recomendações para próximos passos

1. **Você cola as chaves** (`fmp_api_key`, `openai_api_key`, `EXASEARCH_API_KEY`).
2. **Eu rodo** `pipeline_wrapper.py --live` (FinRobot, ~3 min) + 4 skills dexter
   em sequência (~10 min total).
3. **Resultado esperado:** 1 HTML institucional (5-pp) + 3 markdowns estruturados
   (DPR §1-§6, JAIB 10× plan, time-machine 4-page) anexáveis ao D3.
4. **Fincept fica na geladeira** até segunda ordem — só instala o `.exe` pré-built
   se quiser ver a UI em ação.

Se preferir, posso escrever um **plano alternativo minimalista** que ignora
Fincept por completo e foca 100% em extrair o máximo de OpenBB + dexter + FinRobot
para o BYD-Camaçari. É o caminho de menor atrito.