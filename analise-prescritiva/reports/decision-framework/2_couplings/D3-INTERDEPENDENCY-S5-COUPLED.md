# D3 — Interdependência S5 ↔ todas: Partnerships como multiplicador operacional

**Documento de análise** · Complementa `D2-AUDIT.md` (gap #1) · Companion de `D3-INTERDEPENDENCY-S1-S3.md`, `D3-INTERDEPENDENCY-S1-S2.md`, `D3-INTERDEPENDENCY-S1-S4.md`, `D3-INTERDEPENDENCY-S3-S4.md` e `D3-INTERDEPENDENCY-S6-TRIGGERS.md`
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. Por que esta análise

S5 (partnerships/stakeholders) foi modelada em D2 como **passiva** — lista de stakeholders BYD/CATL/Tesla/MDIC/BCB, sem efeito direto nas prescrições. Mas S5 afeta materialmente as outras 4 sessões operacionais (S1-S4):

- **S5↔S1**: partnerships podem oferecer **hedge alternativo offshore** (CATL parent hedge, BYD global treasury) com custo até 50 bps menor que hedge local
- **S5↔S2**: partnerships com EVE, CATL e Tier 1 alternativos determinam o **VaR supply** — qualificação EVE sozinha pode reduzir VaR supply 6m em R$ 2-3bi
- **S5↔S3**: advocacy MDIC + BYD global relationship **influenciam decisão BNDES** — partnerships efetivas melhoram a probabilidade de funding
- **S5↔S4**: stakeholder map competitivo (Tesla, VW, GM, Geely) informa **quando defensivo deve escalar**

Esta análise modela os 4 couplings de S5 com as outras sessões operacionais, fechando o último gap do D2 audit (interdependências não modeladas). Combinada com S6 (governor) e os 4 couplings já modelados, completa 9 acoplamentos totais.

---

## 2. S5 ↔ S1: Partnerships como hedge alternativo

### 2.1 Mecanismo

O hedge cambial local (BTG/Itaú/Bradesco) custa 100 bps/ano sobre a exposição. Mas partnerships estratégicas podem oferecer hedge alternativo:

- **CATL parent company** (China): pode oferecer hedge em CNY ou USD via contratos de fornecimento com cláusula cambial indexada. Custo efetivo: 30-50 bps
- **BYD global treasury** (Hong Kong): pode internalizar hedge via swaps com a matriz. Custo: 20-40 bps + complexidade regulatória
- **MDIC partnership** (Brasil-China): pode facilitar linhas de crédito bilaterais com hedge embutido. Custo: 50-70 bps

### 2.2 Parâmetros do modelo

- **Exposição FX** (D2): 0.42 × 0.70 × V = **0.294 de V**
- **VGV 6m**: R$ 30B → exposição FX 6m = R$ 8.82B
- **Custo hedge local**: 100 bps × R$ 8.82B × h* = até R$ 88M/ano (h*=100%)
- **Custo hedge partnership**: 30-50 bps × R$ 8.82B × até 30% da exposição = R$ 8-13M/ano (limitado a 30% por concentração)
- **Saving máximo**: R$ 80M/ano se 30% da exposição migrar para partnership hedge

### 2.3 Restrições

- **Concentração**: nenhum parceiro > 30% do hedge total (risco de default)
- **Regulação**: BCB exige registro de operações offshore > US$ 50M
- **Covenants BNDES**: contratos BNDES podem proibir hedge offshore (verificar caso a caso)
- **Risco operacional**: partnership hedge é menos líquido que hedge local — pode falhar em stress extremo

### 2.4 Recomendação

| Cenário | Recomendação |
|---|---|
| Expansão (h*=30%) | Manter 100% hedge local. Partnership hedge não compensa (saving baixo, complexidade alta) |
| Continuidade (h*=38.6%) | Migrar 15% para partnership hedge. Saving: R$ 20M/ano, risk concentration OK |
| RB Parcial (h*=61.7%) | Migrar 30% para partnership hedge. Saving: R$ 40M/ano, monitorar covenants BNDES |
| RB Total (h*=90.6%) | Migrar 30% para partnership hedge. Saving: R$ 26M/ano (limitado por saturação 95%) |

**Trigger para revisar**: PTAX vol 30d > 18% (vs 14.19% baseline) — partnerships offshore ficam menos atrativas em stress.

**Insight 1**: partnership hedge é mais valiosa em cenários de stress moderado (Continuidade+), onde o saving de 50 bps compensa a complexidade. Em Expansão, o saving absoluto é pequeno demais para justificar. Em RB Total, saturação limita o upside.

---

## 3. S5 ↔ S2: Partnerships como mitigador de supply risk

### 3.1 Mecanismo

Dual-sourcing via EVE qualification (R$ 280M capex, 12 meses) é o instrumento principal do S2. Mas partnerships podem acelerar/ampliar essa mitigação:

- **EVE partnership profunda** (vs transacional): joint-venture, technical transfer, raw material indexation. Reduz tempo de qualificação de 12m para 8m
- **CATL Tier 1 partnership** (lítio): contratos LP com 70% do lítio em preço fixo. Reduz VaR supply exposure em 30-50%
- **Multi-Tier 1 strategy**: 5 fornecedores Tier 1 alternativos (vs 3 baseline). Aumenta resiliência, mas +R$ 30M/ano
- **BYD China supply network**: acesso a fornecedores chineses via matriz BYD. Pode reduzir custo de qualificação em 30%

### 3.2 Parâmetros do modelo

- **VaR supply 6m baseline**: R$ 5.18B
- **EVE partnership profunda**: reduz tempo 12m → 8m. **Benefício**: 4 meses de protection antecipada = R$ 1.5bi de VaR evitado
- **CATL LP 70%**: reduz VaR supply em 35% (porque 70% do insumo fica em preço fixo). **Benefício**: R$ 1.8bi em 3 anos
- **Multi-Tier 1 strategy**: reduz VaR supply em 15% (resiliência marginal). **Benefício**: R$ 800M em 3 anos
- **BYD China network**: reduz custo de qualificação em 30%. **Saving**: R$ 84M em capex (de R$ 280M para R$ 196M)

### 3.3 Restrições

- **CATL LP 70%** trava flexibilidade de供给 (supplier lock-in). Pode ser problemático se CATL aumentar preços
- **Multi-Tier 1** aumenta complexidade operacional. 5 vs 3 fornecedores = +R$ 30M/ano
- **BYD China network** depende de goodwill da matriz. Pode ser cortado em disputa interna

### 3.4 Recomendação

| Partnership | Custo incremental | Benefício estimado | ROI |
|---|---|---|---|
| EVE partnership profunda | R$ 50M (acima do baseline) | R$ 1.5bi em 3 anos | +3000% |
| CATL LP 70% | R$ 80M (acima do baseline R$ 450M) | R$ 1.8bi em 3 anos | +2250% |
| Multi-Tier 1 (5 vs 3) | R$ 90M em 3 anos (R$ 30M/ano) | R$ 800M em 3 anos | +790% |
| BYD China network | R$ 0 (goodwill) | R$ 84M saving capex | ∞ |

**Recomendação D3**: ativar **EVE partnership profunda + CATL LP 70%** desde Q3 2026. Custo total: R$ 130M incremental. Benefício: R$ 3.3bi em 3 anos. ROI: +2540%.

**Trigger para revisar**: se lítio cair < US$10k/t por 12+ meses, reconsiderar CATL LP (travar preço alto pode custar upside).

**Insight 2**: as 4 S5↔S2 partnerships são o conjunto de S5 com maior ROI. Isso é contraintuitivo (sessão 2 tinha dual-sourcing como caro) mas reflete que partnerships são **aceleradores/enabling** da prescrição S2, não substitutos. O saving está em acelerar o tempo de protection, não em substituir o capex.

---

## 4. S5 ↔ S3: Partnerships como influenciador do BNDES

### 4.1 Mecanismo

BNDES funding é uma decisão política + técnica. Partnerships podem influenciar ambos os lados:

- **BYD global advocacy**: CEO BYD global reunião com Ministra do Desenvolvimento + Presidente BNDES. Aumenta peso político do projeto
- **MDIC partnership ativa**: Head Gov Relations BYD Brasil com canal direto MDIC. Facilita aprovação de funding especial
- **EVE partnership**: EVE como fornecedor Tier 1 com factory no Brasil (Persian — produzir lítio no Brasil). Aumenta narrativa " cadeia produtiva local", que BNDES prioriza
- **BCB partnership**: canal técnico com BCB para monitorar PTAX. Reduz incerteza cambial (BNDES considera FX risk no funding decision)

### 4.2 Parâmetros do modelo

- **ViE baseline 25%** (Expansão)
- **ViE uplift por partnership**:
  - BYD global advocacy: +5pp
  - MDIC partnership ativa: +3pp
  - EVE no Brasil: +7pp (alta narrative value)
  - BCB partnership: +2pp (baixa narrative, alto signaling)
- **ViE máximo com todas partnerships**: 25% + 5 + 3 + 7 + 2 = 42% (cap por teto do programa)
- **Benefício marginal**: cada +1pp ViE preserva ~R$ 15M de margem (VGV R$ 30B × 5% margem = R$ 1.5bi; +1pp = R$ 15M × 1 ano × 3 anos / 1.13 = R$ 36M NPV)

### 4.3 Restrições

- **BYD global advocacy** depende de prioridades da matriz. Pode ser adiada se BYD global estiver em outra crise
- **MDIC partnership ativa** tem risco de captura (acordo de bastidores vira escândalo)
- **EVE no Brasil** é hipotético — depende de factory decision da EVE (não da BYD)
- **BCB partnership** é mais signaling do que substance

### 4.4 Recomendação

| Partnership | Custo | ViE uplift | Benefício NPV |
|---|---|---|---|
| BYD global advocacy | R$ 5M (viagens + lobby) | +5pp | +R$ 180M |
| MDIC partnership ativa | R$ 8M (Head Gov Relations +2) | +3pp | +R$ 108M |
| EVE no Brasil (advocacy) | R$ 30M (incubação + advocacy) | +7pp | +R$ 252M |
| BCB partnership | R$ 2M (technical meetings) | +2pp | +R$ 72M |

**Recomendação D3**: ativar **EVE no Brasil + BYD global advocacy + BCB partnership** desde Q3 2026. Custo: R$ 37M. Benefício: R$ 504M NPV. ROI: +1362%.

**Trigger para revisar**: se BNDES funding confirmar R$ 800M+, partnerships desnecessárias (ViE já garantido). Cortar para economizar R$ 37M.

**Insight 3**: as partnerships S5↔S3 são **preventivas** — devem ser ativadas ANTES do BNDES decidir, não depois. Timing é crítico: ativar em Q3 2026, antes da deliberação do funding em Q1 2027.

---

## 5. S5 ↔ S4: Partnerships como competitive intelligence

### 5.1 Mecanismo

Defensivo pricing é reativo (cataloga redução de preço para preservar share). Partnerships podem tornar isso **proativo** via:

- **Tesla partnership direta** (improvável mas possível): BYD-Tesla partnership em battery supply poderia neutralizar competitivamente
- **VW partnership** (real): joint venture em plataforma EV. Reduz canibalização entre BYD e VW no Brasil
- **GM partnership**: potencial partnership em supply chain (lítio, baterias)
- **Geely partnership**: monitorar entrada da Geely no Brasil (player emergente)

### 5.2 Parâmetros do modelo

- **Defensivo baseline (catalog-wide)**: R$ 225M em 6m. ROI variável por S3
- **Partnerships com VW/GM**: reduzem canibalização, podem reduzir defensivo necessário em 30%
- **Geely monitoring**: detecta entrada 6-12m antes, permite preparação
- **Tesla partnership** (cenário hipotético): eliminaria necessidade de defensivo contra Tesla Model 2

### 5.3 Restrições

- **Tesla partnership** é improvável (Tesla compete globalmente com BYD)
- **VW partnership** já está em negociação avançada (PPE platform). Mas foco é plataforma compartilhada, não pricing
- **GM partnership** é hipótese distante
- **Geely monitoring** requer intelligence dedicado (R$ 5M/ano)

### 5.4 Recomendação

| Partnership | Custo | Defensivo saving | ROI |
|---|---|---|---|
| VW partnership ativa | R$ 0 (já em negociação) | R$ 67M (30% de R$ 225M) | ∞ |
| Geely monitoring | R$ 5M/ano × 3 = R$ 15M | Permite defensivo antecipado (saving R$ 50M) | +233% |
| Tesla partnership | — | — | Inviável |

**Recomendação D3**: acelerar **VW partnership ativa** (já em negociação); ativar **Geely monitoring** desde Q3 2026. Custo: R$ 15M. Saving defensivo: R$ 117M em 3 anos. ROI: +680%.

**Trigger para revisar**: se VW partnership fechar antes de Q1 2027, defensivo Tier 2 pode ser descontinuado em mercados VW. Se Geely anunciar entrada no Brasil, escalar defensivo.

**Insight 4**: S5↔S4 é o coupling mais **estratégico** e o menos quantificável. Partnerships podem mudar fundamentalmente a dinâmica competitiva, tornando defensivo desnecessário em alguns mercados. Mas o upside é incerto e depende de fatores externos (decisões de outras empresas).

---

## 6. Sumário dos 4 S5 couplings

### 6.1 Tabela consolidada

| Coupling | Custo 3y | Benefício 3y | ROI | Prioridade | Timing |
|---|---|---|---|---|---|
| S5↔S1 (hedge partnership) | R$ 0 incremental | R$ 80M saving | +∞ (sem custo) | Baixa | Q3 2026+ |
| S5↔S2 (supply partnership) | R$ 130M incremental | R$ 3.3bi | +2540% | **Alta** | Q3 2026 |
| S5↔S3 (BNDES partnership) | R$ 37M | R$ 504M | +1362% | **Alta** | Q3 2026 (preventivo) |
| S5↔S4 (competitive partnership) | R$ 15M | R$ 117M | +680% | Média | Q3 2026 |
| **TOTAL S5 couplings** | **R$ 182M** | **R$ 4.0bi** | **+2099%** | | |

### 6.2 3 padrões materialmente distintos

1. **S5↔S2 (supply) é o coupling de maior ROI** (R$ 3.3bi em 3 anos). **Recomendação**: priorizar EVE partnership profunda + CATL LP 70% desde Q3 2026.

2. **S5↔S3 (BNDES) é o coupling mais timing-sensível** — partnerships devem ser ativadas ANTES da decisão BNDES, não depois. Ativar em Q3 2026 para influenciar deliberação em Q1 2027.

3. **S5↔S4 (competitive) é o mais estratégico e menos quantificável** — depende de fatores externos (decisões de outras empresas). Monitoring (Geely) é defensivo; partnerships estruturais (VW) já estão em negociação.

### 6.3 Interação com os outros couplings

S5 partnerships potencializam os outros 4 couplings:
- **S5↔S1 + S1↔S3**: partnership hedge reduz custo do hedge baseline → ROI de S1↔S3 sobe
- **S5↔S2 + S1↔S2**: EVE partnership profunda reduz VaR supply → supply VaR combinado cai → hedge FX cobre mais do risco total
- **S5↔S3 + S3↔S4**: BNDES partnership aumenta ViE → defensivo targeted Tier 2 (não catalog-wide) se torna viável em mais cenários
- **S5↔S4 + S3↔S4**: VW partnership reduz canibalização → break-even de defensivo targeted cai de ViE=10% para ViE=5% (cenário mais permissivo)

**Insight 5**: S5 partnerships são o "óleo" do framework D3 — não entregam prescrições por si, mas tornam as outras 4 sessões mais eficazes. O R$ 182M investido em S5 retorna R$ 4bi se as partnerships forem bem-sucedidas. É o investment mais alavancado do programa.

---

## 7. Pontos abertos / limitações

1. **CATL LP 70%**: assume que CATL aceita indexação de 70% do lítio em preço fixo. Se CATL recusar, alternativa é indexar 50% (R$ 1.3bi em 3 anos em vez de R$ 1.8bi)
2. **EVE no Brasil**: factory decision da EVE depende de fatores externos (regulamentação ambiental BR, custo logístico). Hipótese otimista — pode ser que EVE não venha
3. **VW partnership**: focus em PPE platform, não pricing. Pode não ter impacto em defensivo de preço
4. **Geely monitoring**: depende de intelligence dedicado. Custo R$ 5M/ano pode ser subdimensionado
5. **BYD global advocacy**: depende de prioridades da matriz. Pode ser adiada se BYD global estiver em crise (e.g., recall global, disputa com Tesla)

---

## 8. Outputs do modelo (referência rápida)

**Arquivo**: `D3-INTERDEPENDENCY-S5-COUPLED.md` (este documento)
**Modelo**: 4 couplings × 2-3 partnerships cada = 10-12 sub-cenários quantificados
**ROI consolidado**: +2099% (R$ 4bi em 3 anos sobre R$ 182M investido)

**Resumo executivo em 1 frase**: S5 partnerships potencializam os 4 couplings já modelados e entregam R$ 4bi em 3 anos sobre R$ 182M investido (+2099% ROI). Priorizar S5↔S2 (EVE partnership + CATL LP 70%) e S5↔S3 (advocacy preventiva). S5 é o "óleo" do framework — torna as outras 4 sessões mais eficazes.
