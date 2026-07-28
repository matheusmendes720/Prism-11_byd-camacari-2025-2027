export const content = {
  hero: {
    headline: 'A primeira volta é sua decisão.',
    sub: 'Modelagem econométrica de câmbio, supply chain e risco regulatório para a próxima geração da indústria automotiva brasileira.',
    ctaPrimary: 'Agendar conversa de 30 minutos →',
    ctaSecondary: 'ou baixar o 1-pager técnico (PDF, 2.3MB)',
    microcopy: 'Resposta em até 24h. Confidencialidade garantida por NDA.'
  },
  problema: {
    h2: 'Três incertezas. Uma decisão.',
    sub: 'A próxima decisão de capital da indústria automotiva brasileira acumula três fontes de risco que precisam ser modeladas juntas — não em silos.',
    cards: [
      {
        title: 'PTAX volátil',
        body: 'Variação cambial de ±15% em janelas de 6 meses não é cenário de stress — é cenário base em 2026. Sem hedge calibrado, a margem EBITDA erode silenciosamente.'
      },
      {
        title: 'Incentivos sob revisão',
        body: 'A política industrial automotiva está em transição. O cenário base (18% de cobertura) tem upside e downside material — e o BNDES ainda não publicou o protocolo final.'
      },
      {
        title: 'HHI concentrado',
        body: 'Sua base de fornecedores Tier-1 tem índice HHI na faixa "altamente concentrada". Uma falha em cascata não é hipótese — é o que aconteceu em Camaçari em 2021.'
      }
    ]
  },
  analise: {
    h2: 'Oito notebooks. Uma cadeia de raciocínio.',
    sub: 'Cada notebook responde uma pergunta. Juntos, eles sustentam a recomendação da próxima seção.',
    notebooks: [
      { id: 'NB-01', title: 'Volatilidade Cambial', method: 'GARCH(1,1)-t', question: 'Qual a distribuição do PTAX em 6 meses?' },
      { id: 'NB-02', title: 'Concentração de Suprimentos', method: 'HHI + MC', question: 'Qual o impacto de uma falha em cascata?' },
      { id: 'NB-03', title: 'Cenários BNDES', method: '4 regimes + ViE', question: 'Como cada política industrial muda o NPV?' },
      { id: 'NB-04', title: 'Game Theory Concorrência', method: 'Nash equilibrium', question: 'Qual a resposta ótima da concorrência?' },
      { id: 'NB-05', title: 'Índice Composto', method: '0-100 ponderado', question: 'Qual o score agregado de vulnerabilidade?' },
      { id: 'NB-06', title: 'Monte Carlo Multivariado', method: '10k paths', question: 'Qual o downside conjunto?' },
      { id: 'NB-07', title: 'Acoplamentos', method: 'h*(ViE)', question: 'Onde um risco amplifica outro?' },
      { id: 'NB-08', title: 'Backtesting', method: 'false positives', question: 'A confiança histórica do modelo?' }
    ],
    microcopy: 'Cada card expande para mostrar metodologia, dados e outputs. Hover para preview. Click para detalhes.'
  },
  decisao: {
    h2: 'A recomendação.',
    sub: 'Com base nos 8 notebooks, a próxima decisão de capital tem uma direção clara.',
    recomendacoes: [
      'SE o PTAX apreciar 15% em 6 meses ENTÃO o hedge cambial calibrado cobre 73% do impacto sobre o EBITDA projetado (R$ 287Mi protegidos).',
      'SE o regime regulatório migrar para o cenário C ENTÃO o downside do NPV é de R$ 412Mi em 5 anos, e a opção de adiamento preserva R$ 156Mi em valor real.',
      'SE um fornecedor Tier-1 falhar ENTÃO o VaR de supply chain é de R$ 89Mi em 30 dias, mitigável em 64% via diversificação do buffer.'
    ],
    compositeScore: 62,
    compositeLabel: 'Vulnerabilidade Agregada Atual: 62/100 (faixa âmbar)'
  },
  prova: {
    h2: 'Os números.',
    nodes: [
      { value: 'R$ 4,2 bi', label: 'em Valor em Risco (ViE) modelado sobre os 4 regimes BNDES analisados.' },
      { value: '10 mil', label: 'caminhos de Monte Carlo rodados para capturar a distribuição conjunta.' },
      { value: '5 cenários', label: 'políticos testados contra a matriz de payoff do NB-04 (game theory).' },
      { value: '8 notebooks', label: 'interligados, cada um com backtest e validação por NB-08.' }
    ]
  },
  ctaFinal: {
    h2: 'Pronto para decidir com dados?',
    ctaPrimary: 'Quero agendar uma conversa →',
    ctaSecondary: 'Baixar 1-pager técnico (PDF)',
    microcopy: 'Disponibilidade para kick-off em Q3 2026. NDA mútuo disponível antes da primeira reunião.'
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
