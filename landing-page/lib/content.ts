// All copy strings for the landing page
// No arrow characters, no em-dashes in visible copy

export const content = {
  hero: {
    eyebrow: 'Energy Flow Analytics',
    headline: 'A primeira volta é sua decisão.',
    sub: 'Modelagem econométrica de câmbio, supply chain e risco regulatório para a próxima geração da indústria automotiva brasileira.',
    ctaPrimary: 'Agendar conversa de 30 minutos',
    ctaSecondary: 'Baixar o 1-pager técnico (PDF, 2.3MB)',
    microcopy: 'Resposta em até 24h. Confidencialidade garantida por NDA.'
  },
  problema: {
    eyebrow: '01 / Problema',
    h2: 'Três incertezas. Uma decisão.',
    sub: 'A próxima decisão de capital da indústria automotiva brasileira acumula três fontes de risco que precisam ser modeladas juntas.',
    cards: [
      {
        title: 'PTAX volátil',
        body: 'Variação cambial de 15% em janelas de 6 meses não é cenário de stress. É cenário base em 2026. Sem hedge calibrado, a margem EBITDA erode silenciosamente.'
      },
      {
        title: 'Incentivos sob revisão',
        body: 'A política industrial automotiva está em transição. O cenário base tem upside e downside material. O BNDES ainda não publicou o protocolo final.'
      },
      {
        title: 'HHI concentrado',
        body: 'Sua base de fornecedores Tier-1 tem índice na faixa altamente concentrada. Uma falha em cascata não é hipótese. É o que aconteceu em Camaçari em 2021.'
      }
    ]
  },
  analise: {
    eyebrow: '02 / Análise',
    h2: 'Oito notebooks. Uma cadeia de raciocínio.',
    sub: 'Cada notebook responde uma pergunta. Juntos, eles sustentam a recomendação.',
    notebooks: [
      { id: 'NB-01', title: 'Volatilidade Cambial', method: 'GARCH(1,1)-t', question: 'Qual a distribuição do PTAX em 6 meses?' },
      { id: 'NB-02', title: 'Concentração de Suprimentos', method: 'HHI + MC', question: 'Qual o impacto de uma falha em cascata?' },
      { id: 'NB-03', title: 'Cenários BNDES', method: '4 regimes + ViE', question: 'Como cada política muda o NPV?' },
      { id: 'NB-04', title: 'Game Theory Concorrência', method: 'Nash equilibrium', question: 'Qual a resposta ótima da concorrência?' },
      { id: 'NB-05', title: 'Índice Composto', method: '0-100 ponderado', question: 'Qual o score agregado de vulnerabilidade?' },
      { id: 'NB-06', title: 'Monte Carlo Multivariado', method: '10k paths', question: 'Qual o downside conjunto?' },
      { id: 'NB-07', title: 'Acoplamentos', method: 'h*(ViE)', question: 'Onde um risco amplifica outro?' },
      { id: 'NB-08', title: 'Backtesting', method: 'false positives', question: 'A confiança histórica do modelo?' }
    ],
    microcopy: 'Cada card expande para mostrar metodologia, dados e outputs.'
  },
  decisao: {
    eyebrow: '03 / Decisão',
    h2: 'A recomendação.',
    sub: 'Com base nos 8 notebooks, a próxima decisão de capital tem uma direção clara.',
    recomendacoes: [
      'SE o PTAX apreciar 15% em 6 meses ENTÃO o hedge calibra 73% do impacto sobre o EBITDA projetado, R$ 287Mi protegidos.',
      'SE o regime regulatório migrar para o cenário C ENTÃO o downside do NPV é R$ 412Mi em 5 anos, e a opção de adiamento preserva R$ 156Mi.',
      'SE um fornecedor Tier-1 falhar ENTÃO o VaR de supply chain é R$ 89Mi em 30 dias, mitigável em 64% via diversificação do buffer.'
    ],
    compositeScore: 71.8,
    compositeLabel: 'Vulnerabilidade Agregada: 71.8/100 (modo tensão)'
  },
  prova: {
    eyebrow: '04 / Prova',
    h2: 'Os números.',
    nodes: [
      { value: 'R$ 8.21 bi', label: 'em Valor em Risco (VaR 95%) modelado sobre os 4 regimes BNDES.' },
      { value: '10 mil', label: 'caminhos de Monte Carlo para capturar a distribuição conjunta.' },
      { value: '5 cenários', label: 'políticos testados contra a matriz de payoff do NB-04.' },
      { value: '8 notebooks', label: 'interligados, cada um com backtest e validação.' }
    ]
  },
  ctaFinal: {
    eyebrow: '05 / Contato',
    h2: 'Pronto para decidir com dados?',
    ctaPrimary: 'Quero agendar uma conversa',
    ctaSecondary: 'Baixar 1-pager técnico (PDF)',
    microcopy: 'Disponibilidade para kick-off em Q3 2026. NDA mútuo disponível.'
  },
  footer: {
    name: 'Matheus Mendes',
    role: 'Econometrista & Data Scientist',
    location: 'Salvador, BA — Brasil',
    email: 'contato@energyflow.lab',
    github: 'github.com/matheusmendes/byd-analytics',
    legal: '© 2026 Energy Flow Analytics. Análise independente, sem afiliação à BYD Brasil.'
  }
} as const;

export type Content = typeof content;
