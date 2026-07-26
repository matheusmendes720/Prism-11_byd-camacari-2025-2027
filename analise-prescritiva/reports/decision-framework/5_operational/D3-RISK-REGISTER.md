# D3-RISK-REGISTER — Polo Industrial BYD Camaçari 2025–2027

**Documento**: Registro de Riscos Formal · Estilo PMBOK/PRINCE2
**Projeto**: BYD Camaçari 2025-2027 — D3 v2.0
**Data**: 21 de julho de 2026
**Versão**: 1.0
**Status**: ATIVO
**Classificação**: Confidencial · Conselho Deliberativo

---

## Sumário

- [Metodologia](#metodologia)
- [Top 10 Riscos Prioritários](#top-10)
- [Matriz Probabilidade × Impacto](#matriz)
- [Registro Completo (R001–R030)](#registro)
- [Plano de Resposta por Categoria](#respostas)

---

## Metodologia {#metodologia}

### Escala de Probabilidade

| Nível | Descrição | Critério quantitativo |
|---|---|---|
| **1** | Muito Baixa | < 10% probabilidade em 12 meses |
| **2** | Baixa | 10–25% |
| **3** | Média | 25–50% |
| **4** | Alta | 50–75% |
| **5** | Muito Alta | > 75% |

### Escala de Impacto

| Nível | Descrição | Critério financeiro / operacional |
|---|---|---|
| **1** | Muito Baixo | < R$ 50M / impacto pontual |
| **2** | Baixo | R$ 50M–200M / impacto contido |
| **3** | Médio | R$ 200M–500M / tensão gerenciável |
| **4** | Alto | R$ 500M–1bi / crise operacional |
| **5** | Catastrófico | > R$ 1bi / sobrevivência do programa |

### Cálculo do Risk Score

```
Risk Score = Probabilidade (1-5) × Impacto (1-5)
```

| Range | Classificação | Cor |
|---|---|---|
| 1–4 | BAIXO | Verde |
| 5–9 | MÉDIO | Amarelo |
| 10–14 | ALTO | Laranja |
| 15–25 | CRÍTICO | Vermelho |

### Categorias de Risco

| Código | Categoria | Dimensão D3 |
|---|---|---|
| ESG/REP | ESG / Reputacional | S7 |
| FX | Financeiro / Câmbio | S1 |
| SC | Supply Chain | S2 |
| REG | Regulatório / Político | S3, S5 |
| COMP | Competitivo | S11 |
| OP | Operacional | S8, S9 |
| TARIFF | Tarifário | S10 |
| MACRO | Macro / Triggers | S6 |

### Fontes dos Riscos

| Documento de origem | Riscos extraídos |
|---|---|
| D3-MAIN.html (v2.0) | Composite scores, triggers, couplings |
| D3-INTERDEPENDENCY-S7-ESG.md | Kill switch, lista suja, MSCI |
| D3-INTERDEPENDENCY-S10-TARIFF.md | Duplo cost-shock, cronograma Camex |
| D3-INTERDEPENDENCY-S11-COMPETITION.md | Price war, sobrecapacidade, atraso |
| D3-MULTIVARIATE-SENSITIVITY.md | 4-shock, CVaR95, VaR 8.21bi |

---

## Top 10 Riscos Prioritários {#top-10}

| Prioridade | ID | Risco | Score | Prob | Impacto | Owner RACI | Ação Prioritária |
|---|---|---|---|---|---|---|---|
| **1** | R001 | Lista suja MTE não resolvida até Q4/2026 | **20** | 5 | 4 | CEO + CSO | Engajar MPT/MTE com plano concreto de remediação |
| **2** | R009 | Tarifa SKD/CKD salta para 35% em jan/2027 | **20** | 5 | 4 | CFO + COO | Acelerar nacionalização S8 para 50%+ antes de jan/2027 |
| **3** | R003 | FX BRL/USD > 6.0 simultâneo com tariff 35% | **20** | 5 | 4 | CFO | Hedge FX ≥ 60% do CVaR 4-shock (R$ 6.1bi) |
| **4** | R006 | Supply de baterias interrompido (lítio > US$ 25k) | **16** | 4 | 4 | Head Supply | Qualificar EVE + CATL como dual-source; estoque 90 dias |
| **5** | R013 | Stellantis inicia guerra de preços em 2027 | **16** | 4 | 4 | CMO + CSO | Preparar Tier 3 defensivo; NPS e pós-venda como moat |
| **6** | R017 | CVaR 95% realizado > R$ 10.14bi (quarter) | **15** | 3 | 5 | CFO + CSO | Provisionar capital de risco; ativar learning loop |
| **7** | R002 | Nova acusação de trabalho escravo ou fiscalização | **15** | 3 | 5 | Head Comms + CSO | Auditoria ESG trimestral; protocolo de compliance operário |
| **8** | R010 | BNDES nega funding permanentemente (ViE=0 + lista suja) | **15** | 3 | 5 | CEO + Head Gov Rel | Bridge financing R$ 800M; renegociar covenants |
| **9** | R004 | Hedge FX insuficiente (< 80% da exposição) | **12** | 4 | 3 | CFO + Risk Officer | Revisar sizing de hedge mensalmente; trigger T-MV2 |
| **10** | R015 | Atraso planta Camaçari > 90 dias vs cronograma | **12** | 4 | 3 | COO + CSO | Bridge importação China; recalibrar S8 ramp targets |

---

## Matriz Probabilidade × Impacto {#matriz}

### Posicionamento dos 30 Riscos (5×5)

```
                    IMPACTO
          1(Baixo)  2    3(Médio)  4(Alto)  5(Cat)
PROB
5(MA)    |  R023    |     | R004     | R001   | R002
         |          |     | R015     | R009   | R003
         |          |     | R022     | R006   | R017
         |          |     |          | R013   | R010
4(ALTA)  |          | R008| R019     | R007   |
         |          | R024| R016     | R012   |
         |          | R025| R018     | R014   |
         |          | R026| R027     | R028   |
         |          |     |          |        |
3(MÉDIA) |          | R011| R005     | R020   |
         |          | R021| R029     |        |
         |          |     |          |        |
2(BAIXA) |          |     | R030     |        |
         |          |     |          |        |
1(MB)    |          |     |          |        |
```

### Legenda de Cores dos Quadrantes

| Quadrante | Score Range | Riscos |
|---|---|---|
| 🔴 **CRÍTICO** (15–25) | R001, R002, R003, R006, R009, R010, R013, R017 | 8 riscos |
| 🟠 **ALTO** (10–14) | R004, R007, R012, R014, R015, R019, R020, R022, R027, R028 | 10 riscos |
| 🟡 **MÉDIO** (5–9) | R005, R008, R011, R016, R018, R021, R023, R024, R025, R026, R029, R030 | 12 riscos |
| 🟢 **BAIXO** (1–4) | — | 0 riscos |

### Visual ASCII da Matriz Completa

```
         │ 1(B)   2    3(M)   4(A)   5(C)
─────────┼─────────────────────────────────
5 (MA)   │   ·     ·    R023   R001   R002
         │               R004   R009   R003
         │               R015   R006   
         │               R022   R013   
─────────┼─────────────────────────────────
4 (A)    │   ·    R008   R019   R007   ·
         │               R016   R012   ·
         │               R018   R014   ·
         │               R027   R028   ·
─────────┼─────────────────────────────────
3 (M)    │   ·    R011   R005   R020   ·
         │               R029   ·      ·
         │               R030   ·      ·
─────────┼─────────────────────────────────
2 (B)    │   ·     ·     ·      ·      ·
         │               ·      ·      ·
─────────┼─────────────────────────────────
1 (MB)   │   ·     ·     ·      ·      ·
         │               ·      ·      ·
```

---

## Registro Completo de Riscos (R001–R030) {#registro}

---

### CATEGORIA: ESG / REPUTACIONAL (S7)

---

#### R001 | Lista Suja MTE Não Resolvida até Q4/2026

| Campo | Valor |
|---|---|
| **Categoria** | ESG/Reputacional |
| **Probabilidade** | 5 (Muito Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 5 × 4 = **20** 🔴 CRÍTICO |
| **Owner (RACI)** | CEO + CSO (R); Conselho (A) |
| **Fonte** | D3-INTERDEPENDENCY-S7-ESG.md · D3-MAIN.html §S7 |
| **Status** | ATIVO |

**Descrição**: BYD foi incluída na lista suja do MTE em 07/abr/2026 após resgate de 163 trabalhadores chineses em condições análogas à escravidão na obra de Camaçari (dez/2024), ação civil do MPT (R$ 257M pedidos, acordo de R$ 40M em dez/2025), e repercussão internacional (Washington Post, BBC, Reuters). A lista suja bloqueia automaticamente financiamentos públicos federais e pode acionar cláusulas de covenant em empréstimos privados. Risco de cronificação > 12 meses é o cenário mais provável dado o histórico de remoções (média Setor 4 anos).

**Trigger**: Resolução oficial do MTE removendo BYD da lista suja NÃO publicada até 31/dez/2026; qualquer nova fiscalização MTE com autuação; aumento de controversies count além das 3 atuais.

**Mitigação Primária**: Engajar escritório de advocacia especializado em direito do trabalho (ex: Veirano, Mattos Filho) para conduzir remediação acelerada; implementar programa de compliance operário verificável por auditoria independente; protocolar pedido de retirada com MTE com cronograma de ações corretivas documentadas.

**Mitigação Secundária**: Ativar kill switch protocol: pausar capex novo (preserva liquidity); revisar covenants existentes; preparar bridge financing privado de R$ 800M替代 BNDES; comunicar ao Conselho estratégia de continuidade vs reestruturação (downsizing 30-50% se cronificação > 180 dias).

---

#### R002 | Nova Acusação de Trabalho Escravo ou Fiscalização Ampliada

| Campo | Valor |
|---|---|
| **Categoria** | ESG/Reputacional |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 5 (Catastrófico) |
| **Risk Score** | 3 × 5 = **15** 🔴 CRÍTICO |
| **Owner (RACI)** | Head Comms + CSO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S7-ESG.md §4 |
| **Status** | ATIVO |

**Descrição**: Qualquer nova acusação de trabalho análogo à escravidão, rescisão coletiva, ou fiscalização ampliada pelo MTE geraria risco de inclusão de novos nomes (subsidiárias, fornecedores) na lista suja, reativação de processos judiciais suspensos (MPT pediu R$ 257M originalmente), e cobertura midiática renovada (Washington Post em mar/2026). O impacto reputacional internacional (cadeia de suprimentos global) pode afetar contratos com distribuidores e parcerias B2B.

**Trigger**: Notificação de qualquer órgão governamental (MTE, MPT, CGU, TCU); qualquer worker complaint formal via canal de denúncias; qualquer matéria em veículo de referência (Reuters, BBC, FT) sobre condições de trabalho na BYD ou fornecedores.

**Mitigação Primária**: Implementar canal de denúncias anônimo 24/7 para trabalhadores (terceirizado); auditoria ESG trimestral por Big4 (Deloitte, EY, KPMG);due diligence de fornecedores Tier 2+ com ESG scorecard obrigatório; code of conduct com claúsula de rescisão automática para violações.

**Mitigação Secundária**: Protocolo de crise midiática: Head Comms com talking points aprovados pelo Conselho em 24h; engajar firma de PR internacional (Finsbury, Hill+Knowlton) para gestão de narrativa; preparar resposta judicial coordenada com escritório parceiro.

---

#### R003 | Rebaixamento MSCI para CCC ou Inferior (Kill Switch Acelerado)

| Campo | Valor |
|---|---|
| **Categoria** | ESG/Reputacional |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 4 × 4 = **16** 🔴 CRÍTICO |
| **Owner (RACI)** | CSO + CFO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S7-ESG.md §2 |
| **Status** | ATIVO |

**Descrição**: MSCI rating desconhecido para BYD (empresa privada não divulga), mas dado o escândalo de trabalho escravo e a repercussão internacional, rebaixamento para CCC ou inferior é altamente provável. Sustainalytics "high risk" (score 40+) implica restrições de lending automático em bancos institucionais. O acoplamento S7↔S1 adiciona +30-50bps no custo de hedge FX, e S7↔S2 adiciona 20-30% no custo de qualificação de fornecedores. Perda estimada: R$ 18M/ano em hedge premium + R$ 30-50M em remediação reputacional.

**Trigger**: Publicação de rating MSCI CCC ou inferior; relatório Sustainalytics com ESG Risk Rating > 40; qualquer mention em relatórios de proxy advisors (Glass Lewis, ISS) recomendando voto contra gestão.

**Mitigação Primária**: Contratar consultoria ESG especializada para preparar relatório voluntário de divulgação (similar a Sustainability Accounting Standards Board); engajar MSCI diretamente para precificar rating; implementar Plano de Remediação ESG público com metas verificáveis (减排, diversidade, code of conduct).

**Mitigação Secundária**: Renegociar contratos de hedge existentes com cláusulas de ESG material adverse change; buscar формований financing via canais alternativos (China Development Bank, bancos chineses não sujeitos a Sustainalytics).

---

### CATEGORIA: FINANCEIRO / FX (S1)

---

#### R004 | Hedge FX Insuficiente (< 80% da Exposição)

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | CFO + Risk Officer (R); CFO (A) |
| **Fonte** | D3-MAIN.html §S1 + D3-MULTIVARIATE-SENSITIVITY.md |
| **Status** | ATIVO |

**Descrição**: Análise D3 v2.0 demonstra que sizing de hedge para 95% do VaR FX 1-choque (R$ 2.74bi) cobre apenas 33% do CVaR 4-shock (R$ 10.14bi). Recomendação recalculada: hedge 60% do CVaR 4-shock = R$ 6.1bi. Hedge atual pode estar em 47% (nível S1 AMBER). Exposição FX varia com ramp S8: 90% (SKD 95%) → 45% (CKD 40%) em 18 meses. Qualquer descasamento entre hedge e exposição real gera risco de shortfall.

**Trigger**: Relatório mensal de treasury mostrando hedge ratio < 80%; BRL/USD fechando acima de 5.80 por 5 dias consecutivos; qualquer violation de covenant de hedge em contratos de financing.

**Mitigação Primária**: Recalibrar sizing de hedge para 60% do CVaR 4-shock (R$ 6.1bi); rever política de hedge com revisão trimestral obrigatória; implementar sistema de alerta automático (trigger T-MV2: S1 AMBER + S2 AMBER por > 20 dias).

**Mitigação Secundária**: Deslocar recursos de outras linhas de capex para cover hedge gap; acionar linha de crédito contingente pré-aprovada (R$ 500M); renegociar termos de covenant de hedge com banco agent.

---

#### R005 | FX BRL/USD > 6.2 com Simultaneidade de Stress

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 3 × 4 = **12** 🟠 ALTO |
| **Owner (RACI)** | CFO (R); CEO (A) |
| **Fonte** | D3-MULTIVARIATE-SENSITIVITY.md §2 |
| **Status** | ATIVO |

**Descrição**: BRL/USD em stress (σ 11.2% em 12m, viés de alta por política monetária restritiva do BCB e risco fiscal pós-eleição 2026). Simulação MC com Cholesky mostra que FX > 6.0 AND S2 RED simultâneos disparam T-MV1 (4-shock stress). VaR 4-shock neste cenário: R$ 8.21bi. Para cada 10% de desvalorização do BRL, o custo de importação sobe proporcionalmente, amplificando o duplo cost-shock com S10.

**Trigger**: PTAX final > 6.0 (dias úteis); spread cambial implícito > 3% vs PTAX; qualquer indication de intervenção do BCB no mercado.

**Mitigação Primária**: Hedge cambial em nível 60% do CVaR 4-shock (R$ 6.1bi); diversificação de exposição FX vianatural hedging (despesas em BRL vs receitas em BRL); monitoramento diário de indicadores macro (câmbio, juros, fiscal).

**Mitigação Secundária**: Stress test de liquidez: capital de contingência R$ 500M disponível em 48h; revisão de capex fase 2 se FX > 6.2 por > 30 dias; acionar cláusulas de força maior em contratos de поставка se aplicável.

---

### CATEGORIA: SUPPLY CHAIN (S2)

---

#### R006 | Supply de Baterias Interrompido (Lítio > US$ 25k/ton)

| Campo | Valor |
|---|---|
| **Categoria** | Supply Chain |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 4 × 4 = **16** 🔴 CRÍTICO |
| **Owner (RACI)** | Head Supply Chain (R); COO (A) |
| **Fonte** | D3-MULTIVARIATE-SENSITIVITY.md §2 + D3-MAIN.html §S2 |
| **Status** | ATIVO |

**Descrição**: Lítio em rebound sustentado: US$ 9k → US$ 22k em 9 meses (+144%), com mina CATL Jianxiawo fechada e deficit estrutural de 22-100 kt LCE. Volatilidade de 95% em 6 meses (σ_6m) faz do lítio o segundo maior VaR individual (R$ 3.67bi em 1-choque). A correlação FX-Lítio ρ=0.4 amplifica o efeito: BRL 5.30 → 6.0 = +13% adicional no custo em BRL. Supply chain de baterias é o componente mais crítico para a produção em Camaçari.

**Trigger**: Preço spot lítio carbonate > US$ 25k/ton por > 10 dias; qualquer indication de interrupção de mina CATL; disruptions logísticas (portos, transporte marítimo) afetando rotas China-Brasil.

**Mitigação Primária**: Dual-sourcing: qualificar EVE e CATL como fornecedores alternativos de células (além de BYD Battery); contratos LP de 12-24 meses com preço fixo ou ceiling para 40% das necessidades anuais; estoque de segurança de 90 dias (value ~R$ 80M).

**Mitigação Secundária**: Plano B:spot market hedging com contratos flexíveis de 3-6 meses; avaliar rotas alternativas de fornecimento (Austrália, Chile como fallback); acelerar integração vertical LFP em Camaçari para reduzir dependência de importação.

---

#### R007 | Qualificação EVE / CATL Atrasada (Dual-Source Fail)

| Campo | Valor |
|---|---|
| **Categoria** | Supply Chain |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | Head Supply Chain + Procurement (R); COO (A) |
| **Fonte** | D3-MAIN.html §S2 + D3-INTERDEPENDENCY-S7-ESG.md §6.3 |
| **Status** | ATIVO |

**Descrição**: Qualificação de novos fornecedores de baterias (EVE, CATL) leva tipicamente 12-18 meses incluindo homologação técnica, auditoria ESG, e testes de qualidade. S7 ESG RED (lista suja) pode dificultar qualificação: fornecedores Tier 1 pedem ESG covenants e podem recusar parceria profunda com empresa em lista suja. Custo de qualificação pode aumentar 20-30% por conta do risk premium de ESG.

**Trigger**: Cronograma de qualificação EVE atrasando > 60 dias vs plano original; qualquer recusa de fornecedor em continuar processo de qualificação citing ESG concerns; não atingimento de milestone técnico (cycle life, energy density).

**Mitigação Primária**: Iniciar processo de qualificação imediatamente (Q3 2026);engajar firma de auditoria ESG independente para credenciar BYD perante fornecedores; oferecer contratos de volume (≥ 10k unidades/ano) como incentive para fornecedores aceitarem partnership.

**Mitigação Secundária**:另找 fonte temporária no spot market (premium de 15-20%); usar importação direta de células da China via routes alternativas enquanto qualification ocurre; renegociar contratos existentes com BYD Battery para extensão de prazo.

---

#### R008 | Descobertura de Estoque de Commodities Críticos (> 60 dias)

| Campo | Valor |
|---|---|
| **Categoria** | Supply Chain |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 3 × 2 = **6** 🟡 MÉDIO |
| **Owner (RACI)** | Head Supply Chain (R); COO (A) |
| **Fonte** | D3-MAIN.html §S2 |
| **Status** | ATIVO |

**Descrição**: Estoque de commodities críticos (lítio, níquel, cobalto, alumínio) abaixo de 60 dias de cobertura expõe o programa a volatility de mercado. Current status S2 AMBER (lítio em rebound, 60-90 dias de estoque). Ruptura de estoque em qualquer commodity críticoforça produção a parar ou comprar no spot a preços penalizadores.

**Trigger**: Nível de estoque < 45 dias para qualquer commodity crítico; lead time de reposição > 30 dias; qualquer disruption de transporte (portos, voos de carga).

**Mitigação Primária**: Política de estoque mínimo de 75 dias para todos os commodities críticos; contratos forward com fornecedores para deliveries programadas; monitoramento de lead times com alerta em 60 dias.

**Mitigação Secundária**: Priorização de produção: modelos com maior margem first; venda de inventory não-crítico para gerar cash;identificar suppliers secundários para cada commodity (olist).

---

### CATEGORIA: REGULATÓRIO / POLÍTICO (S3, S5)

---

#### R009 | BNDES Nega Funding Permanentemente (ViE=0 + Lista Suja)

| Campo | Valor |
|---|---|
| **Categoria** | Regulatório / Político |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 5 (Catastrófico) |
| **Risk Score** | 3 × 5 = **15** 🔴 CRÍTICO |
| **Owner (RACI)** | CEO + Head Gov Relations (R); Conselho (A) |
| **Fonte** | D3-MAIN.html §S3 + D3-INTERDEPENDENCY-S7-ESG.md §6.1 |
| **Status** | ATIVO |

**Descrição**: BNDES funding de R$ 800M+ está bloqueado de fato enquanto BYD estiver na lista suja MTE (impedimento legal de aprovar crédito com recursos públicos federais). Mesmo se ViE subisse para 25% (Expansão), a lista suja sobrepõe qualquer cenário S3 — S7 é gatekeeper de S3. R$ 800M representa ~30% do capex program total. Perda do funding significa: (a) fase 2 do capex em pausa, (b) necessidade de bridge financing privado a custo maior, (c) reestruturação do programa.

**Trigger**: Cualquier comunicação formal do BNDES recusando ou suspendendo análise de crédito; qualquer cambio na política de eligibility do BNDES que exclua empresas com controversies; manutenção da lista suja > 6 meses.

**Mitigação Primária**: Prioridade absoluta na resolução da lista suja (R001); lobbying MDIC e Ministério do Trabalho simultaneamente; preparar dossier de remediação ESG com cronograma verificável para apresentar ao BNDES como condição de elegibilidade futura.

**Mitigação Secundária**: Bridge financing privado: R$ 800M via China Development Bank ou bancos chineses (sem ESG restrictions brasileiras); downsizing do capex program: adiar fase 2, focar em SKD/CKD apenas; vendor financing de fornecedores (EVE, CATL) como альтернатива.

---

#### R010 | Política Tributária Elimina Incentivos (Rollback de IPI/Monte)

| Campo | Valor |
|---|---|
| **Categoria** | Regulatório / Político |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 3 × 4 = **12** 🟠 ALTO |
| **Owner (RACI)** | CFO + Head Gov Relations (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S3 |
| **Status** | ATIVO |

**Descrição**: Qualquer rollback de política tributária (IPI, MIX Brasil, Programas de incentivo estadual na Bahia) que увеличь custo de produção local ou reduza competitividade do produto nacionalizado. Cenário S3 Rollback Parcial (ViE=10%) já coloca pressão sobre BNDES; Rollback Total (ViE=0%) eliminaincentivos e forçaкращение de investimentos. Risco elevado em ano de eleição (2026 no Brasil).

**Trigger**: Publicação de Medida Provisória ou Lei extinguindo ou reduzindo incentivo fiscal; qualquer decisão judicial desfavorável sobre eligibility de programas de incentivo; mudança de governo com reversal de política industrial.

**Mitigação Primária**: Diversificar localização de incentivos (não depender 100% de um programa federal); lock-in de contratos deincentivo com cláusulas de estabilidade; advocacy junto ao MDIC e影响力的s para manutenção de políticas.

**Mitigação Secundária**: Recalibrarbreak-even do projeto com novo cenário fiscal (stress test);预案: downsizing de capacidade se ViE=0 persistir > 12 meses; explorarincentivos subnacionais (Bahia, Pernambuco, Maranhão).

---

#### R011 | Mudança de Regulatório Antidumping ou Subsídio (BYD Adicionada)

| Campo | Valor |
|---|---|
| **Categoria** | Regulatório / Político |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 3 × 2 = **6** 🟡 MÉDIO |
| **Owner (RACI)** | Head Gov Relations + Legal (R); CFO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S10-TARIFF.md §9 |
| **Status** | ATIVO |

**Descrição**: Risco de abertura de investigação antidumping contra BYD (similar às que já atingem Chery e outras marcas chinesas). Investigação pode resultar em tarifa adicional (anti-dumping duty) de 10-30% sobre valor CIF.BYD currently não está sob antidumping, mas proximidade com otras marcas chinesas sob investigação aumenta риск. Além disso, qualquer indication de subsídio cross-border (China government → BYD) pode ativar countersvailing duties.

**Trigger**: Abertura formal de investigação pelo DECOM/CAMEX; qualquer comunicação oficial de intent de investigar; cualquier referensi na mídia sobre dumping ou subsídio envolvendo BYD.

**Mitigação Primária**: Monitoramento contínuo de publicações CAMEX e DECOM; manter dossiê de defesa pré-preparado com evidência de preço de mercado;engajar firma de trade defense especializada (VBS Advogados, Machado Meyer).

**Mitigação Secundária**: Diversificar mix de productos para aqueles com maior conteúdo local (menos exposição a anti-dumping); evaluar redirecionamento de supply para rotas alternativas (México, Tailândia) — aunque essas rotas também estão sob tariff pressure.

---

### CATEGORIA: TARIFF (S10)

---

#### R012 | Tarifa SKD/CKD Salta para 35% em jan/2027 (Duplo Cost-Shock)

| Campo | Valor |
|---|---|
| **Categoria** | Tarifário |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | CFO + COO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S10-TARIFF.md §1-§4 |
| **Status** | ATIVO |

**Descrição**: Cronograma Camex já publicado: SKD/CKD 14% → 35% em jan/2027 (antecipado 18 meses vs 2028).BYD pediu redução de tarifa para SKD/CKD em jul/2025 → REJEITADO pela Camex. Conseguiu apenas quota tariff-free de US$ 463M por 6 meses (H1 2026), expirando antes de jul/2026. Para um kit SKD/CKD com CIF US$ 15k, +21pp de tarifa = +US$ 3.150/veículo. Duplo cost-shock: BRL 6.0 + tariff 35% = VaR 6m P95 sobe para R$ 4.5-5.0bi (+110% vs baseline).

**Trigger**: Qualquer comunicação oficial Camex confirmando manutenção do cronograma; não renovação da quota BYD; qualquer indication de que nacionalização < 50% até jan/2027.

**Mitigação Primária**: Acelerar nacionalização S8: target 50%+ de conteúdo local antes de jan/2027 (reduz exposição ao tariff 35%); advocacy intensivo junto ao MDIC e Camex para reconsideration de cronograma; evaluar alternative de supply vía países com TLC com Brasil (México, Chile).

**Mitigação Secundária**: Repasse de custo para preço: aumentar ASP em 3-5% para cobrir tariff shock; reduzir mix de produtos SKD-intensive (priorizar modelos CKD); activate Plano B de importação direta de veículos completos (CBU) se tariff ficar prohibitivo.

---

#### R013 | Tarifa Efetiva > 30% (S10 RED) — Margin Compression Severa

| Campo | Valor |
|---|---|
| **Categoria** | Tarifário |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 4 × 4 = **16** 🔴 CRÍTICO |
| **Owner (RACI)** | CFO + CMO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S10-TARIFF.md §6.3 |
| **Status** | ATIVO |

**Descrição**: Se tariff blend effective ≥ 30%, a margem BYD Brasil entra em territory deficitário sem Mix Brasil (crédito ao consumidor subsidiado). Margem média BYD 2025: ~22% (Dolphin Mini). Com tariff 35% + FX stress: margem cai para 5-8% ou negativo. S10↔S4: defensivo de preço (S4) e tariff cost (S10) comprimem margem simultaneously from both sides. S10↔S1: duplo cost-shock multiplicativo (não aditivo): `(1 + FX_shock) × (1 + tariff_shock)`.

**Trigger**: Tariff blend effective ≥ 30% (calculado como Σ tariff_rate_i × volume_share_i); qualquer nuevo imposto ou taxa sobre importação de veículos ou componentes; рені Kejadian any increase beyond current schedule.

**Mitigação Primária**: Mix shift: priorizar modelos com maior conteúdo local (menos tariff exposure); verticalização acelerada de componentes críticos (motor, body) em Camaçari; implementar Tier 3 defensivo ONLY em modelos com margem > 15%.

**Mitigação Secundária**: Renegociar preços com fornecedores para absorver parte do tariff cost; avaliar programa de leasing ou subscription para reduzir barrier de preço ao consumidor sem desconto direto; downsizing temporário de volume se margem ficar insustentável.

---

### CATEGORIA: COMPETITIVO (S11)

---

#### R014 | Stellantis Inicia Guerra de Preços em 2027

| Campo | Valor |
|---|---|
| **Categoria** | Competitivo |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 4 × 4 = **16** 🔴 CRÍTICO |
| **Owner (RACI)** | CMO + CSO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S11-COMPETITION.md §2-§3 |
| **Status** | ATIVO |

**Descrição**: Sobrecapacidade estrutural de 68% (630k capacidade / 200k demanda projetada 2027) cria pressão deflacionária estrutural. Stellantis (R$ 30bi invested, líder com ~22% share) tem recursos para sustentar guerra de preços por 18-24 meses usando margens de veículos ICE como subsídio cruzado. BYD tem custo de produção mais baixo (LFP verticalizado) mas sofre dano reputacional de "marca barata". Probabilidade de price war > 65% (S11 RED).

**Trigger**: Cualquier anúncio público de Stellantis, GM, VW ou Geely com desconto > 10% sobre MSRP em qualquer segmento que compete com BYD; qualquer comunicação de pricing aggressiva em canal de vendas ou publicidad; reducción de price-list oficial em > 5%.

**Mitigação Primária**: Diferenciação não-preço: priorização de pós-venda, rede de carregamento própria, ecossistema de energia solar BYD Energy; investir em experiência de владельца (test-drive, assinatura, leasing) para reduzir comparabilidade direta de preço; manter estrutura de custos que permita competir sem iniciar guerra (BYD como follower, não leader).

**Mitigação Secundária**: Tier 3 defensivo ONLY: reducir preço em 5-8% em modelos mais vulneráveis (Dolphin Mini); comunicação proativa de value proposition (TCO, custo de ownership); avaliar promoções de volume (não desconto de preço) para fleet customers.

---

#### R015 | Sobrecapacidade Estrutural > 250% (Capacidade/ Demanda)

| Campo | Valor |
|---|---|
| **Categoria** | Competitivo |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | CSO + COO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S11-COMPETITION.md §2.2 |
| **Status** | ATIVO |

**Descrição**: Capacidade agregada das 5 montadoras no Brasil excederá demanda projetada em factor > 2.5x até 2027 (630k vs 200k). Sobrecapacidade > 250% (RED threshold) cria pressão permanente sobre pricing e utilização de capacidade. Taxa de utilização setorial pode cair para 30-40%, forcing players a escolher entre volume (desconto) ou margem.

**Trigger**: Qualquer новый anúncio de capacidade das concorrentes (Stellantis expandindo, VW adicionando linha); revisão para baixo da projeção de demanda EV (Fenabrave, ANFAVEA); cualquier cambio en regulation de emissões that slows EV adoption.

**Mitigação Primária**: Focar em share de mercado, não volume absoluto: explorar nichos onde BYD tem vantagem (taxi, fleet, rideshare); construir relaciones estratégicas com operadores de fleet (iFood, 99, taxi cooperatives) para volume comprometido; diferenciarse em tecnologia (LFP battery, V2G capability).

**Mitigação Secundária**: Monitorar utilização de capacidade mensalmente e ajustar mix de produção accordingly;预案: se utilização setorial < 35% por > 2 quarters, reconsiderar cronogramas de capex (pausar fase 2); explorar exportação para mercados vecinos (Argentina, Chile, Colômbia).

---

#### R016 | Atraso Planta Camaçari > 90 Dias vs Cronograma Original

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | COO + CSO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S11-COMPETITION.md §7.4 |
| **Status** | ATIVO |

**Descrição**: Full operations em Camaçari esperadas para dez/2026 (vs previsão original de mar/2025 — 21 meses de atraso). Atraso > 90 dias resulta em: (a) perda de janela de mercado (concorrentes ocupam espaço antes), (b) exposição prolongada a tariff SKD/CKD (não há produção local para reducir), (c) cash burn em importação de veículos completos como bridge. Historicamente, projetos industriais no Brasil têm taxa de atraso de 40-50%.

**Trigger**: Milestone de construção não atingido (verificação mensal); qualquer comunicação oficial de BYD sobre mudança de cronograma; qualquer signal de problemas de mão de obra, licença ambiental, ou fornecimento de equipment.

**Mitigação Primária**: Bridge import strategy: manter importação de CBU da China como alternativa até capacidade local estar operacional; risk register de projeto com weekly tracking de critical path; antecipação de licenças epermits (environmental, construction) com team dedicado.

**Mitigação Secundária**: Renegociar cronogramas de capex com fornecedores e bancos; ajustar expectativas de volume (shift de 150k para 100k unidades locais em 2027, compensando com importação); comunicar a stakeholders (investors, BNDES) sobre cronogramas realistas.

---

#### R017 | Entrada de Novo Competidor Chinês (Geely, Changan, Chery, NIO)

| Campo | Valor |
|---|---|
| **Categoria** | Competitivo |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 3 × 3 = **9** 🟡 MÉDIO |
| **Owner (RACI)** | CSO + CMO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S11-COMPETITION.md §3.2 |
| **Status** | ATIVO |

**Descrição**: Probabilidade média (30-40%) de novo entrante chinês antes de 2028. Geely já está em 10.6% market share (crescendo) usando marcas europeias adquiridas (Volvo, Polestar). NIO, Changan, Chery avaliam mercado brasileiro. Novos entrantes aumentam capacidade agregada (piorando sobrecapacidade), introduzem novas tecnologias, e podem initiate price war para ganhar share. BYD deixa de ser "marca chinesa padrão" para ser uma entre várias.

**Trigger**: Qualquer anúncio público de nova montadora chinesa entrando no Brasil; qualquer sinal de investimento em planta ou CKD/SKD operation no Brasil; qualquer formação de joint venture entre marca chinesa e player local.

**Mitigação Primária**: Defender first-mover advantage: construir brand loyalty antes que novos entrantes ganhem tração; acelerar rede de carregamento e pós-venda como barreira de switching; explorar parcerias com novos entrantes (niche complementar, não competidor direto).

**Mitigação Secundária**: Repositioning: se novos entrantes competem no mesmo segmento de preço, BYD pode mover дляupmarket ( Seal, Yangwang) para evitar guerra de preços direta; monitor closely年轻人的 brand perception e ajustar messaging accordingly.

---

### CATEGORIA: OPERACIONAL (S8, S9)

---

#### R018 | Ramp de Produção S8 Atrasado — SKD/CKD Ratio Não Atinge Metas

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 3 × 3 = **9** 🟡 MÉDIO |
| **Owner (RACI)** | COO + Head Manufacturing (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S8 + D3-INTERDEPENDENCY-S10-TARIFF.md §6.4 |
| **Status** | ATIVO |

**Descrição**: SKD 95% (2025) → 40% (2026) é a curva de ramp projetada. Cada 1% de aceleração do ramp reduz ~R$ 30-50M do VaR 4-shock. Atraso no ramp significa exposição prolongada a tariff SKD/CKD (que будет 35% em jan/2027) e maior custo de importação. S8↔S1: exposição FX não diminui no ritmo projetado (90% → 45%), mantendo VaR FX maior que o estimado. S8↔S10: ramp lento é a pior mitigação para S10 RED.

**Trigger**: Produção mensal real < 90% do planejado por 2 meses consecutivos; qualquer indicação de shortage de mão de obra, компонентов, ou equipment; cualquier cambio em regulation que exija reclasificación de CKD/SKD.

**Mitigação Primária**: Programa de aceleração de ramp: 20% mais productivity por quarter; dual-shift ou weekend overtime se necessário; lock-in de componentes críticos com fornecedores antes de shortage; каpiTAL investment em automation para reducir mão de obra dependence.

**Mitigação Secundária**:另找 source de componentes (importação de emergência com prêmio de 10-15%); ajustar mix de produção para modelos que usam mais componentes locais disponíveis; comunicar a stakeholders novos cronogramas realistas.

---

#### R019 | Demanda EV Estagnada ou em Queda (Share < 5%)

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | CMO + CSO (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S9 + D3-MULTIVARIATE-SENSITIVITY.md |
| **Status** | ATIVO |

**Descrição**: Demanda atual EV share 13.5% (mai/2026), +153% YoY — mas esse crescimento pode não ser sustentável. Consumidores brasileiros são altamente preço-sensitivos e podem adotar estratégia wait-and-see se incertezas (preço vai cair mais? infraestrutura vai melhorar?). Cada 1pp de queda em EV share representa ~R$ 100M de revenue shortfall no mix BYD. S11 (price war) também afeta demanda (consumidor uncertainty paralisa decisão).

**Trigger**: EV share mensal < 10% por 3 meses consecutivos; queda YoY > 20% em qualquer mês; pesquisa de intenção de compra mostrando increase in wait-and-see sentiment; cualquier deterioro de macroeconomic conditions (PIB, unemployment).

**Mitigação Primária**: Ações de stimulation de demanda: programas de test-drive, assinatura mensal (BYD Subscription), fleet deals com empresas; работа с government relations para manter e ampliarре入职 tax incentives (exemption de IPVA, Rodízio); educate consumers sobre TCO (total cost of ownership) vs ICE.

**Mitigação Secundária**: Assessar pricing intervention: se share cair < 8%, puede ser necessário defensive pricing tier (3-5% desconto) despite margin compression;另找 canais: government fleet, taxi, rideshare (high volume, lower margin acceptable); preparar scenario plans para different demand levels for capex allocation.

---

#### R020 | Desistência do Consumidor Brasileiro (Wait-and-See)

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 4 × 4 = **16** 🔴 CRÍTICO |
| **Owner (RACI)** | CMO + Head Marketing (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S11-COMPETITION.md §7.5 |
| **Status** | ATIVO |

**Descrição**: Consumidores adotam estratégia de espera diante de tantas opções e incertezas (preço vai cair? infraestrutura vai melhorar? melhor esperar novo modelo?). Com 5+ players e múltiplas opções de preço, o consumidor racionaldelay decisão. Este comportamento é o principal риск para o business case do programa: demanda projetada de 200k unidades em 2027 pressupõe que consumers actually buy, não apenas considerem.

**Trigger**: pesquisa de mercado mostrando % de consumidores em "wait-and-see" > 40%; dados de conversão (test-drive → compra) caindo > 20% vs baseline; qualquer dato showing alongamento de sales cycle.

**Mitigação Primária**: Reduzir риск percebido: garantia extendida (8 anosBattery warranty como differentiator), rede decarregamento própria como proof of commitment; programas de test-drive premium (experiência completa, não apenas 15-min test); usar early adopters como brand ambassadors (conteúdo UGC).

**Mitigação Secundária**: Promoções de conversão: first-year maintenance included, free home charger installation, loyalty rewards;打不过 price war directly, mas打不过 value proposition (BYD Energy ecosystem, integrated solar + storage);另找 B2B channel (fleet, government, rideshare) como buffer contra consumer hesitation.

---

### CATEGORIA: MACRO / TRIGGERS (S6)

---

#### R021 | Transição S6 AMBER → RED (Crise Macro)

| Campo | Valor |
|---|---|
| **Categoria** | Macro / Triggers |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 3 × 4 = **12** 🟠 ALTO |
| **Owner (RACI)** | CSO + CFO (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S6 + D3-MULTIVARIATE-SENSITIVITY.md |
| **Status** | ATIVO |

**Descrição**: S6 funciona como governor: AMBER aplica multiplier 1.5x sobre as outras prescrições; RED aplica 2.0x. Transição AMBER→RED requer: composite ≥ 88 OR 4 dimensões simultaneamente em RED. Custos incrementais: AMBER +R$ 55-65M, RED +R$ 165-200M. Composite score atual depende de S7 (kill switch ativo = 95 fixo) — quindi S6 triggers são secundários até S7 ser resolvido.

**Trigger**: Cualquiera de las 4 condiciones que activan modo crise: (a) composite ≥ 88, (b) T-MV1 (4-shock simultâneo), (c) T-MV4 (CVaR95 breach), (d) CVaR 95% realizado > R$ 10.14bi.

**Mitigação Primária**: Monitoreo diario del macro environment: FX, lítio, tariff, demanda — cualquier mudança de status en cualquier dimensión dispara revisión; tener pre-aprobado plan de respuesta a crisis (freeze de capex, activación de instrumentos de stress).

**Mitigação Secundária**: Emergency committee (CEO + CFO + CSO + Head Supply) convened within 60 min de cualquier trigger; protocol de comunicação ao Conselho: 24h maximum; bridge financing R$ 800M pré-aprovado para activación inmediata.

---

#### R022 | Recessão Brasil + Fiscal Crisis (S6 RED Permanently)

| Campo | Valor |
|---|---|
| **Categoria** | Macro / Triggers |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 3 × 3 = **9** 🟡 MÉDIO |
| **Owner (RACI)** | CFO + CSO (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S6 |
| **Status** | ATIVO |

**Descrição**: Cenário de stress macro (-2σ): recessão brasileira combinada com fiscal crisis pós-eleição 2026. Impacto: demanda EV cai 20-30% (consumer comprastamp protection), FX se deteriora aún más (BRL 7.0+), condições de borrowing se deterioram (spreads > 500bps). Composite score neste cenário: 88-95 (modo crise).

**Trigger**: PIB Brasil negativo por 2 trimestres consecutivos; rating de sovereign outlook negativo ou downgrade; cualquier crisis de balanço de pagamentos; política monetária restritiva por > 12 meses.

**Mitigação Primária**: Stress test anual con scenario de recessão: verificar que el programa sobrevive con VaR 8.21bi y CVaR 10.14bi; mantener liquidity buffer de R$ 500M mínimo; no comprometer capital en projects irreversíveis hasta que macro sea clearer.

**Mitigação Secundária**: Plan B: downsizing de capex (pausar fase 2, focus en SKD only);另找 fuentes de financiamiento (China Exim Bank, IDB, CAF); evaluar продажу de activos no-core (land bank, inventory excesso) para gerar cash.

---

#### R023 | Condições Climáticas Adversas Afetando Produção ou Supply

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 2 (Baixa) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 2 × 2 = **4** 🟢 BAIXO |
| **Owner (RACI)** | COO + Head Manufacturing (R); COO (A) |
| **Fonte** | D3-MAIN.html §S8 |
| **Status** | MITIGADO |

**Descrição**: Eventos climáticos extremos (enchentes na Bahia, secas affecting hydroelectric generation, disruptões logísticas por condições climáticas) podem afetar produção local ou supply chain de componentes. Risco BAIXO porque: (a) planta Camaçari em região de baixo risco climático relativo; (b) BYD tem múltiplas rotas de supply; (c) inventory buffer mitiga interrupções de curta duração.

**Trigger**: Alguma kejadian de production stop por > 5 dias devido a clima; cualquier disruption de supply chain atribuível a evento climático (portos, transporte terrestre).

**Mitigação Primária**: Inventory policy: 60 dias de safety stock para componentes críticos; plantas industriais em área non-flood prone (due diligence ambiental concluída); insurance coverage para business interruption due to climate events.

**Mitigação Secundária**:另找 routing de supplies (portos alternativos: Suape, Natal); dual-sourcing para componentes de alto valor (baterias, motors) para evitar single point of failure; crisis response plan para eventos climáticos extremos.

---

### CATEGORIA: FINANCEIRO / FX (continuação)

---

#### R024 | Risco de Illiquidity no Curto Prazo (Cash Gap > R$ 300M)

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 3 × 2 = **6** 🟡 MÉDIO |
| **Owner (RACI)** | CFO (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S1 |
| **Status** | ATIVO |

**Descrição**: Gap de liquidez no curto prazo pode ocorrer se: (a) BNDES funding está bloqueado (lista suja), (b) hedge de FX não é suficiente para cover variação cambial, (c) capex program não reduziu expenses sufficiently. Cash gap > R$ 300M требует atenção imediata; > R$ 500M triggers covenant review. Atual situação de lista suja уже bloqueia R$ 800M de funding, mas cash position atual unknown.

**Trigger**: Cash position < R$ 200M por > 15 dias; qualquer covenant violation; inability to pay suppliers within terms (> 30 days overdue);any indication de investor ou банк concerned about liquidity.

**Mitigação Primária**: Cash management semanal: monitoramento de recebíveis, payables, e capex commitments; linha de crédito contingente pré-aprovada de R$ 500M (reverificar); Prioridade: não iniciar novos projetos de capex hasta que funding esteja resuelto.

**Mitigação Secundária**:另找 fuentes de liquidity: vendor financing de fornecedores (，让他们延迟 payment terms), sale-and-leaseback of equipment ou property; downsize temporário de operaciones (reducir SKD imports, focus em productos de alta rotación).

---

#### R025 | Infracción de Covenant Financiero (BNDES, Bancos Privados)

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 3 × 3 = **9** 🟡 MÉDIO |
| **Owner (RACI)** | CFO + Legal (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S7-ESG.md §6.1 |
| **Status** | ATIVO |

**Descrição**: Contratos de financiamento com BNDES e bancos privados têm covenants (financial and non-financial). Lista suja pode constituir covenant breach de non-compliance (qualquer investigação gubernamental, qualquer狠狠地 ESG violation). Covenant breach triggers: (a) exigibilidade antecipada (todos os loans tornam-se immediately due), (b) freeze de novos disbursements, (c) penalidades financeiras. R$ 800M+ em financiamentos no universo.

**Trigger**: qualquer notificação de banks sobre potential covenant breach; qualquer ação governamental (MTE, MPT, CGU) que possa ser interpreted as non-compliance; qualquer downgrade de rating que viole financial covenants.

**Mitigação Primária**: Revisão proativa de todos os contratos de financiamento: identificar cláusulas de ESG, material adverse change, e non-compliance;engajar банки early para renegociar términos antes de violation occur; manter fluxo de informação proativo com bancos sobre plano de remediação ESG.

**Mitigação Secundária**: Waiver request: se violation occurs, solicitar waiver imediatamente con план de correção;另找 funding sources: substitui BNDES com China Development Bank, EXIM Bank, ou bancos chineses que não têm as mesmas ESG restrictions; продать activos não-core para pagar debt and reduce exposure.

---

### CATEGORIA: REGULATÓRIO / POLÍTICO (continuação)

---

#### R026 | Parceria Estratégica com VW, Tesla ou Outra Multinacional Cancelada

| Campo | Valor |
|---|---|
| **Categoria** | Regulatório / Político |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 3 × 2 = **6** 🟡 MÉDIO |
| **Owner (RACI)** | Head Strategy + CSO (R); CEO (A) |
| **Fonte** | D3-INTERDEPENDENCY-S7-ESG.md §6.5 |
| **Status** | ATIVO |

**Descrição**: S7 ESG RED (lista suja) dificulta parcerias com outras multinacionais (risco reputacional para o parceiro). VW partnership (PPE platform) pode ser adiada ou suspensa; Tesla partnership era já "muito improvável". Perda de parceria estratégica significa: (a) perda de acesso a tecnologia ou platformas compartilhadas, (b) perda de economies of scale, (c) sinal negativo para investors e banks.

**Trigger**: Cualquier comunicación oficial de potential partner indicando concerns sobre ESG da BYD; cualquier decisão de partner de seguir com alternativa competitor; cualquier mudança de estratégia de partner que exclua BYD.

**Mitigação Primária**: Resolver lista suja o mais rápido possível (R001): это é prerequisite for any partnership; demonstrar remediação ESG com auditoria independent (Big 4); desenvolver narrativa de "empresa transformada" post-incident.

**Mitigação Secundária**:另找 parceiros: outras multinacionais que não têm as mesmas restricciones de ESG (Hyundai, Kia, BMW menos propensos a vetar); explorar parcerias não-equity (joint marketing, co-branding, technology licensing); focus on build organically (sem partnership) si necessário.

---

#### R027 | Crise de Cambio de Governo 2026 (Inversão de Política Industrial)

| Campo | Valor |
|---|---|
| **Categoria** | Macro / Triggers |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 4 (Alto) |
| **Risk Score** | 3 × 4 = **12** 🟠 ALTO |
| **Owner (RACI)** | CEO + Head Gov Relations (R); Conselho (A) |
| **Fonte** | D3-INTERDEPENDENCY-S10-TARIFF.md §9 |
| **Status** | ATIVO |

**Descrição**: Eleições presidenciais Brasil 2026 (segundo turno provável out/2026). Mudança de governo pode significar revisão completa de política industrial, incluindo: tarifas (podem subir mais ou descer), programas de incentivo (IPI, MIX Brasil, BNDES), e regulação de conteúdo local (PORTARIA MME 465/2023 pode ser alterada). Risco binário (não-modelable): mudança de esquerda para direita ou vice-versa muda entirely o landscape regulatório.

**Trigger**: Qualquer sinal claro de mudança de liderança com implicações para política industrial; qualquer候选人的statements sobre política de conteúdo local, tarifas, ou incentives para setor de EV; cualquier movimento de партії políticas para alter the rules of the game.

**Mitigação Primária**: Diversificar lobbying: manter relationships com обе партии (situação e oposição); documentar todo o investment commitments para crear "facts on the ground" que dificultem reversal; involucrar government relations firms con acesso a ambas administrations.

**Mitigação Secundária**: Contingency planning: tener scenario plans para different government outcomes; delay capital commitments until after election if риск de policy reversal é alto;另找 jurisdictions para investimento (México, Argentina) como alternativa si Brasil se torna proibitivo.

---

### CATEGORIA: FINANCEIRO / FX (continuação)

---

#### R028 | Violação de Limite de VaR / CVaR Operacional

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 4 (Alta) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 4 × 3 = **12** 🟠 ALTO |
| **Owner (RACI)** | CFO + Risk Officer (R); CEO (A) |
| **Fonte** | D3-MULTIVARIATE-SENSITIVITY.md §13 |
| **Status** | ATIVO |

**Descrição**: CVaR 95% = R$ 10.14bi é o capital de risco operacional que deve ser provisionado. Qualquer quarter com realized loss > VaR 95% (R$ 8.21bi) ou CVaR breach (> R$ 10.14bi) требует: (a) emergency committee, (b) revisão de composite weights, (c) trigger de learning loop. BCB y Basel III usan ES 97.5% (CVaR 97.5% = R$ 11.11bi) como métrica de capital regulatório — esto debe ser reportado al auditor IFRS7/IFRS9.

**Trigger**: Realized loss > R$ 8.21bi em qualquer quarter; CVaR 95% breach (loss médio given breach > R$ 10.14bi); qualquer violação de límites de VaR operacional establecidos en el policy.

**Mitigação Primária**: Provisionar R$ 10.14bi como capital de riesgo operacional (no mínimo); monitoring diário de P&L vs VaR/CVaR; trigger automático quando realizado se aproxima de 75% do VaR limit.

**Mitigação Secundária**: Emergency committee: revisão de todas as posições de risco; recalibración immediate del modelo (learning loop); suspensión de nuevas inversiones hasta que risk profile retorne a niveles acceptable.

---

#### R029 | Teto de Hedge Atingido (95%) — Zona de Crise

| Campo | Valor |
|---|---|
| **Categoria** | Financeiro / FX |
| **Probabilidade** | 3 (Média) |
| **Impacto** | 3 (Médio) |
| **Risk Score** | 3 × 3 = **9** 🟡 MÉDIO |
| **Owner (RACI)** | CFO + Risk Officer (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S1 |
| **Status** | ATIVO |

**Descrição**: Em modo crise (composite ≥ 88), hedge satura no teto de 95% (não cobre VaR sozinho — VaR 4-shock R$ 8.21bi vs hedge coverage maybe insufficient).覆盖率为 95% no significa 100%: hedge é sempre incompleto (exposição real > hedge coverage due to timing, basis risk, etc.). Gap: se VaR = R$ 8.21bi y hedge = 95% de exposed amount, resto R$ 410M+ queda sobre patrimonio.

**Trigger**: Composite ≥ 88 (modo crise) por > 5 dias úteis; qualquer scenario onde hedge 95% seja insuficiente para cover loss; cualquier сигнал de que exposición реально é mayor que модель предполагает.

**Mitigação Primária**: Pre-positioned liquidity: R$ 500M disponible in 48h for margin calls and hedge gap; tener líneas de crédito pre-aprobadas de R$ 500M adicionales; no esperar hasta composite ≥ 88 — actuar preventiva cuando cualquier dimensión individual está em RED.

**Mitigação Secundária**:另找 instrumentos: FX options (より高い premium pero mejor protection in tail scenarios); структурные продукты с участием банка; Sale of assets não-core to raise cash; renegociar condições de hedge с банком (less collateral required, more flexibility).

---

### CATEGORIA: OPERACIONAL (continuação)

---

#### R030 | Greve ou Paralização de Mão de Obra na Planta

| Campo | Valor |
|---|---|
| **Categoria** | Operacional |
| **Probabilidade** | 2 (Baixa) |
| **Impacto** | 2 (Baixo) |
| **Risk Score** | 2 × 2 = **4** 🟢 BAIXO |
| **Owner (RACI)** | Head HR + COO (R); CEO (A) |
| **Fonte** | D3-MAIN.html §S8 |
| **Status** | ATIVO |

**Descrição**: Greves de trabalhadores (sindicatos, movimiento obrero) podem paralisar produção em Camaçari parcial ou totalmente. Brazil tiene histórico de greves sectoriales (metalúrgicos, automobile workers). Duração típica: 3-15 días. Impacto directo: loss of production (~R$ 5M por dia de paralização), plus riesgo reputacional (se linked to working conditions, pode exacerbar ESG issues).

**Trigger**: Cualquier notice de sindicato sobre intención de huelga; cualquier ação industrial (sindicato, movimento) pidiendo negociación; qualquer situación de lockout.

**Mitigação Primária**: Employee relations proativas: mantener diálogo abierto com sindicatos; competitive compensation y beneficios; compliance estrito com legislação trabalhista (CLT, conventions coletivas);code of conduct con zero tolerance para violations de derechos laborales.

**Mitigação Secundária**: Contingency de producción: tener algún nivel de inventory de productos terminados para absorber gap de 2 semanas;另找 временный mão de obra (contratistas) para manutenção de operaciones durante huelga; communication plan para stakeholders (customers, suppliers, banks) sobre plan de continuidade.

---

## Plano de Resposta por Categoria {#respostas}

### Resumo de Mitigações por Categoria

| Categoria | # Riscos | Mitigação Primária | Mitigação Secundária |
|---|---|---|---|
| **ESG/Reputacional** | 3 | Resolver lista suja (R001) + compliance audit | Kill switch protocol + PR crisis plan |
| **Financeiro/FX** | 5 | Hedge ≥ 60% CVaR 4-shock (R$ 6.1bi) | Bridge financing + covenant renegotiation |
| **Supply Chain** | 3 | Dual-sourcing EVE+CATL + estoque 90d | Spot market + verticalização acelerada |
| **Regulatório/Político** | 4 | Lobbying + advocacy MDIC/Camex |另找 fontes de funding + downsizing |
| **Tarifário** | 2 | Nacionalização 50%+ antes jan/2027 | Mix shift + CBU imports como bridge |
| **Competitivo** | 3 | Diferenciação não-preço + rede carregamento | Tier 3 defensivo + fleet channel |
| **Operacional** | 4 | Aceleração ramp + demanda stimulation | Discount selectivo + downsizing |
| **Macro/Triggers** | 3 | Monitoramento diário + pre-positioned liquidity | Emergency committee + bridge financing |

---

## Métricas de Monitoramento

### Dashboard de Riscos (atualização mensal)

| Métrica | Target | Alert | Critical |
|---|---|---|---|
| Hedge Ratio (FX) | ≥ 80% | 60-80% | < 60% |
| Estoque Lítio (dias) | ≥ 75 | 60-75 | < 60 |
| Tarifa Efetiva Blend | < 22% | 22-30% | > 30% |
| Composite Score | < 73 | 73-88 | ≥ 88 |
| Lista Suja Status | Forada da lista | Em processo de remediação | Na lista |
| Market Share BYD | > 12% | 8-12% | < 8% |
| Capacidade Local (Camaçari) | > 70% | 50-70% | < 50% |
| Utilização Setorial | > 40% | 30-40% | < 30% |

---

## Histórico de Versões

| Versão | Data | Autor | Mudanças |
|---|---|---|---|
| 1.0 | 21/jul/2026 | CSO + CFO | Versão inicial — 30 riscos das 8 categorias D3 v2.0 |

---

**Documento**: D3-RISK-REGISTER.md · v1.0
**Projeto**: BYD Camaçari 2025-2027 · D3 v2.0
**Data**: 21 de julho de 2026
**Classificação**: Confidencial · Conselho Deliberativo
**Fontes**: D3-MAIN.html, D3-INTERDEPENDENCY-S7-ESG.md, D3-INTERDEPENDENCY-S10-TARIFF.md, D3-INTERDEPENDENCY-S11-COMPETITION.md, D3-MULTIVARIATE-SENSITIVITY.md
