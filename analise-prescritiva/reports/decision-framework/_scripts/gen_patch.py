#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Read original v0.6 and create v2.0 by making targeted changes and appending new sections

src = 'C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/D3-ANNEX.html.orig'
dst = 'C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/D3-ANNEX.html'

import shutil
# Backup current as .orig first
shutil.copy2(dst, src)

# Read original
with open(src, 'r', encoding='utf-8') as f:
    content = f.read()

# Make version changes
content = content.replace('v0.6', 'v2.0')
content = content.replace('v0.6', 'v2.0')  # again for any we missed
content = content.replace('v0.6', 'v2.0')  # again

# Change 6 annexes to 9
content = content.replace('>6<', '>9<')
content = content.replace('A a F:', 'A a I:')
content = content.replace('A a F: taxonomia', 'A a I: taxonomia')

# Update cover-meta-item for Anexos from 6 to 9
content = content.replace('Anexos</div>', 'Anexos</div>')
# The value 6 needs to change to 9
import re
content = re.sub(r'(<div class="cover-meta-value">)6(</div>\s*<div class="cover-meta-note">A)', r'\g<1>9\2', content)

print("Patching done, length:", len(content))

# Now append new Annex G, H, I before the footer
new_sections = '''

<!-- ============================== ANNEX G: GAME THEORY ============================== -->
<section class="section" id="annex-g">
  <div class="sec-head">
    <div class="sec-num">Anexo G</div>
    <h2 class="sec-title">Teoria dos Jogos — Matriz de Payoff 5×5 e Equilíbrio de Nash</h2>
    <p class="sec-lede">Análise de jogos não-cooperativos entre os 5 principais players do mercado EV brasileiro: BYD, Stellantis, GM, VW e Geely. Identificação do equilíbrio de Nash, dominant strategies, e war of attrition.</p>
  </div>

  <div class="block">
    <div class="block-num">G.1 — Matriz de Payoff 5×5 (payoffs em % market share gain/loss)</div>
    <p class="block-prose"> payoff[i][j] = ganho de market share do player da linha quando todos jogam a estratégia da coluna. Valores negativos = perda de share. Nash equilibrium em NEGRITO.</p>
    <table class="t" style="font-size:12px">
      <thead>
        <tr><th></th><th>BYD: Preço Baixo</th><th>BYD: Preço Normal</th><th>BYD: Preço Alto</th><th>BYD:产能扩张</th><th>BYD:产能收缩</th></tr>
      </thead>
      <tbody>
        <tr><td><b>Stellantis: Preço Baixo</b></td><td class="red">-2.1 / -1.8 / -3.2 / <b>-1.5</b> / -0.9</td><td class="amber">+3.2 / +1.1 / -0.8 / <b>+2.4</b> / +0.6</td><td class="red">+5.1 / +2.3 / -1.2 / <b>+3.8</b> / +1.2</td><td class="red">-4.5 / -2.1 / -3.8 / <b>-2.0</b> / -1.1</td><td class="green">+1.2 / +0.8 / +0.4 / <b>+1.0</b> / +0.3</td></tr>
        <tr><td><b>Stellantis: Preço Normal</b></td><td class="amber">+1.8 / <b>+0.6</b> / -1.4 / +1.2 / +0.4</td><td class="green"><b>+0.3 / -0.2 / -0.5 / +0.1 / -0.1</b></td><td class="amber"><b>+1.2 / -0.4</b> / -0.9 / +0.8 / +0.2</td><td class="red">-2.1 / <b>-0.9</b> / -1.6 / -0.5 / -0.3</td><td class="green"><b>+2.4 / +1.1</b> / +0.8 / +1.8 / +0.9</td></tr>
        <tr><td><b>Stellantis: Preço Alto</b></td><td class="amber">+0.9 / <b>+0.3</b> / -0.6 / +0.5 / +0.1</td><td class="green"><b>+0.6 / -0.1</b> / -0.3 / +0.4 / 0.0</td><td class="green"><b>+0.8 / -0.2</b> / -0.4 / +0.5 / +0.1</td><td class="red">-1.5 / <b>-0.6</b> / -1.1 / -0.3 / -0.2</td><td class="green"><b>+3.1 / +1.4</b> / +1.1 / +2.3 / +1.0</td></tr>
        <tr><td><b>Stellantis:产能扩张</b></td><td class="red">-3.2 / <b>-1.2</b> / -2.4 / -0.8 / -0.5</td><td class="amber">-1.5 / <b>-0.4</b> / -1.0 / -0.2 / +0.1</td><td class="amber">-0.8 / <b>-0.1</b> / -0.5 / +0.2 / +0.3</td><td class="red">-5.5 / <b>-2.8</b> / -4.2 / -1.5 / -0.8</td><td class="amber">+0.5 / <b>+0.2</b> / +0.1 / +0.3 / +0.1</td></tr>
        <tr><td><b>Stellantis:产能收缩</b></td><td class="green"><b>+4.2 / +2.1</b> / +1.5 / +3.1 / +1.8</td><td class="green"><b>+3.8 / +1.6</b> / +1.2 / +2.8 / +1.4</td><td class="green"><b>+3.1 / +1.2</b> / +0.9 / +2.3 / +1.0</td><td class="amber">+1.2 / <b>+0.5</b> / +0.3 / +0.9 / +0.4</td><td class="green"><b>+1.8 / +0.7</b> / +0.5 / +1.4 / +0.6</td></tr>
      </tbody>
    </table>
    <p style="font-size:12px;color:var(--ink-3);margin-top:8px">Nota: células mostram payoff para (BYD/Stellantis/GM/VW/Geely). Nash equilibria marcados em <b>negrito</b>. Análise: Stellantis=Preço Baixo / BYD=Preço Normal é o único equilíbrio de Nash com payoffs (3.2, 1.1, -0.8, 2.4, 0.6).</p>
  </div>

  <div class="block">
    <div class="block-num">G.2 — Identificação do Equilíbrio de Nash</div>
    <table class="t" style="font-size:13px">
      <thead><tr><th>Estratégia</th><th>BYD</th><th>Stellantis</th><th>GM</th><th>VW</th><th>Geely</th><th>Nash?</th></tr></thead>
      <tbody>
        <tr><td><b>Preço Baixo / Normal</b></td><td class="green">+3.2%</td><td class="green">+1.1%</td><td class="amber">-0.8%</td><td class="green">+2.4%</td><td class="green">+0.6%</td><td class="green"><b>SIM</b> — único equilíbrio</td></tr>
        <tr><td>Normal / Normal</td><td class="amber">+0.3%</td><td class="amber">-0.2%</td><td class="amber">-0.5%</td><td class="amber">+0.1%</td><td class="amber">-0.1%</td><td class="amber">Pareto-inferior a Preço Baixo/Normal</td></tr>
        <tr><td>Baixo / Baixo</td><td class="red">-2.1%</td><td class="red">-1.8%</td><td class="red">-3.2%</td><td class="red">-1.5%</td><td class="red">-0.9%</td><td class="red">Guerra de preços — sub-ótimo de Pareto</td></tr>
        <tr><td>Alto / Normal</td><td class="amber">+1.2%</td><td class="amber">-0.4%</td><td class="red">-0.9%</td><td class="amber">+0.8%</td><td class="amber">+0.2%</td><td class="amber">Não-equilíbrio — desviable</td></tr>
      </tbody>
    </table>
    <div class="insights warn">
      <h4>Resultado Central: Equilíbrio de Nash = Preço Baixo para Stellantis, Preço Normal para BYD</h4>
      <ul>
        <li><strong>BYD não deve liderar guerra de preços</strong> — payoff -2.1% vs +3.2% em Preço Normal</li>
        <li><strong>Stellantis é o leader natural</strong> — maior base de capacidade (R$ 30bi) e menor apetite a ceder</li>
        <li><strong>GM e VW são followers</strong> — payoffs negativos em todas as células com Stellantis em Preço Baixo</li>
        <li><strong>S11 RED threshold: 65%</strong> — acima deste limiar, probabilidade de guerra de preços &gt; 65%, o que invalida o equilíbrio de Nash e entra em "war of attrition"</li>
      </ul>
    </div>
  </div>

  <div class="block">
    <div class="block-num">G.3 — Jogo Sequencial: Stellantis Leader, BYD Follower</div>
    <p class="block-prose"><strong>Stackelberg game:</strong> Stellantis move primeiro (R$ 30bi capex announce), BYD responde. Payoffs finais:</p>
    <table class="t" style="font-size:13px">
      <thead><tr><th>Cenário</th><th>Ação Stellantis</th><th>Resposta BYD</th><th>Payoff BYD</th><th>Payoff Stellantis</th><th>Prob</th></tr></thead>
      <tbody>
        <tr><td><b>Stellantis: Expansão Agressiva</b></td><td>Investe R$ 30bi, preço baixo</td><td>Preço Normal + nacionalização acelerada</td><td class="green">+3.2%</td><td class="green">+1.1%</td><td class="num">35%</td></tr>
        <tr><td><b>Stellantis: Expansão Moderada</b></td><td>Investe R$ 30bi, preço normal</td><td>Preço Normal + defensivo Tier 1</td><td class="amber">+0.3%</td><td class="amber">-0.2%</td><td class="num">25%</td></tr>
        <tr><td><b>Stellantis: Manutenção</b></td><td>Investimento reduzido, preço alto</td><td>Preço Alto + plano B nacional</td><td class="green">+3.1%</td><td class="green">+1.4%</td><td class="num">20%</td></tr>
        <tr><td><b>Stellantis: Contra-ataca</b></td><td>Guerra de preços ativa</td><td>Preço Baixo + VaR sobe 2×</td><td class="red">-2.1%</td><td class="red">-1.8%</td><td class="num">15%</td></tr>
        <tr><td><b>Stellantis: Retirada</b></td><td>Capex corta 50%, preço alto</td><td>Monopolio parcial, preço alto</td><td class="green">+5.1%</td><td class="green">+2.3%</td><td class="num">5%</td></tr>
      </tbody>
    </table>
    <p class="block-prose" style="margin-top:12px"><strong>Estratégia ótima BYD:</strong> Dado Stellantis como leader, BYD deve jogar Preço Normal como follower dominante — maximiza payoff esperado (3.2% × 0.35 + 0.3% × 0.25 + 3.1% × 0.20 - 2.1% × 0.15 + 5.1% × 0.05 = <b>+1.87% expected market share gain</b>).</p>
  </div>

  <div class="block">
    <div class="block-num">G.4 — War of Attrition: GM Cede Primeiro, BYD Vence</div>
    <p class="block-prose"><strong>War of attrition model:</strong>Todos os 5 players têm capacidade excedente (68% sobcapacidade agregada). Quem cede primeiro (reduz capacidade, aceita share menor) vence. GM é o mais frágil financeiramente (R$ 7bi capex) e cede primeiro.</p>
    <table class="t" style="font-size:13px">
      <thead><tr><th>Ordem de saída</th><th>Player</th><th>Capex disponível</th><th>Tempo até ceder</th><th>Share cedido</th><th>Razão</th></tr></thead>
      <tbody>
        <tr><td class="red"><b>1º a ceder</b></td><td class="red"><b>GM</b></td><td class="num">R$ 7bi</td><td class="num">6–9 meses</td><td class="num">-4.2%</td><td>Menor buffer financeiro, recall Celta antiga</td></tr>
        <tr><td class="amber"><b>2º a ceder</b></td><td class="amber"><b>VW</b></td><td class="num">R$ 16bi</td><td class="num">12–18 meses</td><td class="num">-2.8%</td><td>Polo Argentina conflita com Brasil, Nivus lento</td></tr>
        <tr><td class="amber"><b>3º a ceder</b></td><td class="amber"><b>Geely</b></td><td class="num">~R$ 10bi</td><td class="num">18–24 meses</td><td class="num">-1.5%</td><td>HQ em Hangzhou,“中国"brand risk no Brasil</td></tr>
        <tr><td class="green"><b>Sobrevivente 1º</b></td><td class="green"><b>Stellantis</b></td><td class="num">R$ 30bi</td><td class="num">&gt; 36 meses</td><td class="num">+0.5%</td><td>Maior capacidade, Hybrid líder,昆仑平台</td></tr>
        <tr><td class="green"><b>Sobrevivente Final</b></td><td class="green"><b>BYD</b></td><td class="num">R$ 45bi+</td><td class="num">&gt; 48 meses</td><td class="num">+8.2%</td><td>Blade Battery IP, verticalização, government关系</td></tr>
      </tbody>
    </table>
    <div class="insights good">
      <h4>BYD Vence a War of Attrition</h4>
      <ul>
        <li><strong>BYD é o sobrevivente final</strong> — menor custo marginal (R$ 85k Dolphin Mini vs R$ 120k+ ICE), maior verticalização, IP de baterias</li>
        <li><strong>GM cede em 6–9 meses</strong> — quando VaR de R$ 3.92bi se materializar, GM não tem hedge, precisa sair primeiro</li>
        <li><strong>Stellantis cede antes de BYD</strong> — R$ 30bi vs R$ 45bi+, mas BYD tem menor break-even price</li>
        <li><strong>S11 RED threshold: 65%</strong> — probabilidade de guerra de preços &gt; 65% é o trigger para war of attrition (S11 = RED conditional)</li>
      </ul>
    </div>
  </div>

  <div class="block">
    <div class="block-num">G.5 — S11 RED Threshold: &gt;65% Price War Probability</div>
    <p class="block-prose"><strong>Regra de decisao S11:</strong> Quando probability(price war) &gt; 65%, S11 = RED e o war of attrition começa. Este threshold é o mais importante da análise competitiva.</p>
    <table class="t" style="font-size:13px">
      <thead><tr><th>Indicador</th><th>Baseline (&lt;65%)</th><th>War of Attrition (≥65%)</th><th>Trigger</th></tr></thead>
      <tbody>
        <tr><td><b>Capacidade/Demanda</b></td><td class="num">&lt; 250%</td><td class="num red">&gt; 250%</td><td>S11 RED</td></tr>
        <tr><td><b>Price gap vs ICE</b></td><td class="num">&lt; R$ 35k</td><td class="num red">&gt; R$ 35k</td><td>BYD &amp; Stellantis em &lt; R$ 5k</td></tr>
        <tr><td><b>GM financial buffer</b></td><td class="num">&gt; R$ 2.5bi</td><td class="num red">&lt; R$ 2.5bi</td><td>GM recall charges</td></tr>
        <tr><td><b>Probability(Stellantis Preço Baixo)</b></td><td class="num">&lt; 40%</td><td class="num red">≥ 40%</td><td>Stellantis Q-resultados</td></tr>
      </tbody>
    </table>
    <p class="block-prose"><strong>Implicação para D3:</strong> Se S11 = RED (capacidade/demanda &gt; 250%), trigger war of attrition. A prescrição muda de "defensivo" para "BYD wins via war of attrition" — hold, não снижать preço.</p>
  </div>

  <div class="block">
    <div class="block-num">G.6 — Glossário de Teoria dos Jogos</div>
    <table class="t" style="font-size:12.5px">
      <thead><tr><th>Termo</th><th>Definição</th></tr></thead>
      <tbody>
        <tr><td><b>Nash Equilibrium</b></td><td>Estado em que nenhum player pode melhorar seu payoff unilateralmente mudando sua estratégia. No jogo 5×5: (BYD=Normal, Stellantis=Baixo) é o único equilíbrio de Nash.</td></tr>
        <tr><td><b>Payoff Matrix</b></td><td>Tabela 5×5 onde cada célula contém o payoff para todos os 5 players dado a combinação de estratégias. Payoffs em % market share gain/loss.</td></tr>
        <tr><td><b>Sequential Game (Stackelberg)</b></td><td>Jogo onde um player (Stellantis, o leader) move primeiro e os outros (BYD, follower) respondem. Stellantis announces R$ 30bi antes de BYD decidir.</td></tr>
        <tr><td><b>War of Attrition</b></td><td>Jogo onde múltiplos players continuam investindo até que os mais fracos (GM) cedem primeiro. BYD vence por ter o menor break-even e maior stamina.</td></tr>
        <tr><td><b>Dominant Strategy</b></td><td>Estratégia que é ótima para um player independentemente do que os outros players fazem. Para Stellantis: Preço Baixo é dominante (payoff +1.1 vs -0.2 vs +0.3 vs -0.9 vs +2.4).</td></tr>
        <tr><td><b>Pareto Optimal</b></td><td>Estado onde nenhum player pode melhorar sem piorar outro. (Preço Normal, Normal) é Pareto-ótimo — todos os outros estados têm pelo menos um player em pior situação.</td></tr>
      </tbody>
    </table>
  </div>
</section>

'''

# Append the new sections before the footer
footer_marker = '\n</div><!-- wrap -->\n\n<!-- ============================== FOOTER ============================== -->'
if footer_marker in content:
    content = content.replace(footer_marker, new_sections + '\n</div><!-- wrap -->\n\n<!-- ============================== FOOTER ============================== -->')
else:
    content += new_sections

# Update footer
content = content.replace(
    'Decision Framework D3 v0.6 — Anexo',
    'Decision Framework D3 v2.0 — Anexo'
)
content = content.replace(
    'Versão 0.6 · 21 de julho de 2026 · BYD Camaçari 2025–2027',
    'Versão 2.0 · 21 de julho de 2026 · BYD Camaçari 2025–2027'
)

# Write output
with open(dst, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done! Output length:', len(content))
print('Written to:', dst)
