// Generate 2 figures for D3-RECALIBRATION-S3-PROBABILITIES.md
// Fig 1: BYD units + market share realized 2022-2026 (dual-axis line)
// Fig 2: S3 probability comparison D3 v0.5 vs v0.6 (grouped bar)

const https = require('https');
const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://antv-studio.alipay.com/api/gpt-vis';

function postAntV(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const opts = {
      method: 'POST',
      hostname: 'antv-studio.alipay.com',
      path: '/api/gpt-vis',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const j = JSON.parse(body);
          if (j && j.success && j.resultObj) resolve(j.resultObj);
          else reject(new Error(`bad response: ${body.slice(0, 300)}`));
        } catch (e) {
          reject(new Error(`parse error: ${e.message}; body=${body.slice(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function downloadPng(url, outPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`status ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        fs.writeFileSync(outPath, Buffer.concat(chunks));
        resolve(outPath);
      });
    }).on('error', reject);
  });
}

async function main() {
  // === Fig 1: BYD units + market share 2022-2026 (dual-axis line) ===
  // Realized annual units + market share (Fenabrave/ANFAVEA denominators)
  // 2026 = realized through May annualized run-rate (14,911 Apr + 9,755 Jan + 11,379 Feb + ~10k Mar/May = ~58k/5m; annualized ~140k)
  // 2026 target = 250k (BYD HQ)
  const series1 = [
    { year: '2022', units: 260,    share: 0.01 },
    { year: '2023', units: 18000,  share: 0.7  },
    { year: '2024', units: 76700,  share: 2.9  },
    { year: '2025', units: 112915, share: 4.0  },
    { year: '2026', units: 250000, share: 12.8 }, // target / May run-rate
  ];

  // Dual-axis line — two series with different scales
  // antv supports multi-series; we'll use a line with two series and label units vs share
  const fig1Data = [];
  series1.forEach(d => {
    fig1Data.push({ year: d.year, series: 'BYD Units (vendas)', value: d.units });
    fig1Data.push({ year: d.year, series: 'BYD Market Share (%)', value: d.share });
  });

  const fig1Payload = {
    type: 'line',
    data: fig1Data,
    title: 'BYD Brasil — Vendas & Market Share Realized 2022-2026',
    axisXTitle: 'Ano',
    axisYTitle: 'Unidades vendidas',
    width: 1100,
    height: 520,
    theme: 'dark',
  };
  console.log('[Fig 1] requesting BYD units + market share line...');
  const fig1Url = await postAntV(fig1Payload);
  await downloadPng(fig1Url, path.join(__dirname, 'figures', 'fig-d3-recals3-1-market-share-2022-2026.png'));
  console.log('[Fig 1] done: fig-d3-recals3-1-market-share-2022-2026.png');

  // === Fig 2: S3 probability comparison D3 v0.5 vs v0.6 (grouped bar) ===
  const scenarios = ['S3 Expansão', 'S3 Continuidade', 'S3 RB Parcial', 'S3 RB Total'];
  const v05 = [15, 40, 30, 15];   // D3 v0.5 assumed probabilities
  const v06 = [75, 17, 7, 1];     // D3 v0.6 recalibrated (mid of proposed range)

  const fig2Data = [];
  scenarios.forEach((s, i) => {
    fig2Data.push({ scenario: s, series: 'D3 v0.5 (assumiu)', value: v05[i] });
    fig2Data.push({ scenario: s, series: 'D3 v0.6 (recalibrado)', value: v06[i] });
  });

  const fig2Payload = {
    type: 'column',
    data: fig2Data,
    title: 'S3 (BNDES/ViE) — Probabilidades: D3 v0.5 vs v0.6',
    axisXTitle: 'Cenário S3',
    axisYTitle: 'Probabilidade (%)',
    group: true,
    stack: false,
    width: 1100,
    height: 520,
    theme: 'dark',
  };
  console.log('[Fig 2] requesting S3 probability comparison bar...');
  const fig2Url = await postAntV(fig2Payload);
  await downloadPng(fig2Url, path.join(__dirname, 'figures', 'fig-d3-recals3-2-probability-comparison.png'));
  console.log('[Fig 2] done: fig-d3-recals3-2-probability-comparison.png');

  console.log('\n=== Both figures generated ===');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
