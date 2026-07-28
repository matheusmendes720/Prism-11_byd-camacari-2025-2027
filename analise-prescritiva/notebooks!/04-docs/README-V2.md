# Notebooks! — guia consolidado V2

> **Case:** BYD Camaçari 2025–2027  
> **Pasta:** `analise-prescritiva/notebooks!/`  
> **Atualização:** julho de 2026  
> **Comece pelo mapa detalhado:** [`INDICE.md`](INDICE.md)

---

## 1. Status da pasta `notebooks!`

Esta pasta contém duas coleções complementares: **11 notebooks didáticos L0–L10** e **15 notebooks canônicos NB-01–NB-15**. A primeira ensina os conceitos; a segunda implementa o case. Juntas, elas conectam alfabetização estatística, modelagem, validação, decisão e comunicação executiva.

### Inventário resumido

| Sistema | Quantidade | Status | Finalidade |
|---|---:|---|---|
| **L0–L10 didático** | 11 | ✅ presentes | aprender do fundamento ao framework de decisão |
| **NB-01–NB-15 canônico** | 15 | ✅ presentes | reproduzir a análise aplicada e prescritiva |
| Espelhos `.py` | parcial | ✅ apoio | execução, inspeção e versionamento de código |
| Notas `.md` de notebooks | parcial | ✅ apoio | leitura rápida de conteúdos selecionados |
| `LINHAGEM.md` | 1 | ✅ presente | roteiro narrativo/linhagem para vídeo |
| `README.md` original | 1 | ✅ legado | índice inicial da progressão didática |
| `INDICE.md` | 1 | ✅ novo | crosswalk L* ↔ NB-* ↔ D2 e trilhas |
| `README-V2.md` | 1 | ✅ este arquivo | status, orientação e quick reference |

### L0–L10: status individual

| Nível | Arquivo | Status | Núcleo |
|---|---|---|---|
| L0 | `l0-statistics-fundamentals.ipynb` | ✅ | estatística descritiva |
| L1 | `l1-probability-uncertainty.ipynb` | ✅ | probabilidade e incerteza |
| L2 | `l2-hypothesis-testing.ipynb` | ✅ | hipóteses e significância |
| L3 | `l3-linear-regression.ipynb` | ✅ | regressão e drivers |
| L4 | `l4-time-series.ipynb` | ✅ | séries temporais |
| L5 | `l5-volatility-garch.ipynb` | ✅ | volatilidade, GARCH, VaR/CVaR |
| L6 | `l6-monte-carlo.ipynb` | ✅ | simulação e cenários |
| L7 | `l7-multivariate-analysis.ipynb` | ✅ | dependência multivariada |
| L8 | `l8-optimization.ipynb` | ✅ | objetivo, restrições e trade-offs |
| L9 | `l9-game-theory.ipynb` | ✅ | competição e equilíbrio |
| L10 | `l10-decision-framework.ipynb` | ✅ | score, triggers e governança |

### NB-01–NB-15: cobertura funcional

A série canônica está coberta de ponta a ponta: **PTAX/GARCH (NB-01), supply chain/HHI (NB-02), regulação (NB-03), competição (NB-04/NB-09), índice composto (NB-05), Monte Carlo (NB-06), acoplamentos (NB-07), backtesting (NB-08/NB-11), árvores (NB-10), sensibilidade (NB-12), triggers (NB-13), NPV (NB-14) e dashboard (NB-15)**.

Há artefatos alternativos ou históricos, como `nb-08-monte-carlo-multivariate.ipynb`, além da sequência principal. Não os interprete automaticamente como um novo passo canônico; use os nomes funcionais e o [`INDICE.md`](INDICE.md) para desambiguação.

---

## 2. Invenção recente: os notebooks L* (jul/2026)

A série L* foi criada em julho de 2026 para resolver uma lacuna concreta: os notebooks canônicos registravam **o que o projeto fazia**, mas exigiam repertório prévio para explicar **por que o método fazia sentido**. O novo percurso insere uma camada de ensino entre a pergunta executiva e o código de produção.

### Princípio narrativo

Cada notebook didático segue, em espírito, esta ordem:

```text
Conceito → intuição → matemática mínima → código → visualização
         → aplicação BYD → limite/pegadinha → pergunta executiva
```

Isso permite que públicos diferentes compartilhem o mesmo vocabulário. O júnior aprende a não confundir média com dispersão; o pleno entende a mecânica do modelo; o sênior identifica premissas frágeis e consequências de governança.

### Três blocos de aprendizagem

1. **Fundação — L0 a L2:** como descrever dados, representar incerteza e separar sinal de ruído.
2. **Núcleo analítico — L3 a L6:** como modelar drivers, tempo, volatilidade e cenários.
3. **Decisão — L7 a L10:** como tratar dependências, otimizar escolhas, antecipar concorrentes e governar ações.

### O que a série L* não é

- Não substitui NB-01–NB-15: prepara e explica a leitura deles.
- Não substitui D2: o notebook privilegia interação; o study note privilegia derivação, limitações e referência.
- Não substitui D3: L10 introduz a arquitetura; D3 detalha thresholds, acoplamentos, NPV, RACI e operação.
- Não garante causalidade só porque há regressão ou correlação; essa distinção deve permanecer explícita.
- Não transforma forecast em decisão automaticamente: a camada prescritiva exige objetivo, restrições, trigger, ação, owner e registro.

### Como saber se o L* cumpriu seu papel

Ao terminar um nível, o leitor deve conseguir formular uma pergunta melhor para o próximo. Exemplos: L0 — “qual é a dispersão?”; L2 — “qual erro estamos dispostos a aceitar?”; L5 — “a volatilidade é persistente?”; L8 — “qual restrição está ativa?”; L10 — “quem age quando o estado muda?”.

---

## 3. Como ler — três trilhas

Os tempos são orientativos e assumem execução seletiva das células, sem refazer todas as extensões. As trilhas são atalhos por perfil, não certificações.

### Trilha Júnior — 2 horas

**Objetivo:** ler análises com segurança e fazer perguntas estatísticas corretas.

| Etapa | Material | Tempo | Foco |
|---|---|---:|---|
| 1 | este README + seções 1–2 do `INDICE.md` | 10 min | mapa da base |
| 2 | L0 | 20 min | centro, dispersão, percentis, correlação |
| 3 | L1 | 25 min | probabilidade, condicional e incerteza |
| 4 | L2 | 20 min | p-valor, intervalo, erros I/II |
| 5 | L4 | 25 min | tendência, sazonalidade e estacionariedade |
| 6 | tour visual no NB-01 + consulta D2 | 20 min | reconhecer aplicação e localizar aprofundamento |

**Checklist de saída:** explicar por que correlação não implica causalidade; distinguir risco de incerteza; perguntar pela janela da amostra; identificar falso positivo; reconhecer que dados temporais não são observações independentes comuns.

### Trilha Pleno — 4 horas

**Objetivo:** reproduzir o pipeline quantitativo e entender suas dependências.

| Etapa | Material | Tempo | Foco |
|---|---|---:|---|
| 1 | L4, L5 e NB-01 | 55 min | PTAX, retorno, GARCH e risco condicional |
| 2 | L6, L7 e NB-06 | 60 min | simulação correlacionada e caudas |
| 3 | NB-02, NB-05 e NB-07 | 45 min | concentração, score e acoplamentos |
| 4 | L8, NB-12 e NB-14 | 45 min | sensibilidade, restrições e NPV |
| 5 | L10, NB-13 e NB-15 | 40 min | trigger, governança e comunicação |
| 6 | NB-08/NB-11 + D2 L5.0 | 15 min | backtesting e falsos alertas |

**Checklist de saída:** rastrear uma premissa até o dashboard; diferenciar forecast, simulação e stress; testar impacto de correlação; localizar thresholds; explicar como mudança de cenário afeta score, ação e NPV.

### Trilha Sênior — 3 horas

**Objetivo:** fazer challenge metodológico e de governança sem reler todo o percurso básico.

| Etapa | Material | Tempo | Foco |
|---|---|---:|---|
| 1 | `INDICE.md` + L10 | 35 min | arquitetura e linguagem comum |
| 2 | NB-05, NB-12, NB-13, NB-14, NB-15 | 70 min | síntese, fragilidade, trigger, valor e comunicação |
| 3 | NB-08/NB-11 | 20 min | qualidade histórica e custo de erro |
| 4 | D2 L5.0, L6.0, L6.1 e L4.2 | 35 min | calibração, cauda, stress e gap modelo-humano |
| 5 | base D3 | 20 min | acoplamentos, RACI, action register e gates |

**Checklist de saída:** identificar a premissa dominante; exigir evidência out-of-sample; definir tolerância a falso positivo/negativo; verificar override e audit trail; perguntar se a ação é executável e se preserva valor em mais de um cenário.

---

## 4. Conexões com as bases de estudo

### D2 — profundidade econométrica

A base `../../d2-econometric-vulnerability/_study_notes/` é o aprofundamento principal para estatística, EDA, séries, volatilidade e risco. Use:

- `AA-como-ler-este-projeto.md` para orientação;
- `L0.0`–`L0.3` para vocabulário, estatística e distribuições;
- `L1.0`–`L1.2` para EDA de PTAX, supply chain e matriz de variáveis;
- `L2.0`–`L2.2` para arquitetura, GARCH e Monte Carlo/stress;
- `L3.0`–`L3.2` para matrizes, triggers, RACI e action register;
- `L4.0`–`L4.2` para comunicação, dashboard e gap humano;
- `L5.*` e `L6.*` para calibração, interpretabilidade, caudas e stress institucional;
- `ZZ-glossario-formulas.md` como referência rápida.

**Padrão de navegação:** notebook L* para aprender → NB-* para ver aplicação → D2 para investigar fórmula, hipótese, diagnóstico ou limitação.

### D3 — profundidade prescritiva

A base D3 vive em `../reports/decision-framework/` e complementa o final da progressão. Ela é indicada quando a pergunta muda de **“qual é o risco?”** para **“o que deve acontecer agora?”**. Procure nela:

- dimensões e estados do framework;
- matriz de triggers e política de thresholds;
- acoplamentos entre sinais;
- árvores/playbooks de decisão;
- camada de NPV e priorização econômica;
- RACI, gates, action register e auditabilidade;
- comunicação executiva do estado e da ação.

**Padrão de navegação:** L8/L10 dão a intuição → NB-10/NB-13/NB-14 materializam a decisão → D3 documenta regras e governança → NB-15 apresenta o estado final.

### D2 e D3 não são sinônimos

| Base | Pergunta dominante | Evidência típica | Saída |
|---|---|---|---|
| **D2** | quanto risco existe e como foi estimado? | séries, distribuições, GARCH, VaR/CVaR, stress | diagnóstico e cenário |
| **D3** | qual ação é indicada e como será governada? | score, estado, threshold, acoplamento, NPV | decisão, owner e registro |

A passagem D2 → D3 deve ser explícita. Um número quantitativo só vira decisão quando há regra, contexto, custo de erro, responsável e possibilidade de revisão.

---

## 5. Quick reference

| Conceito ou dúvida | Notebook didático | Notebook canônico | Documento de estudo |
|---|---|---|---|
| média, percentil, dispersão | L0 | NB-02/NB-05 | D2 `L0.2-estatistica-descritiva.md` |
| correlação não é causalidade | L0/L3 | NB-06/NB-07/NB-12 | D2 `L1.2-eda-variaveis-expandidas-matriz.md` |
| probabilidade e valor esperado | L1 | NB-03/NB-06 | D2 `L0.3-probabilidade-distribuicoes.md` |
| p-valor e erros I/II | L2 | NB-08/NB-11 | D2 `L5.0-calibracao-regime-switching.md` |
| coeficiente, R² e driver | L3 | NB-12/NB-14 | D2 `L2.0-arquitetura-modelagem.md` |
| tendência e estacionariedade | L4 | NB-01 | D2 `L1.0-eda-pTAX-passo-a-passo.md` |
| volatilidade condicional/GARCH | L5 | NB-01 | D2 `L2.1-modelos-vol-garch-gjr.md` |
| VaR, CVaR e cauda | L5/L6 | NB-01/NB-06 | D2 `L2.2-cambio-stress-test-monte-carlo.md`, `L6.0-risco-cauda-extremo.md` |
| Monte Carlo e percentis | L6 | NB-06 | D2 `L2.2-cambio-stress-test-monte-carlo.md` |
| HHI e concentração | L0/L7 | NB-02 | D2 `L1.1-eda-supply-chain-trade-balance.md` |
| matriz de correlação/fatores | L7 | NB-06/NB-07 | D2 `L1.2-eda-variaveis-expandidas-matriz.md` |
| acoplamentos de risco | L7/L8 | NB-07 | D3 decision framework |
| função objetivo e restrições | L8 | NB-10/NB-12/NB-14 | D2 `L3.0-matrizes-decisao.md` |
| payoff e equilíbrio de Nash | L9 | NB-04/NB-09 | D3 + notebooks de game theory |
| composite score e radar | L10 | NB-05 | D2 `L3.0-matrizes-decisao.md` |
| backtesting/falso positivo | L2/L10 | NB-08/NB-11 | D2 `L5.0-calibracao-regime-switching.md`, `L4.2-gap-modelo-humano.md` |
| árvore e caminho de decisão | L8/L10 | NB-10 | D3 decision framework |
| threshold e trigger | L10 | NB-13 | D2 `L3.1-trigger-matrix-auto-trigger.md` |
| impacto econômico/NPV | L3/L6/L8 | NB-14 | D2 `L3.0-matrizes-decisao.md` + D3 |
| RACI e action register | L10 | NB-13/NB-15 | D2 `L3.2-raci-action-register.md` |
| dashboard para Conselho | L10 | NB-15 | D2 `L4.0-comunicacao-conselho.md`, `L4.1-dashboards-executivos.md` |
| fórmula esquecida | L0–L10 | qualquer NB | D2 `ZZ-glossario-formulas.md` |

### Decisão rápida: qual arquivo abrir agora?

- **“Não entendi o conceito.”** Abra o L* correspondente.
- **“Quero ver como foi calculado no case.”** Abra o NB-* correspondente.
- **“Preciso conferir fórmula, premissa ou limitação.”** Abra o L-doc D2.
- **“Preciso saber o que fazer, quando e por quem.”** Abra NB-10/NB-13/NB-14 e a base D3.
- **“Preciso apresentar o estado atual.”** Abra NB-15 e D2 L4.0/L4.1.
- **“Ainda não sei por onde começar.”** Use uma das três trilhas acima ou o crosswalk completo em [`INDICE.md`](INDICE.md).

---

**Convenção importante:** “L* notebook” nesta pasta e “L-doc D2” na base de estudo usam letras semelhantes, mas são sistemas distintos. Sempre cite o caminho ou o nome completo do arquivo em discussões, issues e revisões.
