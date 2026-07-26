# D3 — Spec do Set Prescritivo Operacional

**Change ID**: `d3-prescriptive-operational`
**Tipo**: New capability (D3 é um novo tier analítico que se sobrepõe ao D2)
**Status**: Draft para revisão
**Data**: 21/jul/2026
**Companion docs**: `D2-AUDIT.md` (verificação) · `DECISION-FRAMEWORK.md` (arquitetura)

---

## Why

### Problema

O D2 entregou uma fotografia preditiva do programa (composite 71.8/100, 6 sessões paralelas, 18 figuras, 6 prescrições). Mas a auditoria do D2 (vide `D2-AUDIT.md`) identificou **10 gaps estruturais** que impedem o Conselho de tomar uma decisão de aprovação com confiança:

1. Interdependências entre sessões não modeladas
2. Prescrições sem branching condicional
3. Sem NPV / cost-benefit por prescrição
4. Sem counterfactual ("e se não fizéssemos nada?")
5. Triggers dispersos, sem sistema de controle unificado
6. Sem ownership / approval gates
7. Análise competitiva unidirecional
8. Sem MC integrado multivariado
9. Macro é descritivo, não prescritivo
10. Não responde a pergunta de decisão com sensitivity

### Oportunidade

O D3 transforma o D2 de "ferramenta de diagnóstico" em "**sistema operacional de decisão**". Isso é o que permite ao programa passar de "relatório trimestral ao board" para "playbook semanal de gestão de risco".

### Quem se beneficia

- **Conselho / CEO**: decisão de aprovação de R$ 12M + 280M + 80M/ano com sensitivity e pontos de reversão
- **CFO / Risk Officer**: controle contínuo de exposição composta
- **Heads funcionais**: clareza de ownership, gates de aprovação, KPIs por ação
- **IR / Relações Governamentais**: agenda de advocacy sincronizada com o ciclo macro
- **Supply Chain**: dual-sourcing com co-financiamento público, gatilhos de aceleração

---

## What Changes

### Visão

> **D3 = Atlas operacional, com 5 camadas funcionais (Data/Signal/Decision/Action/Learning), operando continuamente sobre o D2, com decision trees acionadas por triggers, action register com ownership, e learning loop trimestral.**

### Capacidades adicionadas (não substituem D2)

| # | Capability | Output | Cadência |
|---|---|---|---|
| C1 | Trigger matrix (sinal por dimensão) | Tabela de 6 dimensões × 3 níveis | Tempo real |
| C2 | Decision tree por combinação de sinais | 12 árvores + fallback | Estática + revisão trimestral |
| C3 | Action register (com RACI) | Tabela com 30+ ações pré-mapeadas | Contínuo |
| C4 | Cost-benefit layer (NPV + counterfactual) | 1 ficha por prescrição | Estática + revisão semestral |
| C5 | MC multivariado (PTX × lítio × demand) | Distribuição do composite | Trimestral |
| C6 | Auto-trigger: S6 → S1/S2/S3/S4 | Regras de revisão automática | Tempo real |
| C7 | Learning loop (post-mortem + recalibração) | Relatório trimestral | Trimestral |
| C8 | Dashboard executivo (4 telas) | UI + relatórios automatizados | Mensal |
| C9 | Sensitivity analysis (perguntas de decisão) | Tabela de cenários | Ad-hoc |

### Output deliverables

- `D3-MAIN.html` (relatório principal, mesma estrutura visual do D2 + novas seções)
- `D3-DECISION-TREES.html` (12 árvores + lógica de seleção)
- `D3-ACTION-REGISTER.html` (tabela de ações com RACI, KPI, status)
- `D3-MC-MULTIVARIATE.html` (distribuição conjunta com cenários)
- `D3-SENSITIVITY.html` (matriz de perguntas-respostas)
- `D3-DASHBOARD.html` (4 telas executivas)
- `decision-framework/` (este pacote de docs)
- `D3-DATA/` (CSVs estruturados para automação futura)

### Mudanças estruturais no D2 (não destrutivas)

- Adicionar **interface de sinais** (cada sessão emite status 🟢/🟡/🔴)
- Adicionar **tabela de interdependências** no composite (mostra como S6 modula S1-S4)
- Adicionar **seção "Operating layer"** no D2 com referência ao D3

---

## Impact

### Specs afetadas (no D2)

- `s1-cambio.html` → add status badge + trigger link
- `s2-supply.html` → add dependency to S6
- `s3-regulatory.html` → add dependency to S1 (sizing)
- `s4-competitive.html` → add dependency to S1+S3 (break-even)
- `s5-composite.html` → add operating layer section
- `s6-macro.html` → upgrade to auto-trigger source
- `d2-cover.html` → add link to D3 if exists

### Code / data

- New: `decision-framework/` (5 docs novos)
- New: `d3-data/` (CSV/JSON com signals, triggers, action register)
- Modified: `atlas-d2-preditiva.html` (add interface layer)

### Users / audiences

- **Tier 1** (decision-makers): Conselho, CEO, CFO, CSO → consultam D3-DASHBOARD mensalmente
- **Tier 2** (operators): Heads funcionais → usam D3-ACTION-REGISTER semanalmente
- **Tier 3** (analysts): Risk Officer, analytics → operam triggers e learning loop

### Risks do próprio D3

| Risk | Mitigação |
|---|---|
| Framework vira burocracia pesada | Cadência mínima (semanal, não diária) + dashboards em vez de reuniões |
| Triggers viram alarmes falsos | Backtesting em 2020-2026 antes de ativar; calibração semestral |
| Ownership ambíguo | RACI explícito por ação + escalation matrix |
| Resistance ao modelo prescritivo | Apresentar D3 como "apoio à decisão", não "substituição do gestor" |
| Custo de implementação Fase 1-2 | ~R$ 1.5M em consultoria + tooling (Fase 1-2); ROI em 6 meses se evitar 1 evento material |

---

## Tasks (roadmap de implementação)

### Fase 1 — Q3 2026 (8 semanas, foundation)

1. **Mapear interdependências** entre S1-S6 formalmente
   - Output: `D3-DEPENDENCY-GRAPH.md`
   - Owner: CSO + Analytics
   - Acceptance: ≥6 edges documentadas com tipo e quantificação

2. **Definir trigger matrix** (6 dimensões × 3 níveis + heatmap agregado)
   - Output: `D3-TRIGGER-MATRIX.md`
   - Owner: Risk Officer
   - Acceptance: backtesting em 2020-2026 com ≤2 falsos positivos por ano

3. **Construir 12 decision trees** (combinações materialmente distintas)
   - Output: `D3-DECISION-TREES.html`
   - Owner: CSO + Heads funcionais
   - Acceptance: cada árvore com 3-5 ações, RACI definido

4. **Definir RACI matrix + approval gates** (todas as ações)
   - Output: `D3-RACI.md`
   - Owner: COO + CFO
   - Acceptance: cada ação com R+A+C+I; threshold de aprovação claro

5. **Documentar action register base** (30+ ações pré-mapeadas)
   - Output: `D3-ACTION-REGISTER.html`
   - Owner: PMO
   - Acceptance: status pending, dono + prazo + KPI para cada uma

6. **Apresentar D3 ao Conselho** (workshop de 2h)
   - Output: deck + ata
   - Owner: CEO
   - Acceptance: Conselho valida framework, autoriza Fase 2

### Fase 2 — Q4 2026 (8 semanas, operacionalização)

7. **Implementar auto-trigger S6 → S1/S2/S3/S4**
   - Output: integração técnica
   - Owner: Eng. de Dados + Risk Officer
   - Acceptance: trigger dispara em ≤5min após detecção; revisão humana obrigatória

8. **Modelar NPV + counterfactual** para as 6 prescrições
   - Output: `D3-COST-BENEFIT.md`
   - Owner: CFO + Analytics
   - Acceptance: 4 cenários (base, hedge-only, dual-sourcing-only, full-pack) com NPV

9. **Construir dashboard executivo** (4 telas)
   - Output: `D3-DASHBOARD.html`
   - Owner: Eng. de Dados
   - Acceptance: refresh automático, 4 visualizações âncora (composite, signals, actions, learning)

10. **Pilotar D3 com 1 sessão** (recomendo: S6 → S1, mais simples)
    - Output: relatório de pilot
    - Owner: Risk Officer
    - Acceptance: 1 ciclo completo de trigger → ação → learning, com lições aprendidas

11. **Estender piloto às 5 sessões restantes** (rolling)
    - Output: D3 em produção
    - Owner: PMO
    - Acceptance: 100% das sessões em operação até final Q4

### Fase 3 — Q1 2027 (12 semanas, quantificação avançada)

12. **Construir MC multivariado** (PTX × lítio × demand EV × IPCA)
    - Output: `D3-MC-MULTIVARIATE.html`
    - Owner: Analytics
    - Acceptance: 5 cenários materialmente distintos; co-dependências capturadas

13. **Calcular sensitivity matrix** (perguntas de decisão)
    - Output: `D3-SENSITIVITY.html`
    - Owner: CSO + Analytics
    - Acceptance: 10 perguntas de decisão com resposta em 4 cenários cada

14. **Documentar game theory layer** (resposta competitiva modelada)
    - Output: `D3-GAME-THEORY.md`
    - Owner: CSO + Marketing
    - Acceptance: pelo menos 2 cenários de resposta (Tesla, VW) modelados

15. **Recalibração D2** (usar learning do 1º trimestre)
    - Output: D2 v2 com elasticidades atualizadas
    - Owner: Analytics
    - Acceptance: ≥3 elasticidades recalibradas com dados empíricos

### Fase 4 — ongoing (a partir de Q2 2027)

16. **Learning loop trimestral** (post-mortem + recalibração)
17. **Recalibração semestral** do modelo
18. **Stress test anual** integrado
19. **Revisão anual do framework** (D3 v2?)

---

## Acceptance criteria (para D3 estar "done")

D3 está pronto quando:

- [ ] As 10 perguntas de decisão do Conselho podem ser respondidas com sensitivity em ≤2 horas
- [ ] Qualquer trigger dispara revisão humana em ≤5 minutos
- [ ] Toda ação tem RACI + KPI + status atualizável
- [ ] Composite é recalculado ≤1 hora após novo dado
- [ ] 100% das prescrições têm NPV + counterfactual
- [ ] Stress test multivariado roda em ≤30 min
- [ ] Learning loop gera insights aplicáveis a cada trimestre

---

## Anti-patterns a evitar

- ❌ D3 vira "D2 com mais gráficos" — sem camada de decisão operacional
- ❌ Decision trees viram "cardápio" sem contexto de cenário
- ❌ Action register vira planilha de tarefas, sem triggers conectados
- ❌ RACI vira "lista de nomes", sem authority para decidir
- ❌ Triggers viram alarmes que ninguém atende
- ❌ Learning loop vira "relatório do que aconteceu", sem insight aplicável
- ❌ D3 vira monolito técnico, sem ownership humano

---

## Dependências externas

- **BCB SGS** (PTAX, IPCA, PIB, FGV): API já disponível
- **ANFAVEA** (vendas mensais): scraping ou partnership
- **MDIC** (regulatório, balança comercial): API limitada, monitoramento manual
- **MDIC/ANP** (lítio, commodities): scraping ou partnership
- **Bloomberg / Refinitiv** (CATL, BYD, Tesla, VW, GM market data): assinatura necessária (CFO decision)

---

## Budget estimado

| Fase | Custo | Quem paga |
|---|---|---|
| F1 (foundation) | R$ 0.5M (headcount interno + tooling) | COO + CFO |
| F2 (operacional) | R$ 1.0M (engenharia + consultoria) | COO + CFO |
| F3 (avançada) | R$ 1.5M (analytics + dados) | CFO |
| F4 (ongoing) | R$ 200k/trimestre | COO |

**Total F1-F3**: R$ 3.0M
**ROI esperado**: 1 evento material evitado (e.g., supply chain disruption 6m) paga o investimento

---

## Próximo passo

1. Revisar este doc com o time (CSO, CFO, Heads funcionais)
2. Se aprovado, abrir Fase 1 — Task 1 (Mapear interdependências)
3. Workshops quinzenais com time para calibrar decision trees
4. Primeiro Council readout: Q4/2026
