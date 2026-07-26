#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# D3-ANNEX.html v2.0 Generator
# Builds complete v2.0 from scratch: original v0.6 content + new sections + version changes
# This avoids needing to read from a corrupted file

dst = 'C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/D3-ANNEX.html'

def w(f, s):
    f.write(s)

with open(dst, 'w', encoding='utf-8') as f:
    # ===== HEAD =====
    w(f, '''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>D3-ANNEX.html v2.0 — Anexo Técnico · Framework de Decisão Prescritiva BYD Camaçari 2025–2027</title>
  <meta name="description" content="Anexo técnico do D3 v2.0: taxonomia completa das 11 dimensões, matriz de interdependência, árvore de decisão consolidada, glossário, fontes OSINT, contrato de output dos agents, teoria dos jogos, sensibilidade multivariada e backtesting." />
  <style>
    :root{--bg:#0e1014;--bg-card:#161a21;--bg-deep:#080a0e;--ink:#e6e8ec;--ink-2:#b0b6c2;--ink-3:#7a818f;--ink-4:#4a4f5a;--line:#262b35;--line-2:#34394a;--primary:#6b95f0;--primary-2:#8eb1ff;--accent:#e0a45e;--good:#4ade80;--warn:#ff9f43;--bad:#ff6b63;--info:#6b95f0;--serif:'Inter Tight','Inter',system-ui,sans-serif;--sans:'Inter',system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,monospace}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased}::selection{background:rgba(107,149,240,.32);color:#f1efe7}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--line-2);border-radius:5px}::-webkit-scrollbar-thumb:hover{background:var(--ink-4)}.cover{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:64px 80px 48px;background:linear-gradient(180deg,#07090d 0%,#0e1014 100%);color:#f1efe7;position:relative;overflow:hidden;border-bottom:1px solid var(--line)}.cover::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:64px 64px;pointer-events:none}.cover-inner{position:relative;z-index:2}.cover-tag{font-family:var(--mono);font-size:12px;letter-spacing:.18em;color:#b8b3a3;text-transform:uppercase;margin-bottom:32px}.cover-title{font-family:var(--serif);font-weight:800;font-size:clamp(42px,6vw,80px);line-height:.96;letter-spacing:-.02em;margin:0 0 24px;color:#f1efe7}.cover-title em{font-style:normal;color:#e0a45e}.cover-sub{font-size:18px;line-height:1.5;max-width:720px;color:#c8c4b6;font-weight:400}.cover-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;border-top:1px solid rgba(255,255,255,.12);padding-top:28px}.cover-meta-item{padding-right:28px}.cover-meta-item+.cover-meta-item{border-left:1px solid rgba(255,255,255,.08);padding-left:28px}.cover-meta-label{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:#8c8773}.cover-meta-value{font-family:var(--serif);font-weight:700;font-size:28px;color:#f1efe7;margin-top:8px}.cover-meta-note{font-size:12px;color:#8c8773;margin-top:4px}.cover-foot{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:end;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6e6a5a;border-top:1px solid rgba(255,255,255,.08);padding-top:20px}.wrap{max-width:1180px;margin:0 auto;padding:0 56px}.toc{padding:72px 0 56px;border-bottom:1px solid var(--line)}.toc-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);margin-bottom:16px}.toc-title{font-family:var(--serif);font-weight:800;font-size:38px;letter-spacing:-.02em;margin:0 0 28px}.toc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 56px}.toc-item{display:flex;gap:20px;padding:14px 0;border-top:1px solid var(--line);align-items:baseline}.toc-num{font-family:var(--mono);font-size:12px;color:var(--ink-3);min-width:36px}.toc-link{flex:1;text-decoration:none;color:var(--ink);font-weight:500;font-size:15px}.toc-link:hover{color:var(--primary-2)}.toc-link small{display:block;font-weight:400;font-size:12.5px;color:var(--ink-3);margin-top:2px}.section{padding:80px 0 56px;border-top:1px solid var(--line)}.section:first-of-type{border-top:none}.sec-head{margin-bottom:48px}.sec-num{font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:var(--ink-3);text-transform:uppercase}.sec-title{font-family:var(--serif);font-weight:800;font-size:42px;line-height:1.05;letter-spacing:-.02em;margin:10px 0 14px}.sec-lede{font-size:17px;line-height:1.55;color:var(--ink-2);max-width:760px}.block{margin:48px 0}.block+.block{border-top:1px dashed var(--line-2);padding-top:48px}.block-num{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--ink-3);text-transform:uppercase;margin-bottom:6px}.block-title{font-family:var(--serif);font-weight:700;font-size:24px;line-height:1.2;letter-spacing:-.01em;margin:0 0 16px}.block-prose{max-width:780px}.block-prose p{margin:0 0 14px}.block-prose strong{color:var(--ink)}.block-prose code{font-family:var(--mono);font-size:12.5px;background:rgba(107,149,240,.14);padding:1px 6px;border-radius:3px;color:#9bbcff}table.t{width:100%;max-width:100%;border-collapse:collapse;margin:16px 0;font-size:13.5px}table.t th,table.t td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line)}table.t th{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:500}table.t td.num{font-family:var(--mono);font-variant-numeric:tabular-nums}table.t tr.total td{font-weight:700;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}table.t td.green{color:var(--good)}table.t td.amber{color:var(--warn)}table.t td.red{color:var(--bad)}table.t td.center{text-align:center}table.t td b{color:var(--ink)}.insights{background:var(--bg-card);border:1px solid var(--line);border-left:3px solid var(--primary);border-radius:4px;padding:16px 20px;margin:16px 0;max-width:820px}.insights h4{margin:0 0 7px;font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--primary)}.insights ul{margin:0;padding-left:16px}.insights li{margin-bottom:3px;font-size:13.5px;color:var(--ink-2)}.warn{border-left-color:var(--warn)}.warn h4{color:var(--warn)}.good{border-left-color:var(--good)}.good h4{color:var(--good)}.status-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase}.status-green{background:rgba(74,222,128,.15);color:#4ade80;border:1px solid rgba(74,222,128,.4)}.status-amber{background:rgba(255,159,67,.15);color:#ff9f43;border:1px solid rgba(255,159,67,.4)}.status-red{background:rgba(255,107,99,.15);color:#ff6b63;border:1px solid rgba(255,107,99,.4)}.footer{padding:28px 0;border-top:1px solid var(--line);font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);display:flex;justify-content:space-between}@media(max-width:900px){.wrap{padding:0 24px}.cover{padding:40px 24px}.cover-meta{grid-template-columns:1fr 1fr;gap:14px}.cover-meta-item+.cover-meta-item{border-left:none;padding-left:0}.sec-title{font-size:32px}.toc-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
''')

    # ===== COVER =====
    w(f, '''<!-- ============================== COVER ============================== -->
<section class="cover">
  <div class="cover-inner">
    <div class="cover-tag">D3-ANNEX.html v2.0 · Anexo Técnico · 21 de julho de 2026 · Atualização 08:16 BRT</div>
    <h1 class="cover-title">Anexo Técnico<br/><em>Do Framework</em><br/>D3 v2.0</h1>
    <p class="cover-sub">Anexo completo do D3-MAIN.html v2.0. Contém: taxonomia das 11 dimensões, matriz de interdependência, árvore de decisão consolidada, glossário de termos técnicos, fontes OSINT, contrato de output dos agents, teoria dos jogos (Anexo G), sensibilidade multivariada (Anexo H) e backtesting (Anexo I).</p>
    <div class="cover-meta">
      <div class="cover-meta-item">
        <div class="cover-meta-label">Dimensões</div>
        <div class="cover-meta-value">11</div>
        <div class="cover-meta-note">S1 a S11, taxonomia completa</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Acoplamentos</div>
        <div class="cover-meta-value">8</div>
        <div class="cover-meta-note">Matriz S×S completa</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Anexos</div>
        <div class="cover-meta-value">9</div>
        <div class="cover-meta-note">A a I: taxonomia+matriz+árvore+glossário+fontes+output+G+J+H</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Jogos Teoria</div>
        <div class="cover-meta-value">G</div>
        <div class="cover-meta-note">Nash, war of attrition, S11 RED &gt;65%</div>
      </div>
    </div>
  </div>
  <div class="cover-foot">
    <span>BYD Camaçari · 2025–2027</span>
    <span>Decision Framework D3 v2.0 — Anexo</span>
  </div>
</section>

<div class="wrap">

<!-- ============================== TOC ============================== -->
<section class="toc">
  <div class="toc-eyebrow">Sumário — Anexos</div>
  <h2 class="toc-title">Conteúdo do Anexo</h2>
  <div class="toc-grid">
    <a class="toc-item" href="#annex-a"><span class="toc-num">A</span><span class="toc-link">Taxonomia Completa das 11 Dimensões<small>S1 a S11: nome, tipo, inputs, pesos, thresholds, status, acoplamentos</small></span></a>
    <a class="toc-item" href="#annex-b"><span class="toc-num">B</span><span class="toc-link">Matriz de Interdependência<small>Tabela S×S com os 8 acoplamentos quantitativos do D3 v2.0</small></span></a>
    <a class="toc-item" href="#annex-c"><span class="toc-num">C</span><span class="toc-link">Árvore de Decisão Consolidada<small>Todos os paths Continuar/Mitigar/Abortar com 11 dimensões</small></span></a>
    <a class="toc-item" href="#annex-d"><span class="toc-num">D</span><span class="toc-link">Glossário de Termos Técnicos<small>ViE, SKD, CKD, VaR, NPV, IPI, BNDES, Camex, game theory, etc.</small></span></a>
    <a class="toc-item" href="#annex-e"><span class="toc-num">E</span><span class="toc-link">Fontes e Data de Coleta OSINT<small>Tabela com fonte, URL/data, data de coleta, confiabilidade</small></span></a>
    <a class="toc-item" href="#annex-f"><span class="toc-num">F</span><span class="toc-link">Contrato de Output dos Agents<small>Formato e estrutura dos documentos D3 — naming, versionamento, tags</small></span></a>
    <a class="toc-item" href="#annex-g"><span class="toc-num">G</span><span class="toc-link">Teoria dos Jogos — Nash Equilibrium<small>Matriz 5×5, war of attrition, S11 RED threshold &gt;65%</small></span></a>
    <a class="toc-item" href="#annex-h"><span class="toc-num">H</span><span class="toc-link">Sensibilidade Multivariada<small>Cholesky decomposition, tornado chart, VaR 95% = R$ 8.21bi, Monte Carlo 10k</small></span></a>
    <a class="toc-item" href="#annex-i"><span class="toc-num">I</span><span class="toc-link">Backtesting Metodologia<small>Tracking error, accuracy metrics, C1 validation, v0.6 accuracy ~50%</small></span></a>
  </div>
</section>
''')

    # ANNEX A - Taxonomy
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_a.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_b.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_c.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_d.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_e.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_f.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_g.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_h.txt','r',encoding='utf-8').read())
    w(f, open('C:/Users/mathe/code_space/orchestration/value-factory/byd-camacari-2025-2027/reports/decision-framework/annex_i.txt','r',encoding='utf-8').read())

    # Footer
    w(f, '''
</div><!-- wrap -->

<!-- ============================== FOOTER ============================== -->
<div class="wrap">
  <div class="footer">
    <span>Decision Framework D3 v2.0 — Anexo</span>
    <span>Versão 2.0 · 21 de julho de 2026 · BYD Camaçari 2025–2027</span>
  </div>
</div>

</body>
</html>
''')

print("Done!")
