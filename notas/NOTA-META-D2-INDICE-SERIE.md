---
slug: notas-meta-d2-indice-serie
title: "Notas-Meta D2 — Índice da Série · 6 Notas de Meta-Aprendizado sobre a Base D2 do BYD Camaçari"
ueid: ikigai:nota:d2-meta-indice-serie:20260825
entity_type: artifact
parent_ueid: ikigai:deliverable:byd-analise-prescritiva:b7c4a1e9
tags: [d2, meta-learning, indice, serie-notas, trilha-aprendizado, capas]
custom:
  _purpose: >-
    Índice / capa da série de 9 Notas-Meta D2 (6 originais da pedagogia
    em camadas L0-L6 + LAB + transversais + 3 cross-version comparando
    D2 v1 → v2 → v2.1 → v2.2 e a transição para D3) sobre a base
    didática D2 (Análise de Vulnerabilidade Econométrica BYD Camaçari
    2025-2027). Permite navegação rápida entre as notas, define a
    ordem de leitura recomendada por perfil, e explicita as conexões
    entre as notas e a base original em _study_notes/.
  _audience: engenheiro-junior, analista-pleno, pesquisador, new-joiner
  _data_sources:
    - /d2-econometric-vulnerability/_study_notes/README.md
    - /d2-econometric-vulnerability/_study_notes/00-INDEX.md
    - todas as 6 Notas-Meta D2 (links abaixo)
  _outputs:
    - indice-serie
    - trilha-leitura-recomendada
    - navegacao-rapida
    - mapa-conexoes-notas-base
  _success_criteria: >-
    leitor consegue escolher trilha por perfil e acessar cada nota em <30s.
---

# Notas-Meta D2 — Índice da Série

> **Versão**: 2.0 — 25/ago/2026
> **Audiência**: qualquer pessoa chegando à base D2 e querendo aprender como estudá-la.
> **Propósito**: capa/índice de navegação rápida entre as 9 Notas-Meta D2 (7 originais + 3 cross-version).
> **Companhia a**: [`/HUB.md`](../../HUB.md) (índice cruzado cross-tema de toda documentação).

---

## §0. O que é esta série

Esta é uma série de **9 notas de meta-aprendizado** escritas para acompanhar o estudo da **base D2 do BYD Camaçari 2025-2027**. Cada nota é uma "ponte" entre um layer específico (L0, L1, L2, L3, L4-L6, LAB, transversais) ou entre versões do D2 (v1 → v2 → v2.1 → v2.2) e a pedagogia em camadas da base — o que o aluno precisa internalizar, quais métricas decorar, quais armadilhas evitar.

A série foi desenhada para funcionar como:
- **Pré-leitura** antes de entrar nos docs oficiais da base.
- **Revisão paralela** durante o estudo (consulte a nota quando travar em um conceito).
- **Pós-leitura** como checklist de domínio (você cobriu tudo? consegue citar as 20 métricas?).

A **base canônica** (28 docs didáticos em [`_study_notes/`](../../d2-econometric-vulnerability/_study_notes/)) tem ~880 KB e ~16.500 linhas. Esta série tem ~3.100 linhas — 1 nota-meta a cada ~2.750 linhas da base, mantendo uma razão de compressão ~5:1.

---

## §1. Mapa da série

```
Notas-Meta D2 (1 capa + 9 notas)

[00] Capa     →  NOTA-META-D2-INDICE-SERIE  (esta nota)
       ↓
[01] Trilha   →  NOTA-META-D2-01-TRILHA-APRENDIZADO  (visão geral)
       ↓
[02] L0       →  NOTA-META-D2-02-L0-FUNDAMENTOS  (alfabeto)
       ↓
[03] L1       →  NOTA-META-D2-03-L1-EDA  (primeira leitura)
       ↓
[04] L2       →  NOTA-META-D2-04-L2-PREDITIVA  (GARCH + MC)
       ↓
[05] L3       →  NOTA-META-D2-05-L3-PRESCRITIVA  (matrizes + triggers)
       ↓
[06] L4-L6+LAB → NOTA-META-D2-06-L4-L6-LAB  (comunicação + cauda + LAB)
       ↓
[07-A] Drift Métricas      → NOTA-META-D2-07A-DRIFT-METRICAS
[07-B] Drift Arquitetura  → NOTA-META-D2-07B-DRIFT-ARQUITETURA
[07-C] Drift Gaps         → NOTA-META-D2-07C-DRIFT-GAPS
```

---

## §2. As 6 notas (visão rápida)

### §2.1 [Nota-Meta #01 — Trilha de Aprendizado](./NOTA-META-D2-01-TRILHA-APRENDIZADO.md)

| | |
|---|---|
| **Função** | Visão geral da base D2, trilha por perfil, 14 métricas-mestre, 5 técnicas de meta-learning, 10 armadilhas comuns |
| **Tamanho** | ~27 KB, ~700 linhas |
| **Tempo de leitura** | 30-45 min |
| **Quando ler** | **PRIMEIRO** — antes de qualquer outro doc da base |
| **Público** | qualquer pessoa chegando ao projeto |

**Takeaways principais:**
1. A base é organizada em 6 camadas progressivas (L0 → L6) + 2 transversais (AA, BB) + glossário ZZ.
2. 14 métricas-mestre com números canônicos do PTAX (σ 14,19%, VaR R$ 6,43 bi, composite 71,8, etc.).
3. 5 perfis de leitura: júnior (30 min), pleno (3h), sênior (7h), executivo (15 min), acadêmico (25h).
4. 10 armadilhas comuns ao estudar D2 — como evitar.

### §2.2 [Nota-Meta #02 — L0 Fundamentos](./NOTA-META-D2-02-L0-FUNDAMENTOS.md)

| | |
|---|---|
| **Função** | Vocabulário-mestre: 14 métricas + 5 distribuições + 7 armadilhas |
| **Tamanho** | ~20 KB, ~470 linhas |
| **Tempo de leitura** | 60-90 min (com exercícios) |
| **Quando ler** | Depois da #01, antes de L1.x |
| **Público** | engenheiro-júnior, analista-pleno |

**Takeaways principais:**
1. σ 14,19% anualizada = √252 × σ_daily. Sempre cite a janela.
2. VaR = percentil; CVaR = média da cauda. CVaR ≥ VaR sempre.
3. GARCH α=0,0488, β=0,9418, ν=6,99. β alto = vol persistente. ν baixo = cauda pesada.
4. PTAX tem kurt=4,88 (fat tails). Normal subestima VaR em 30-50%.

### §2.3 [Nota-Meta #03 — L1 EDA](./NOTA-META-D2-03-L1-EDA.md)

| | |
|---|---|
| **Função** | 10 passos da EDA PTAX + supply chain + 31 variáveis V1-V31 |
| **Tamanho** | ~24 KB, ~480 linhas |
| **Tempo de leitura** | 90-120 min (com exercícios) |
| **Quando ler** | Depois de #02, antes de L2.x |
| **Público** | analista-pleno, modelador |

**Takeaways principais:**
1. Os 10 passos da EDA são a "receita" para qualquer série temporal financeira.
2. PTAX tem kurt=4,88 (fat tails pesadas). Normal subestima VaR em 30-50%.
3. HHI é quadrático. HHI bateria LFP = 4.850 (CATL 95,7%) é o maior risco de supply chain.
4. ACF dos retornos² é a evidência de GARCH.

### §2.4 [Nota-Meta #04 — L2 Preditiva](./NOTA-META-D2-04-L2-PREDITIVA.md)

| | |
|---|---|
| **Função** | GARCH(1,1)-t + MC stress test + VaR refresh vs v2.0.1 |
| **Tamanho** | ~21 KB, ~450 linhas |
| **Tempo de leitura** | 90-120 min (com exercícios) |
| **Quando ler** | Depois de #03, antes de L3.x |
| **Público** | modelador, risk officer |

**Takeaways principais:**
1. Modele log-retornos, não PTAX em nível. Estacionariedade + aditividade.
2. GARCH(1,1)-t com α=0,0488, β=0,9418, ν=6,99. β alto = vol persistente.
3. VaR refresh R$ 6,43 bi vs VaR v2.0.1 R$ 8,21 bi. Diferença = MC multivariado 4-shock (Cholesky).
4. Tariff é o maior contributor VaR (29%), não FX.

### §2.5 [Nota-Meta #05 — L3 Prescritiva](./NOTA-META-D2-05-L3-PRESCRITIVA.md)

| | |
|---|---|
| **Função** | Matriz S3×S6 (12 cells) + trigger matrix (30+) + RACI 17 personas + action register 25 ações |
| **Tamanho** | ~23 KB, ~470 linhas |
| **Tempo de leitura** | 90-120 min (com exercícios) |
| **Quando ler** | Depois de #04, antes de L4 |
| **Público** | risk officer, COO, PMO |

**Takeaways principais:**
1. O salto conceitual L2→L3 é "previsão → prescrição". VaR diz "qual a perda esperada". L3 diz "o que fazer".
2. Os 4 macro-estados (GREEN/AMBER/RED/KILL) reduzem o contínuo em decisões discretas.
3. Matriz S3 × S6 = 12 cells com composite, hedge ratio, e custo. Composite ≥ 88 = modo crise.
4. 30+ triggers detectam mudança automaticamente. Latência alvo: 5 min AMBER, 60 min RED.

### §2.6 [Nota-Meta #06 — L4-L6 + LAB + Transversais](./NOTA-META-D2-06-L4-L6-LAB.md)

| | |
|---|---|
| **Função** | Comunicação Conselho + calibração Kupiec/Christoffersen + EVT cauda + LAB hands-on + transversais AA/BB/ZZ |
| **Tamanho** | ~27 KB, ~530 linhas |
| **Tempo de leitura** | 120-180 min |
| **Quando ler** | Por último, depois de #05 |
| **Público** | risk officer sênior, auditor, pesquisador |

**Takeaways principais:**
1. L4 é sobre comunicação, não sobre modelo. Stakeholders diferentes precisam de mensagens diferentes.
2. L5 é sobre auditoria de modelo. Kupiec testa frequência; Christoffersen testa independência; PIT testa calibração global.
3. L6 é sobre cauda extrema. EVT com GPD/GEV é matematicamente superior a VaR Normal para VaR 99%+.
4. Ciclo de learning é obrigatório. Recalibre trimestralmente.

### §2.7 [Nota-Meta #07-A — Drift de Métricas](./NOTA-META-D2-07A-DRIFT-METRICAS.md)

| | |
|---|---|
| **Função** | Drift cross-version das métricas canônicas: σ PTAX, VaR/CVaR, composite, HHI, pesos, NPV, backtesting |
| **Tamanho** | ~20 KB, ~330 linhas |
| **Tempo de leitura** | 30-45 min |
| **Quando ler** | Quando precisar entender por que o número de hoje ≠ número de ontem |
| **Público** | risk officer, auditor, pesquisador |

**Takeaways principais:**
1. σ PTAX drift: 14,19% → 14,41% → ~16,0% (janela rolante, não regressão).
2. VaR drift: R$ 2,10 bi → R$ 6,43 bi → R$ 8,21 bi (cada upgrade captura mais cenários).
3. Composite drift: 71,8 → 50,3 RED (realinhamento com realized risks, não regressão).
4. Pesos drift: 4 dims sum=1,00 → 11 dims sum=1,15 → renormalizado sum=1,00 (bug histórico corrigido).

### §2.8 [Nota-Meta #07-B — Drift de Arquitetura](./NOTA-META-D2-07B-DRIFT-ARQUITETURA.md)

| | |
|---|---|
| **Função** | Evolução da arquitetura: 6 outputs HTML, 15 notebooks canônicos, 22 insights surgiram/desapareceram |
| **Tamanho** | ~24 KB, ~410 linhas |
| **Tempo de leitura** | 30-45 min |
| **Quando ler** | Quando precisar entender como o esqueleto do D2 evoluiu |
| **Público** | engenheiro, analista, modelador |

**Takeaways principais:**
1. 6 outputs HTML canônicos — 5 shells Plotly + 1 motor MC inline.
2. 15 notebooks canônicos — 8 D2 (NB-01..NB-08) + 7 D3 (NB-09..NB-15).
3. 3 grandes transições: 5 dims → 6 dims → 8 NBs paralelos → 11 dims acopladas → 11+parC.
4. 22 insights canônicos — 10 invariantes cross-version (CATL 95,7%, fórmula composite 4-dim, etc.).
5. 5 recalibrações empíricas causaram composite 71,8 → 50,3 RED.

### §2.9 [Nota-Meta #07-C — Drift de Gaps](./NOTA-META-D2-07C-DRIFT-GAPS.md)

| | |
|---|---|
| **Função** | Os 10 gaps D2-AUDIT, sua resolução cross-version, 3 gaps abertos para v3.0 |
| **Tamanho** | ~27 KB, ~430 linhas |
| **Tempo de leitura** | 30-45 min |
| **Quando ler** | Quando precisar entender por que o D3 é prescritivo (e o D2 não era) |
| **Público** | risk officer, COO, Conselho, auditor |

**Takeaways principais:**
1. Os 10 gaps D2-AUDIT foram a fundação do D3 — auditoria de 21/jul/2026 foi o pivot.
2. 7 gaps RESOLVIDO, 2 PARCIAL, 3 OPEN para v3.0. Resolution rate 70% em 6 meses.
3. Gap #1 (acoplamentos) era o mais estrutural — sem couplings, framework era "cardápio".
4. Gap #10 (pergunta de decisão) era o mais político — CONSELHO-MEMO-2026-08-15 responde em linguagem de Conselho.
5. ROI 200×, payback < 1 mês — R$ 3M de gap closure gera R$ 200M/ano de stress evitado.

---

## §3. Trilha de leitura recomendada por perfil

### §3.1 Júnior (engenheiro de dados, 0-2 anos) — ~2-3 horas

```
#01 (30 min) → #02 (60 min) → #03 (90 min)
       ↓
              (parar aqui, suficiente para júnior)
```

**Após ler:** você entende o vocabulário do D2 e sabe interpretar qualquer output. Pode ser produtivo em reuniões.

### §3.2 Pleno (data scientist, 2-5 anos) — ~6-8 horas

```
#01 → #02 → #03 → #04 (90 min) → #05 (90 min)
       ↓
              (parar aqui, suficiente para pleno)
```

**Após ler:** você consegue reproduzir a EDA, fit GARCH, calcular VaR, e construir uma matriz de decisão. Pode auditar a base sozinho.

### §3.3 Sênior (risk officer, lead técnico) — ~12-15 horas

```
#01 → #02 → #03 → #04 → #05 → #06 (180 min)
       ↓
              (parar aqui, suficiente para sênior)
```

**Após ler:** você domina calibração, interpretabilidade, risco de cauda, e pode apresentar para Conselho / Board global.

### §3.4 Cross-version drift (opcional, ~3-4 horas)

```
#07-A (45 min) → #07-B (45 min) → #07-C (45 min)
       ↓
              (parar aqui — entendeu por que cada métrica mudou)
```

**Após ler:** você entende por que composite foi de 71,8 → 50,3, por que VaR refresh → v2.0.1 são 6,43 → 8,21, e por que cada um dos 10 gaps D2-AUDIT foi resolvido.

### §3.5 Acadêmico / Pesquisador — ~25-35 horas

Adicione:
- Leitura sequencial completa da base [`_study_notes/`](../../d2-econometric-vulnerability/_study_notes/) (16.500 linhas).
- Leitura de 3 livros de [`BB`](../../d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md) (Hull, Tsay, McNeil-Frey-Embrechts).
- Reprodução executandoendo todos os 15 notebooks canônicos NB-01..NB-15.
- **Toda a série** Notas-Meta D2 #01..#07-A/B/C.

---

## §4. Mapa de conexões (notas ↔ base canônica)

| Nota-Meta | Cobre | Cross-refs principais |
|---|---|---|
| **#01** | Visão geral | [`README.md`](../../d2-econometric-vulnerability/_study_notes/README.md), [`00-INDEX.md`](../../d2-econometric-vulnerability/_study_notes/00-INDEX.md), [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md) |
| **#02** | L0 | [`L0.0-glossario-metricas.md`](../../d2-econometric-vulnerability/_study_notes/L0.0-glossario-metricas.md), [`L0.2-estatistica-descritiva.md`](../../d2-econometric-vulnerability/_study_notes/L0.2-estatistica-descritiva.md), [`L0.3-probabilidade-distribuicoes.md`](../../d2-econometric-vulnerability/_study_notes/L0.3-probabilidade-distribuicoes.md), [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) |
| **#03** | L1 | [`L1.0-eda-pTAX-passo-a-passo.md`](../../d2-econometric-vulnerability/_study_notes/L1.0-eda-pTAX-passo-a-passo.md), [`L1.1-eda-supply-chain-trade-balance.md`](../../d2-econometric-vulnerability/_study_notes/L1.1-eda-supply-chain-trade-balance.md), [`L1.2-eda-variaveis-expandidas-matriz.md`](../../d2-econometric-vulnerability/_study_notes/L1.2-eda-variaveis-expandidas-matriz.md) |
| **#04** | L2 | [`L2.0-arquitetura-modelagem.md`](../../d2-econometric-vulnerability/_study_notes/L2.0-arquitetura-modelagem.md), [`L2.1-modelos-vol-garch-gjr.md`](../../d2-econometric-vulnerability/_study_notes/L2.1-modelos-vol-garch-gjr.md), [`L2.2-cambio-stress-test-monte-carlo.md`](../../d2-econometric-vulnerability/_study_notes/L2.2-cambio-stress-test-monte-carlo.md) |
| **#05** | L3 | [`L3.0-matrizes-decisao.md`](../../d2-econometric-vulnerability/_study_notes/L3.0-matrizes-decisao.md), [`L3.1-trigger-matrix-auto-trigger.md`](../../d2-econometric-vulnerability/_study_notes/L3.1-trigger-matrix-auto-trigger.md), [`L3.2-raci-action-register.md`](../../d2-econometric-vulnerability/_study_notes/L3.2-raci-action-register.md) |
| **#06** | L4-L6 + LAB + transversais | [`L4.0-comunicacao-conselho.md`](../../d2-econometric-vulnerability/_study_notes/L4.0-comunicacao-conselho.md), [`L4.1-dashboards-executivos.md`](../../d2-econometric-vulnerability/_study_notes/L4.1-dashboards-executivos.md), [`L4.2-gap-modelo-humano.md`](../../d2-econometric-vulnerability/_study_notes/L4.2-gap-modelo-humano.md), [`L5.0-calibracao-regime-switching.md`](../../d2-econometric-vulnerability/_study_notes/L5.0-calibracao-regime-switching.md), [`L5.1-interpretabilidade-shap-lime.md`](../../d2-econometric-vulnerability/_study_notes/L5.1-interpretabilidade-shap-lime.md), [`L6.0-risco-cauda-extremo.md`](../../d2-econometric-vulnerability/_study_notes/L6.0-risco-cauda-extremo.md), [`L6.1-stress-testing-institucional.md`](../../d2-econometric-vulnerability/_study_notes/L6.1-stress-testing-institucional.md), [`L6.2-mesa-risco-operacional.md`](../../d2-econometric-vulnerability/_study_notes/L6.2-mesa-risco-operacional.md), [`98-LAB-ADVANCED.md`](../../d2-econometric-vulnerability/_study_notes/98-LAB-ADVANCED.md), [`99-LAB-EXERCISES.md`](../../d2-econometric-vulnerability/_study_notes/99-LAB-EXERCISES.md), [`AA-como-ler-este-projeto.md`](../../d2-econometric-vulnerability/_study_notes/AA-como-ler-este-projeto.md), [`BB-bibliografia-leituras-recomendadas.md`](../../d2-econometric-vulnerability/_study_notes/BB-bibliografia-leituras-recomendadas.md), [`ZZ-glossario-formulas.md`](../../d2-econometric-vulnerability/_study_notes/ZZ-glossario-formulas.md) |

---

## §5. As 20 métricas-mestre que você precisa decorar (resumo das 6 notas)

Aqui está o resumo consolidado das **20 métricas mais importantes** do D2 — meta-test ao final do estudo da série:

| # | Métrica | Valor canônico D2 | Onde aparece |
|---|---|---|---|
| 1 | σ anualizada PTAX (30d) | **14,19%** | #02, #03 |
| 2 | σ anualizada PTAX (BCB SGS 10y) | **14,86%** | #02, #04 |
| 3 | VaR 95% 6m (refresh) | **R$ 6,43 bi** | #04, #06 |
| 4 | CVaR 95% 6m (refresh) | **R$ 8,04 bi** | #04, #06 |
| 5 | VaR 95% 6m (v2.0.1 4-shock) | **R$ 8,21 bi** | #04, #05 |
| 6 | CVaR 95% 6m (v2.0.1 4-shock) | **R$ 10,14 bi** | #04, #05 |
| 7 | GARCH(1,1)-t α | **0,0488** | #04, #06 |
| 8 | GARCH(1,1)-t β | **0,9418** | #04, #06 |
| 9 | GARCH(1,1)-t ν | **6,99** | #04, #06 |
| 10 | Persistence (α+β) | **0,9906** | #04, #06 |
| 11 | Half-life do choque | **73,3 dias** | #04, #06 |
| 12 | Composite D2 stakeholder 4-dim | **71,8 / 100** | #01, #05 |
| 13 | Composite v2.0.1 (após recalibração) | **50,3 / 100** | #01, #05 |
| 14 | Composite técnico 11-dim | **78 / 100** | #01, #05 |
| 15 | Skewness PTAX | **+0,152** | #02 |
| 16 | Kurtosis PTAX | **+4,88** | #02 |
| 17 | HHI Bateria LFP | **4.850** | #03 |
| 18 | HHI Lítio | **3.400** | #03 |
| 19 | HHI Semicondutor | **2.925** | #03 |
| 20 | Composite weights (câmbio/supply/regulatório/competitivo) | **0,30/0,30/0,20/0,20** | #05 |

> **Meta-test:** ao terminar a série, escreva essas 20 em folha em branco. 18+/20 = pronto para auditar D2.

---

## §6. Próximas etapas após a série

### §6.1 Para quem quer **operar** o framework em produção

→ [`/HUB.md`](../../HUB.md) — índice cruzado de toda documentação (D2 + D3 + outros).

→ [`/analise-prescritiva/notebooks!/LINHAGEM.md`](../../analise-prescritiva/notebooks!/LINHAGEM.md) — linhagem técnica por fase (D3 framework prescritivo).

### §6.2 Para quem quer **aprender a programar** os modelos

→ Executar [`NB-01-ptax-garch.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-01-ptax-garch/nb-01-ptax-garch.ipynb) (entrada PTAX + GARCH).

→ Executar [`NB-15-final-dashboard.ipynb`](../../analise-prescritiva/notebooks!/02-canonicos/nb-15-final-dashboard/nb-15-final-dashboard.ipynb) (dashboard final).

### §6.3 Para quem quer **validar com backtest**

→ [`/analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md`](../../analise-prescritiva/notebooks!/EVOLUÇÃO-VERSÕES.md) — síntese cross-version D2 v1 → v2.2 → D3.

### §6.4 Para quem quer **reaproveitar a estrutura** em outro projeto

A base D2 é reaproveitável. Copie a estrutura L0-L6 + LAB + transversais; substitua os números (PTAX → outro ativo); mantenha os cross-refs validados por [`_validate_xrefs.py`](../../d2-econometric-vulnerability/_study_notes/_validate_xrefs.py).

---

## §7. Mapa final — saída da série

```
Notas-Meta D2 (capa + 6 notas = 7 arquivos .md, ~3.100 linhas)
       ↓
[entrada: novo usuário]
       ↓
Lê #01 (trilha) → escolhe perfil → segue trilha
       ↓
[júnior] #01 → #02 → #03 (para)
[pleno] #01 → #02 → #03 → #04 → #05 (para)
[sênior] #01 → #02 → #03 → #04 → #05 → #06 (para)
       ↓
[saída] /HUB.md + LINHAGEM.md para D3 / outros casos
```

---

## §8. Índice de arquivos da série

```
/notas/
├── NOTA-META-D2-INDICE-SERIE.md           (esta nota — capa)
├── NOTA-META-D2-01-TRILHA-APRENDIZADO.md  (~27 KB, ~700 linhas)
├── NOTA-META-D2-02-L0-FUNDAMENTOS.md      (~20 KB, ~470 linhas)
├── NOTA-META-D2-03-L1-EDA.md             (~24 KB, ~480 linhas)
├── NOTA-META-D2-04-L2-PREDITIVA.md        (~21 KB, ~450 linhas)
├── NOTA-META-D2-05-L3-PRESCRITIVA.md     (~23 KB, ~470 linhas)
└── NOTA-META-D2-06-L4-L6-LAB.md          (~27 KB, ~530 linhas)

Total: 7 arquivos, ~142 KB, ~3.100 linhas
```

---

*Versão 1.0 — 25/ago/2026 — escrita como capa/índice da série Notas-Meta D2.*

*Para começar agora: abra [Nota-Meta #01 — Trilha de Aprendizado](./NOTA-META-D2-01-TRILHA-APRENDIZADO.md).*