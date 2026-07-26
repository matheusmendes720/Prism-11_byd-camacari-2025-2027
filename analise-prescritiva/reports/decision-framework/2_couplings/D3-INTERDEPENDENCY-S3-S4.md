# D3 — Interdependência S3 ↔ S4: Pricing defensivo condicionado a BNDES (ViE)

**Documento de análise** · Complementa `D2-AUDIT.md` (gap #1) · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md` e `D3-INTERDEPENDENCY-S1-S4.md`
**Data**: 21/jul/2026
**Status**: Working draft

> ⚠️ **ATUALIZAÇÃO 21/jul/2026**: Recálculo quantitativo (ver [D3-RECALIBRATION-S3-S4.md](./D3-RECALIBRATION-S3-S4.md)) confirma a recomendação D3 v0.4 com rigor adicional: **catalog-wide defensivo é unviable em TODOS os 4 cenários** (ROI −60% a −77%, break-even ViE inexistente). **Targeted Tier 2 (R$ 15M) é viável em qualquer cenário** (ViE=0%, ROI +250% a +650%). **Hybrid (catalog R$ 2k + targeted R$ 2.5k) tem break-even ViE=8% — não competitivo**. Recomendação: REMOVER catalog-wide do action register; usar tier system Tier 0/1/2/3 (R$ 0/1.5/3/4.5k) sempre.

---

## 1. Por que esta análise

Em `D3-INTERDEPENDENCY-S1-S4.md` mostramos que o pricing defensivo pode ter ROI de **−67% a +233%** dependendo da **estrutura** (catalog-wide vs targeted). Mas a estrutura não é decisão de marketing — é consequência de outro acoplamento: **o status do BNDES (S3) muda a margem disponível por unidade**, o que muda a viabilidade econômica do defensivo.

O acoplamento é direto:
- **S3 mais adverso** → BNDES funding fica parcial/total → **ViE residual cai** → **margem por unidade disponível cai** → **defensivo fica menos viável** (consome proporcionalmente mais da margem restante)
- **S3 mais favorável** → BNDES funding completo → **ViE residual sobe** → **margem por unidade sobe** → **defensivo vira aposta ganha**

D2 prescreve defensivo catalog-wide (R$ 225M) sem condicionar ao S3. Esta análise mostra que **defensivo deveria ser ativado (catalog-wide) só a partir de S3 Continuidade** e que em **Rollback Total** a estrutura deveria ser obrigatoriamente targeted (ou cortado).

---

## 2. A mecânica do acoplamento

### 2.1 Cadeia causal

```
S3 status (BNDES funding) 
   ↓
ViE residual (% funding externo preservado)
   ↓
Working capital disponível → margem por unidade
   ↓
Margem por unidade × 5k unidades em risco = benefício do defensivo
   ↓
Benefício vs custo R$ 225M (catalog) ou R$ 22.5M (targeted) = ROI
```

### 2.2 Parâmetros do modelo

- **VGV 6m**: R$ 30B (D2 baseline)
- **Volume 6m**: 50k unidades
- **Volume protegido pelo defensivo**: 5k unidades (D2 S4: 1.5pp de share preservation)
- **Catalog price médio**: R$ 300k
- **Defensivo price cut**: R$ 4.5k/unit (1.5% do catálogo)
- **Margem base**: 5% de VGV = R$ 15k/unit (sem BNDES)
- **ViE = % funding BNDES preservado** (0% = Rollback Total, 25% = Expansão)

### 2.3 Margem por unidade por cenário S3

| S3 | ViE | Margem/unit | % da margem consumida por defensivo (catalog-wide) |
|---|---|---|---|
| Expansão | 25% | R$ 90k | **5%** |
| Continuidade | 18% | R$ 69k | **7%** |
| Rollback Parcial | 10% | R$ 45k | **10%** ← break-even |
| Rollback Total | 0% | R$ 15k | **30%** |

**Fonte**: modelo `D3-INTERDEPENDENCY-S3-S4` (parâmetros: `params_s3s4`). Ver `figures/fig-d3-s3s4-2-margin-consumed.png`.

**Insight 1**: em **Rollback Total**, o defensivo catalog-wide consome **30% da margem por unidade**. Cada R$ 4.5k de corte de preço vira R$ 0.30 de cada R$ 1.00 de margem que resta — o programa sangra. Em Expansão, esse mesmo corte consome apenas 5% da margem — administrável.

---

## 3. A matriz 2×2: defensivo × S3

### 3.1 Resultados por combinação

| S3 | ViE | Estrutura | Custo | Benefício | ROI | Veredito |
|---|---|---|---|---|---|---|
| Expansão | 25% | catalog-wide | R$ 225M | R$ 450M | **+100%** | ✅ ótimo |
| Expansão | 25% | targeted | R$ 22.5M | R$ 450M | **+1900%** | ✅ melhor |
| Continuidade | 18% | catalog-wide | R$ 225M | R$ 345M | **+53%** | ✅ positivo |
| Continuidade | 18% | targeted | R$ 22.5M | R$ 345M | **+1433%** | ✅ melhor |
| Rollback Parcial | 10% | catalog-wide | R$ 225M | R$ 225M | **0%** | ⚠️ break-even |
| Rollback Parcial | 10% | targeted | R$ 22.5M | R$ 225M | **+900%** | ✅ ainda positivo |
| **Rollback Total** | **0%** | **catalog-wide** | **R$ 225M** | **R$ 75M** | **−67%** | ❌ **destrutivo** |
| Rollback Total | 0% | targeted | R$ 22.5M | R$ 75M | **+233%** | ✅ ainda positivo |

**Fonte**: modelo `D3-INTERDEPENDENCY-S3-S4` (`s3s4_matrix`). Ver `figures/fig-d3-s3s4-1-defensivo-roi.png`.

### 3.2 O break-even de ViE

A conta do break-even para defensivo catalog-wide é simples:

```
ROI = 0  ⟹  benefício = custo
benefício = 5k × margin_per_unit
custo = 50k × R$ 4.5k = R$ 225M

5k × margin_per_unit = R$ 225M
margin_per_unit = R$ 45k

R$ 45k de margem = R$ 300k × 15% margem efetiva
```

**ViE break-even = 10%** (Rollback Parcial é o threshold).

Para ViE > 10% (Continuidade+, Expansão), defensivo catalog-wide é **positivo**.
Para ViE = 10% (Rollback Parcial), defensivo catalog-wide é **break-even** — decisão de apetite, não de matemática.
Para ViE < 10% (Rollback Total), defensivo catalog-wide é **destrutivo**.

### 3.3 Por que targeted sobrevive a Rollback Total

Mesmo em Rollback Total, **targeted ainda dá +233%** porque o custo cai 10× (R$ 22.5M vs R$ 225M) enquanto o benefício fica idêntico (5k unidades protegidas). O ponto de dor em Rollback Total não é "defensivo não funciona" — é "defensivo catalog-wide não funciona".

**Insight 2**: defensivo **targeted é sempre positivo** em todos os cenários. A questão é só: quanto investir, e em quais modelos/mercados.

---

## 4. Recomendação

### 4.1 Árvore de decisão S3 → S4 (prescritiva)

```
S3 = Expansão (ViE ≥ 20%)
  └─ Defensivo: catalog-wide (R$ 225M)
  └─ Justificativa: ROI +100%, margem por unidade saudável
  └─ Trigger para rebaixar: ViE cai abaixo de 20%

S3 = Continuidade (10% < ViE < 20%)
  └─ Defensivo: catalog-wide (R$ 225M) com tier system
  └─ Justificativa: ROI +53% ainda positivo, mas apertado
  └─ Trigger para rebaixar: ViE cai abaixo de 10%

S3 = Rollback Parcial (ViE = 10%)
  └─ Defensivo: targeted Tier 2 (R$ 22.5M) ou break-even em catalog
  └─ Justificativa: catalog-wide dá ROI 0%, targeted dá +900%
  └─ Decisão: política do Risk Officer — proteger share a qualquer custo?

S3 = Rollback Total (ViE = 0%)
  └─ Defensivo: targeted Tier 1 (R$ 7.5M) OU zero
  └─ Justificativa: catalog-wide destrói -67%, mas targeted protege 5k críticas
  └─ Decisão: aceitação de perda de share > preservação de margem
```

### 4.2 Tier system proposto (R$ 4.5k = Tier 3 base)

| Tier | Corte | Aplicação | Custo 6m | Quando ativar |
|---|---|---|---|---|
| **Tier 0** | R$ 0 | Sem defensivo | R$ 0 | Rollback Total extremo (ViE=0, BTC<2) |
| **Tier 1** | R$ 1.5k | Trims mais altos, mercados premium | R$ 7.5M | Rollback Total (ViE=0) |
| **Tier 2** | R$ 3.0k | Trims mid + geografia crítica (SP capital, RJ) | R$ 15M | Rollback Parcial (ViE=10%) |
| **Tier 3** | R$ 4.5k | Catalog-wide (estrutura D2) | R$ 22.5M (targeted) ou R$ 225M (catalog) | Continuidade+ (ViE>10%) |

### 4.3 Coupling com S1↔S4

O defensivo **targeted** (R$ 22.5M) + **hedge FX** (R$ 24M Continuidade) = **R$ 46.5M total** de proteção de margem por 6 meses. Isso é **4.8× mais barato** que defensivo catalog-wide sozinho (R$ 225M) e oferece proteção de margem em vez de proteção de volume.

**Recomendação integrada**: em qualquer cenário S3, a combinação "hedge FX constraint-based (S1↔S3) + defensivo targeted (S3↔S4)" é a estrutura dominante. Defensivo catalog-wide deveria ser reservado apenas para Expansão (e talvez Continuidade, dependendo do apetite de share).

---

## 5. Pontos abertos / limitações

1. **Sincronia BNDES-decisão**: o BNDES não muda de status em tempo real — é um processo de 6-12 meses. Logo, o ajuste de defensivo não é mensal, é trimestral. D3 deveria ter cadence trimestral de revisão S3 → rebalancear S4.

2. **Defensivo é catch-up de S2 (supply) também**: se supply chain falha (S2 RED), a oferta cai e a demanda se realoca para Tesla/VW. Defensivo se torna não só proteção contra Model 2 mas também defesa contra perder share por falta de produto. **S2 deveria influenciar S4 tanto quanto S3** — ver `D3-INTERDEPENDENCY-S6-TRIGGERS.md` §3.3.

3. **Sincronia com cobertura FX**: hedge cobre o risco cambial mas não cobre o risco de demanda. Se defensivo é targeted e Tesla Model 2 entra em SP capital com agressividade, defensivo deveria ir de Tier 2 → Tier 3. Isso requer trigger automático (D3 Layer 2).

4. **Cesta de modelos**: o modelo assume margem média R$ 15k/unit para o catálogo inteiro. BYD Dolphin Mini, Dolphin Plus, Seal, Dolphin EV, etc. têm margens muito diferentes. Tier system deveria ser por modelo, não catalog-wide.

5. **Cenário de S3 misto**: BNDES funding pode ser parcial em capital de giro mas completo em investimento fixo. O "ViE efetivo" deveria ser uma média ponderada. Versão simplificada aqui trata ViE como uniforme — refinar em D3 v2.

---

## 6. Outputs do modelo (referência rápida)

**Arquivo**: `figures/fig-d3-s3s4-1-defensivo-roi.png` — ROI do defensivo por cenário S3 × estrutura
**Arquivo**: `figures/fig-d3-s3s4-2-margin-consumed.png` — % da margem/unit consumida pelo defensivo (5/7/10/30%)
**Arquivo**: `_model_s3s4_s6.json` (`params_s3s4`, `s3s4_matrix`, `break_even_vie`)

**Resumo executivo em 1 frase**: defensivo catalog-wide é positivo a partir de S3 Continuidade (ViE≥18%), break-even em Rollback Parcial (ViE=10%), e destrutivo em Rollback Total (ViE=0%, −67% ROI). Defensivo targeted é positivo em todos os cenários. D2 prescreve a estrutura errada — sempre targeted, com tier system.
