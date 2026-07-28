export const glossary = {
  PTAX: 'Taxa de câmbio oficial usada em contratos comerciais no Brasil',
  HHI: 'Herfindahl-Hirschman Index — mede concentração de fornecedores',
  'GARCH(1,1)-t': 'Modelo estatístico que captura volatilidade cambial com caudas pesadas',
  ViE: 'Valor em Risco Esperado — perda esperada dado um cenário adverso',
  NPV: 'Net Present Value — valor presente líquido do investimento',
  'Monte Carlo': 'Simulação com milhares de cenários aleatórios para estimar distribuições',
  Backtesting: 'Validar o modelo em dados passados antes de usar no presente',
  BNDES: 'Banco Nacional de Desenvolvimento Econômico e Social',
  EBITDA: 'Earnings Before Interest, Taxes, Depreciation, Amortization',
  VaR: 'Value at Risk — perda máxima esperada em uma janela de tempo'
} as const;

export type GlossaryTerm = keyof typeof glossary;

export function getDefinition(term: string): string {
  return glossary[term as GlossaryTerm] ?? '';
}
