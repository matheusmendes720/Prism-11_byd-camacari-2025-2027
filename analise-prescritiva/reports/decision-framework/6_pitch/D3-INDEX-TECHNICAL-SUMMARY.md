# D3 — Sistema de Decisão Prescritiva

## Sumário Técnico de Índice

**Projeto:** BYD Camaçari 2025-2027  
**Versão:** 2.1  
**Última Atualização:** Julho 2026  
**Idioma:** Português (pt-BR)

---

## Visão Geral do Framework

O D3 (Decisão Prescritiva Operacional) é um sistema de suporte à decisão estratégica para a planta BYD em Camaçari, Bahia. O framework integra **11 dimensões de risco**, **4 ações corretivas**, **28 acoplamentos** entre dimensões, **4 gates de decisão** e **5 personas executivas**.

### Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────┐
│  Layer 7: GOVERNANCE     — Supervisão executiva    │
├─────────────────────────────────────────────────────┤
│  Layer 6: LEARNING        — Recalibração trimestral │
├─────────────────────────────────────────────────────┤
│  Layer 5: ACTION          — Registro de ações      │
├─────────────────────────────────────────────────────┤
│  Layer 4: DECISION        — 12 árvores de decisão  │
├─────────────────────────────────────────────────────┤
│  Layer 3: SIGNAL          — Matriz de gatilhos     │
├─────────────────────────────────────────────────────┤
│  Layer 2: DATA             — D2 sessões, composite │
├─────────────────────────────────────────────────────┤
│  Layer 1: FRAMEWORK       — Estrutura base         │
└─────────────────────────────────────────────────────┘
```

---

## 1. Dimensões de Risco (S1–S11)

### scores Atuais e Pesos

| Código | Dimensão | Score | Status | Peso |
|--------|-----------|-------|--------|------|
| S1 | Câmbio / FX | 65 | AMBER | 0.18 |
| S2 | Supply Chain / Lítio | 72 | AMBER | 0.16 |
| S3 | Regulatório / BNDES / ViE | 58 | AMBER | 0.18 |
| S4 | Precificação / Defensivo | 70 | AMBER | 0.16 |
| S5 | Parcerias Estratégicas | 75 | GREEN | 0.10 |
| S6 | Macro Governor | 68 | AMBER | 0.10 |
| S7 | ESG / Reputação | 92 | RED | 0.05 |
| S8 | Ramp Produtivo (SKD→CKD) | 55 | AMBER | 0.08 |
| S9 | Demanda / Crescimento | 78 | GREEN | 0.04 |
| S10 | Tarifário / Política | 85 | RED | 0.05 |
| S11 | Competitivo | 88 | RED | 0.05 |

**Composite Score Atual:** 78/100 (vulnerabilidade média-alta)

---

## 2. Ações Corretivas Principais

### ACT_HEDGE — Hedge Cambial

**Resumo:** Proteção contra variação do dólar, variando de 30% a 91% conforme cenário BNDES.

- **Custo:** R$ 19–58M/ano
- **ROI:** 5-10× em stress normal, até 30× em stress extremo
- **Fórmula:** `h* = argmin { VaR_residual(h) | VaR_residual(h) ≤ 0.20 × margem_buffer }`

### ACT_DUAL — Dual Sourcing Lítio

**Resumo:** Qualificar fornecedor alternativo (EVE Energy) para reduzir dependência da CATL.

- **HHI Atual:** 6.400 (muito alto)
- **HHI Target:** < 2.500 (saudável)
- **Investimento:** R$ 280M CAPEX + R$ 8M audit + R$ 4M/ano

### ACT_PRICING — Precificação Defensiva

**Resumo:** Sistema de desconto tierado (Tiers 0–3) baseado em cenários macro e competitivo.

- **Tier 3 (máximo):** 8% off, R$ 22,5M/ano
- **Catalog-wide:** REMOVIDO (destrói R$ 450M/ano em margem)

### ACT_ADVOCACY — Resolução Lista Suja

**Resumo:** Engajamento MPT/MTE para remover BYD da lista suja e desbloquear BNDES.

- **Custo:** R$ 25M
- **Benefício:** R$ 800M BNDES + R$ 150M economia juros
- **ROI:** 40× em 5 anos

---

## 3. Acoplamentos (Couplings)

### 5 Acoplamentos Primários

| ID | De | Para | Descrição | Impacto Real |
|----|-----|------|------------|--------------|
| c1 | S1 | S3 | Hedge 30%→91% | Depende de ViE |
| c2 | S1 | S2 | VaR 2.5× | Stress FX + supply joint |
| c3 | S1 | S4 | Ratio 9.4× | Hedge vs defensivo |
| c4 | S3 | S4 | ViE=10% | Break-even defensivo |
| c5 | S6 | S1 | ×1.0/1.5/2.0 | Macro rescales hedge |

### Acoplamentos Secundários (seleção)

- **c9 (S5→S2):** Parcerias potenciam supply (ROI 2099%)
- **c17 (S7→S3):** Lista suja bloqueia BNDES
- **c20 (S2→S1):** Lithium shock pressiona PTAX
- **c28 (S7→S11):** ESG afeta percepção competitiva

---

## 4. Gates de Decisão

| Gate | Valor | Dono | Critério | Timeline |
|------|-------|------|----------|----------|
| G0 | R$ 150k | CSO + CFO | Piloto 8 semanas | Sem 1–8 |
| G1 | R$ 800k | CFO + CSO | Trigger matrix + 12 árvores | Q3 2026 |
| G2 | R$ 1.2M | CFO + CEO | Auto-trigger + NPV live | Q4 2026 |
| G3 | R$ 1M + 200k/trimestre | Board + HQ China | MC + sensitivity + game theory | Q1 2027+ |

---

## 5. Personas Executivas

| ID | Role | Gate | Ações Principais |
|----|------|------|-------------------|
| P1 | CFO / Aprovador financeiro | G0–G3 | Aprova gates, valida ROI, decide hedge |
| P2 | CEO / Sponsor executivo | G2–G3 | Aprova Fase 2+, valida posicionamento |
| P3 | CSO / Dono do framework | G0–G3 | Opera trigger matrix, coordena árvores |
| P4 | Dir. Industrial / Executor | G1 | Executa ações S8, valida SKD→CKD |
| P5 | Head Supply / Especialista | G0–G1 | Valida HHI, alerta lítio spike |

---

## 6. Visualizações Disponíveis

O D3-PITCH-GRAPH.html oferece as seguintes vistas interativas:

| View | Descrição |
|------|-----------|
| **Overview** | Visão geral com composite central e 11 dimensões orbitando |
| **RED Flags** | Foco nos 3 riscos críticos (S7, S10, S11) |
| **Couplings** | Mapa de 28 conexões entre dimensões |
| **Gates** | Fluxo sequencial G0→G1→G2→G3 |
| **Personas** | Distribuição por stakeholder executivo |
| **Flow** | Fluxo de decisão trigger→policy→ação |
| **Timeline** | Linha do tempo com marcos e gatilhos |
| **Scenarios** | 5 cenários políticos × 3 RED flags |

---

## 7. Métricas-Chave

| Métrica | Valor Atual |
|---------|-------------|
| Composite Score | 78/100 |
| VaR 6 meses | R$ 4,0 bi |
| Dimensões em RED | 3 (S7, S10, S11) |
| Dimensões em AMBER | 7 |
| Dimensões em GREEN | 1 (S5, S9) |
| Ações ativas | 4 |
| Gates necessários | 4 |

---

## 8. Dependências Técnicas

### Stack de Sistema

- **Bloomberg Terminal** — PTAX real-time + NDF pricing
- **Python (scipy.optimize)** — Solver SLSQP para hedge
- **SAP TRM** — Gestão de treasury
- **AWS S3** — Audit log
- **Slack bots** — #fx-alerts, #pricing-alerts, #s7-advocacy
- **Jira** — Qualification tickets e advocacy tasks
- **PowerBI** — Dashboard de progresso

### Fontes de Dados

- BCB SGS 10813 (PTAX)
- MSCI ESG API
- API MTE (lista suja)
- Contabilidade interna BYD

---

## 9. Workflow de Atualização

```
1. DATA → Signal (diário)
   └─ Risk Officer puxa PTAX 9h → calcula σ → atualiza h*

2. SIGNAL → Decision (semanal)
   └─ CSO revisa trigger matrix → dispara decision trees

3. DECISION → Action (reativo 24h)
   └─ Committee aprova tier + escopo → Marketing ativa

4. ACTION → Learning (trimestral)
   └─ Post-mortem → recalibração → atualiza dimData
```

---

## 10. Contato e Donos

| Área | Responsável | Approver |
|------|-------------|----------|
| Hedge FX | Risk Officer | CFO |
| Dual Sourcing | Head Supply | COO |
| Precificação | CMO | CSO |
| Advocacy S7 | Head Gov Relations | CFO + CEO |

---

## Referências

- [D3-PITCH-GRAPH.html](./D3-PITCH-GRAPH.html) — Visualização interativa completa
- [D3-EXECUTIVE-BRIEF](./D3-EXECUTIVE-BRIEF.md) — Brief executivo
- [D3-PITCH-1PAGE](./D3-PITCH-1PAGE.md) — Resumo de 1 página
- [DECISION-FRAMEWORK.md](../1_framework/DECISION-FRAMEWORK.md) — Arquitetura completa

---

*Documento gerado automaticamente a partir do framework D3 v2.1*
