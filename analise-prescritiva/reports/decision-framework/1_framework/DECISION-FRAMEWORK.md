# Decision Framework — A camada que falta entre as sessões

**Companion doc**: `D2-AUDIT.md` (verificação) · `D3-PRESCRIPTIVE-SPEC.md` (especificação)
**Data**: 21/jul/2026
**Status**: Working draft

---

## 1. A tese

O D2 trata as 6 sessões como **dimensões paralelas** que se somam no composite. Isso é matematicamente correto mas operacionalmente cego: as prescrições das 6 sessões têm **acoplamentos fortes** que, ignorados, geram contradições internas (ex.: hedge dimensionado pelo ViE pressupõe que S3 está aprovado; dual-sourcing pressupõe que S6 sustenta a narrativa política).

A tese deste framework é:

> **D3 precisa de um modelo de interdependência explícito, com 5 camadas funcionais (Data, Signal, Decision, Action, Learning) e um sistema de controle que opera continuamente sobre essas camadas.**

A metáfora: D2 é o **raio-X** (estático, mostra o estado). D3 é o **sistema nervoso autônomo** (percebe, decide, age, aprende).

---

## 2. Arquitetura: as 5 camadas

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 5: LEARNING                                           │
│   Post-mortem · re-calibração de D2 · atualização de modelo │
└──────────┬──────────────────────────────────────────────────┘
           │ feedback loop (trimestral)
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 4: ACTION                                             │
│   Action register · owner · approval gate · KPI tracking    │
└──────────┬──────────────────────────────────────────────────┘
           │ execução
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 3: DECISION                                           │
│   Decision trees · scenario branching · cost-benefit       │
└──────────┬──────────────────────────────────────────────────┘
           │ acionamento por sinais
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 2: SIGNAL                                             │
│   Trigger matrix · semáforo por dimensão · heat-map        │
└──────────┬──────────────────────────────────────────────────┘
           │ contínuo
┌──────────┴──────────────────────────────────────────────────┐
│ Layer 1: DATA                                               │
│   D2 sessions · composite · refresh automático            │
└─────────────────────────────────────────────────────────────┘
```

### Layer 1 — Data (D2 vive aqui, inalterado)
- 6 sessões com refresh programado
- Composite recomputado a cada refresh
- BCB SGS auto-pull (PTAX, IPCA, PIB, FGV), CCEEE/MDIC (regulatório), MDIC/ANFAVEA (macro)

**Quem opera**: dados, time de analytics
**Cadência**: diária (PTAX), mensal (macro), trimestral (revisão de composite)

### Layer 2 — Signal (a primeira coisa que D3 adiciona)
Cada sessão emite **3 sinais**: 🟢 GREEN, 🟡 AMBER, 🔴 RED.

| Sessão | GREEN | AMBER | RED |
|---|---|---|---|
| S1 Câmbio | PTAX em [4.80, 5.30] | PTAX em [4.50, 4.80) ou (5.30, 5.50] | PTAX < 4.50 ou > 5.50 |
| S1 Câmbio (vol) | vol 30d < 13% | vol 30d 13-18% | vol 30d > 18% |
| S2 Supply | HHI < 3500 | HHI 3500-4500 | HHI > 4500 |
| S3 Regulatório | Rota 2030 + BNDES aprovados | BNDES pendente | Rollback parcial/total |
| S4 Competitivo | BYD share > 32% | BYD 28-32% | BYD < 28% |
| S6 Macro | PIB > 0, IPCA < 5% | PIB próximo 0, IPCA 5-6.5% | PIB < 0, IPCA > 6.5% |

**Composite signal**: soma ponderada dos sinais individuais.
- Todos 🟢 → composite "no regime base"
- 1+ 🟡 → composite "alerta amarelo, revisar plano"
- 2+ 🟡 ou 1+ 🔴 → composite "acionar D3 playbook"

**Quem opera**: analytics + risk officer
**Cadência**: tempo real (alertas via Slack/email quando semáforo muda)

### Layer 3 — Decision (o coração do D3)

Para cada **combinação de sinais** relevante, há uma **decision tree** prescritiva. Exemplo:

```
IF S1 = RED (PTAX > 5.50) AND S6 = GREEN (PIB > 0)
  → Ativar tranche adicional de hedge (de 50% para 75%)
  → Acelerar revisão de pricing defensivo (S4)
  → NÃO repriorizar supply chain (PIB forte sustenta demanda)
ELIF S1 = RED AND S6 = RED (PTAX > 5.50 + PIB < 0)
  → Cenário de stress máximo
  → HEDGE 100% da exposição remanescente
  → Acionar bridge financing BNDES (S3 plano B)
  → Cortar capex não-essencial em S2 (preservar liquidity)
  → Pricing defensivo vira agressivo (proteger volume)
ELIF S2 = RED (HHI > 4500) AND S3 = GREEN
  → Janela de oportunidade: BNDES + content local narrative
  → Acelerar dual-sourcing com co-financiamento federal
  → Investimento em refinaria de lítio vira prioridade #1
ELSE (todos GREEN ou AMBER)
  → Plano base de D2
```

**Decision trees não são exaustivas** — só cobrem as ~12 combinações de sinais materialmente distintas. Para combinações raras, fallback para "plano base + comitê de crise".

**Quem opera**: time de planejamento estratégico (reunião semanal)
**Cadência**: semanal (status meeting) + on-demand (quando sinal muda)

### Layer 4 — Action (a ponte com execução)

Toda decisão vira uma **action item** registrada:

| Field | Value |
|---|---|
| ID | ACT-2026-Q3-001 |
| Descrição | Acionar tranche adicional de hedge cambial (de 50% para 75%) |
| Trigger | PTAX > 5.50 em 3 dias úteis consecutivos |
| Decision owner | CFO |
| Approval gate | CEO (R$ > 50M) |
| Deadline | 5 dias úteis |
| KPI de sucesso | Hedge ratio realizado ≥ 70% até data do trigger + 10d |
| KPI de verificação | vol mensal do P&L cambial ≤ 1.5pp |
| Status | pending / in_progress / done / failed |
| Post-mortem | (preenchido 90 dias após done) |

**Quem opera**: PMO + donos de ação
**Cadência**: status semanal + flash report mensal ao board

### Layer 5 — Learning (o que diferencia D3 de um dashboard)

Trimestralmente:
- Comparar **previsto vs. realizado** de cada KPI de ação
- Recalibrar **elasticidades** (D2 tinha pressuposto: "PIB r=+0.59 com vendas". Real: 0.62? 0.55?)
- Atualizar **trigger thresholds** se a distribuição empírica mudou
- Documentar **"decisões que não tomamos e deveríamos"** (post-mortem inverso)
- Repriorizar **próximo trimestre** com base no learning

**Quem opera**: Chief Strategy Office + risk officer
**Cadência**: trimestral

---

## 3. As 3 decisões críticas que D3 destrava

### Decisão 1: Aprovar o pacote de mitigação base (R$ 12M + R$ 280M + R$ 80M/ano)?

**D2 não responde isso com rigor.** D3 responde com:

- **Análise de sensibilidade**: composite projetado em 4 cenários (base, hedge-only, dual-sourcing-only, full-pack)
- **NPV esperado**: valor presente da redução de risco (com taxa de desconto ajustada a risco soberano)
- **Cenário de não-aprovação**: o que acontece com o programa em 12/24/36 meses
- **Pontos de reversão**: em que cenário a recomendação muda

### Decisão 2: Qual a sequência ótima de execução?

**D2 diz**: regulatório → supply → câmbio → competitivo. Mas assume linearidade e controle total.

**D3 responde com**:
- **Critical path analysis**: quais ações precisam estar prontas antes de outras começarem?
- **Dependências temporais**: ex. BNDES PMP (S3) só pode ser acionado após marco regulatório (jun/2026), o que atrasa a alavancagem de S2
- **Janela de oportunidade**: certas ações só fazem sentido em janelas específicas (advocacy pré-voto Congresso, dual-sourcing antes da CATL travar contratos 2027)

### Decisão 3: Quando pivotar vs. perseverar?

**D2 não diz.** D3 define:

- **Triggers de pivô**: combinação de sinais que indica "plano A não funciona, ativar plano B"
- **Triggers de perseverança**: combinação que indica "manter curso apesar do ruído"
- **Critérios de saída**: quando abortar uma iniciativa (ex.: CATL recusar 2ª fonte por 18 meses, abandonar EVE Energy e pivotar para Gotion)

---

## 4. Como as 6 sessões conversam no framework

### Mapeamento atual (D2) vs. mapeamento target (D3)

| Relação | D2 trata como | D3 trata como |
|---|---|---|
| S1 ↔ S2 | Independentes | Acopladas: a redução de exposição em S1 depende de quanto S2 reduz risco sistêmico |
| S1 ↔ S3 | Independentes | Acopladas: o sizing do hedge depende do ViE residual pós-S3 |
| S2 ↔ S4 | Independentes | Acopladas: o break-even do pricing defensivo depende do capex de dual-sourcing |
| S2 ↔ S6 | Independentes | Acopladas: a narrativa de "substituição de importações" financia politicamente o S2 |
| S3 ↔ S4 | Independentes | Acopladas: incentivos S3 entram no break-even do preço S4 |
| S6 → todas | Descritivo (correlação) | Prescritivo (auto-trigger) |

**O framework D3 formaliza essas 6 relações como edges em um grafo de dependência**, e usa o sinal de uma sessão para condicionar a prescrição de outra.

### Grafo de dependências (proposta inicial)

```
       S6 (macro)
      ↙   ↓   ↘
   S1    S2    S3    S4
   ↓     ↓     ↓     ↓
   └──→ composite (71.8) ←──┘
              ↓
        decision tree
              ↓
        action register
```

Interpretação:
- **S6 é raiz**: macro conditiona todas as outras
- **S1-S4 são filhas**: cada uma tem prescrição própria, mas o sizing depende de S6 e do composite
- **Composite agrega**: weighted sum
- **Decision tree age sobre composite**: dispara playbook

---

## 5. RACI matrix (quem decide o quê)

| Decisão | R (Responsible) | A (Accountable) | C (Consulted) | I (Informed) |
|---|---|---|---|---|
| Acionar hedge 50% (base) | Head de Tesouraria | CFO | Head de Sup. Chain | Board |
| Aumentar hedge para 75% (trigger) | Head de Tesouraria | CFO | CEO | Board |
| Aprovar R$ 280M dual-sourcing | Head de Supply Chain | CEO | CFO, Head de IR | Board |
| Aprovar R$ 12M advocacy S3 | Head de IR | CEO | CFO, Head Jurídico | Board |
| Aprovar R$ 320M/ano pricing defensivo | Head Comercial | CEO | CFO, Head de Sup. Chain | Board |
| Pivotar plano (S2 ou S4) | CSO | CEO | CFO, Heads funcionais | Board |
| Acionar bridge financing (S3 plano B) | CFO | CEO | Board, bancos | Acionistas |
| Recalibrar composite | Risk Officer | CFO | Heads funcionais | Board |
| Decretar "modo crise" (S1 RED + S6 RED) | CEO | Board | Toda C-level | Todos |

---

## 6. Cadência operacional

| Frequência | Atividade | Quem |
|---|---|---|
| Diária | Refresh PTAX + vol | Analytics |
| Semanal | Signal review + decision meeting | CSO + CFO + Heads |
| Mensal | Composite update + flash report ao board | Risk Officer |
| Trimestral | Action register review + learning cycle | CSO + Board |
| Semestral | Recalibração D2 (modelo, elasticidades, triggers) | Analytics + CSO |
| Anual | Stress test integrado (MC multivariado) | Risk Officer + Analytics |
| Ad-hoc | Acionamento de trigger (qualquer sinal) | Decision owner + Aprovador |

---

## 7. Roadmap de implementação (D3)

### Fase 1 (Q3 2026 — 8 semanas)
- Modelar **grafo de dependências** entre sessões
- Construir **trigger matrix** (signal layer)
- Definir **RACI** + approval gates
- **Entregável**: decision tree em documento + protótipo de dashboard

### Fase 2 (Q4 2026 — 8 semanas)
- Implementar **action register** (camada 4)
- Modelar **decision tree** com 12 combinações
- Integrar **auto-trigger** com S6 → S1/S2/S3/S4
- **Entregável**: playbook operacional + simulações de stress

### Fase 3 (Q1 2027 — 12 semanas)
- **MC multivariado** integrado (PTX × lítio × demand EV)
- **Cost-benefit layer** com NPV por prescrição
- **Counterfactual baseline** (composite projetado sem mitigação)
- **Entregável**: relatório D3 completo + dashboard executivo

### Fase 4 (ongoing)
- **Learning loop** trimestral
- **Recalibração** semestral
- **Stress test** anual

---

## 8. Métricas de sucesso do próprio framework

- **Latência sinal→ação**: tempo entre trigger e execução (target: < 5 dias úteis)
- **Aderência ao plano**: % de ações concluídas no prazo (target: > 80%)
- **Redução efetiva do composite**: 71.8 → ? (target: 60 em 12 meses)
- **Custo de oportunidade capturado**: R$ evitado em P&L por ação preventiva (medir)
- **Decisões sem owner**: deve ser 0 (todas as ações têm R+A+C+I definidos)
- **Surpresas no board**: % de eventos críticos que chegam ao board sem aviso prévio (target: < 10%)

---

## Próximo passo

Vide `D3-PRESCRIPTIVE-SPEC.md` — especificação detalhada do que D3 deve entregar, em formato OpenSpec-style (Why/What/Impact/Tasks).
