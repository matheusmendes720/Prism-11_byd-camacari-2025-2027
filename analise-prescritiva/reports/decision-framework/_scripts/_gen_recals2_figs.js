// Generate 2 figures for D3-RECALIBRATION-S2-LITHIUM-2026.md
// Fig 1: lítio trajectory 2022-2026 with 2026 forecast (line, dark theme)
// Fig 2: VaR supply v0.5 vs v0.6 by regime (column grouped, dark theme)

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
          else reject(new Error('bad response: ' + body.slice(0, 200)));
        } catch (e) {
          reject(new Error('parse error: ' + e.message + '; body=' + body.slice(0, 200)));
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
        reject(new Error('status ' + res.statusCode));
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
  // === Fig 1: Lítio 2022-2026 trajectory + forecast ===
  // Q1-2022 to Q4-2026 (20 quarters), with 2026-Q3/Q4 as forecast
  const litioData = [
    { quarter: 'Q1-22', price: 35000 },
    { quarter: 'Q2-22', price: 50000 },
    { quarter: 'Q3-22', price: 70000 },
    { quarter: 'Q4-22', price: 80000 },  // peak
    { quarter: 'Q1-23', price: 60000 },
    { quarter: 'Q2-23', price: 40000 },
    { quarter: 'Q3-23', price: 35000 },
    { quarter: 'Q4-23', price: 20000 },
    { quarter: 'Q1-24', price: 14000 },
    { quarter: 'Q2-24', price: 12000 },
    { quarter: 'Q3-24', price: 11500 },
    { quarter: 'Q4-24', price: 11000 },
    { quarter: 'Q1-25', price: 11000 },
    { quarter: 'Q2-25', price: 10000 },
    { quarter: 'Q3-25', price: 9000 },   // trough
    { quarter: 'Q4-25', price: 13000 },
    { quarter: 'Q1-26', price: 20000 },  // rebound
    { quarter: 'Q2-26', price: 21400 },
    { quarter: 'Q3-26', price: 22000 },  // forecast
    { quarter: 'Q4-26', price: 22000 },  // forecast
  ];

  const fig1Payload = {
    type: 'line',
    data: litioData,
    title: 'Lítio Carbonate 2022-2026 + Forecast (US$/t, China spot, quarterly)',
    axisXTitle: 'Quarter',
    axisYTitle: 'Price (US$/t)',
    width: 1200,
    height: 540,
    theme: 'dark',
  };
  console.log('[Fig 1] requesting lítio trajectory line...');
  const fig1Url = await postAntV(fig1Payload);
  await downloadPng(fig1Url, path.join(__dirname, 'figures', 'fig-d3-recals2-1-lithium-2026-trajectory.png'));
  console.log('[Fig 1] done');

  // === Fig 2: VaR supply v0.5 vs v0.6 by regime (column grouped) ===
  // 4 regimes × 2 series
  const regimes = ['Calm\n(mag<5%)', 'Normal\n(5-15%)', 'Stress\n(15-25%)', 'Crisis\n(>=25%)'];
  // v0.5 = real lítio 2015-2025 (from D3-RECALIBRATION-S1-S2-REAL.md)
  const v05Data = [0, 680, 1512, 2268];           // R$ M
  // v0.6 = with lítio 2026 rebound (this recalibration)
  // Calm: still small premium (baseline shift from $10k → $20k)
  // Normal: average of GREEN 0.5bi + AMBER 2.0bi / 2 ≈ 1.25bi
  // Stress: GREEN 0.5bi + AMBER 2.0bi + RED 3.5bi / 3 ≈ 2.0bi
  // Crisis: weighted avg of 4 crises (2.268 + 2.268 + 1.890 + 3.780) / 4 = 2.55bi
  const v06Data = [500, 1250, 2000, 2550];        // R$ M

  const fig2Data = [];
  regimes.forEach((r, i) => {
    fig2Data.push({ regime: r, series: 'v0.5 (lítio 2015-25)', value: v05Data[i] });
    fig2Data.push({ regime: r, series: 'v0.6 (lítio 2026 rebound)', value: v06Data[i] });
  });

  const fig2Payload = {
    type: 'column',
    data: fig2Data,
    title: 'VaR Supply 6m por Regime (R$ M) — v0.5 vs v0.6',
    axisXTitle: 'Regime',
    axisYTitle: 'VaR 6m (R$ M)',
    group: true,
    stack: false,
    width: 1200,
    height: 540,
    theme: 'dark',
  };
  console.log('[Fig 2] requesting VaR comparison column...');
  const fig2Url = await postAntV(fig2Payload);
  await downloadPng(fig2Url, path.join(__dirname, 'figures', 'fig-d3-recals2-2-var-supply-comparison.png'));
  console.log('[Fig 2] done');

  console.log('\n=== Both figures generated ===');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
