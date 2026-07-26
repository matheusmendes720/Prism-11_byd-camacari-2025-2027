// Generate 2 figures for D3-RECALIBRATION-S1-S2-REAL.md
// Fig 1: lítio price history (10y, 2015-2025)
// Fig 2: VaR supply stress-conditional (3 crisis vs 5 normal)

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
          else reject(new Error(`bad response: ${body.slice(0, 200)}`));
        } catch (e) {
          reject(new Error(`parse error: ${e.message}; body=${body.slice(0, 200)}`));
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
        reject(new Error(`status ${res.statusCode}`));
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
  // === Fig 1: Lítio price history (line) ===
  const litioHistory = [
    { date: '2015-01', price: 6000 }, { date: '2015-04', price: 6500 },
    { date: '2015-07', price: 6500 }, { date: '2015-10', price: 6500 },
    { date: '2016-01', price: 8500 }, { date: '2016-04', price: 12500 },
    { date: '2016-07', price: 14500 }, { date: '2016-10', price: 14000 },
    { date: '2017-01', price: 16000 }, { date: '2017-04', price: 17500 },
    { date: '2017-07', price: 17500 }, { date: '2017-10', price: 18500 },
    { date: '2018-01', price: 17000 }, { date: '2018-04', price: 16500 },
    { date: '2018-07', price: 16500 }, { date: '2018-10', price: 15500 },
    { date: '2019-01', price: 12000 }, { date: '2019-04', price: 11500 },
    { date: '2019-07', price: 11000 }, { date: '2019-10', price: 10500 },
    { date: '2020-01', price: 8000 }, { date: '2020-04', price: 7000 },
    { date: '2020-07', price: 6500 }, { date: '2020-10', price: 7000 },
    { date: '2021-01', price: 10000 }, { date: '2021-04', price: 12500 },
    { date: '2021-07', price: 13000 }, { date: '2021-10', price: 22000 },
    { date: '2022-01', price: 35000 }, { date: '2022-04', price: 50000 },
    { date: '2022-07', price: 70000 }, { date: '2022-10', price: 80000 },
    { date: '2023-01', price: 60000 }, { date: '2023-04', price: 40000 },
    { date: '2023-07', price: 35000 }, { date: '2023-10', price: 20000 },
    { date: '2024-01', price: 14000 }, { date: '2024-04', price: 12000 },
    { date: '2024-07', price: 11500 }, { date: '2024-10', price: 11000 },
    { date: '2025-01', price: 11000 }, { date: '2025-04', price: 10000 },
    { date: '2025-07', price: 10000 },
  ];

  const fig1Data = litioHistory.map(d => ({ date: d.date, value: d.price }));
  const fig1Payload = {
    type: 'line',
    data: fig1Data,
    title: 'Lítio Carbonate Price 2015-2025 (US$/t, China spot)',
    axisXTitle: 'Date',
    axisYTitle: 'Price (US$/t)',
    width: 1100,
    height: 500,
    theme: 'dark',
  };
  console.log('[Fig 1] requesting lítio price line...');
  const fig1Url = await postAntV(fig1Payload);
  await downloadPng(fig1Url, path.join(__dirname, 'figures', 'fig-d3-s1s2-real-1-lithium-history.png'));
  console.log('[Fig 1] done: fig-d3-s1s2-real-1-lithium-history.png');

  // === Fig 2: VaR supply stress-conditional (column grouped) ===
  // 4 regimes (calm/normal/stress/crisis) × 2 series (real vs synthetic)
  const regimes = ['Calm\n(mag<5%)', 'Normal\n(5-15%)', 'Stress\n(15-25%)', 'Crisis\n(>=25%)'];
  const realData = [0, 680, 1512, 2142];       // R$ M, from JSON
  const synthData = [0, 378, 1607, 2268];      // R$ M, from synthetic doc

  // Build grouped data for column chart
  const fig2Data = [];
  regimes.forEach((r, i) => {
    fig2Data.push({ regime: r, series: 'Real (lítio público)', value: realData[i] });
    fig2Data.push({ regime: r, series: 'Sintético (calibrado)', value: synthData[i] });
  });

  const fig2Payload = {
    type: 'column',
    data: fig2Data,
    title: 'VaR Supply 6m por Regime (R$ M) — Real vs Sintético',
    axisXTitle: 'Regime',
    axisYTitle: 'VaR 6m (R$ M)',
    group: true,
    stack: false,
    width: 1100,
    height: 500,
    theme: 'dark',
  };
  console.log('[Fig 2] requesting VaR stress-conditional column...');
  const fig2Url = await postAntV(fig2Payload);
  await downloadPng(fig2Url, path.join(__dirname, 'figures', 'fig-d3-s1s2-real-2-stress-conditional.png'));
  console.log('[Fig 2] done: fig-d3-s1s2-real-2-stress-conditional.png');

  console.log('\n=== Both figures generated ===');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
