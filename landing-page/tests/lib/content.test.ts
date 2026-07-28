import { describe, it, expect } from 'vitest';
import { content } from '@/lib/content';

describe('content', () => {
  it('exports hero.headline', () => {
    expect(content.hero.headline).toBe('A primeira volta é sua decisão.');
  });

  it('exports hero.ctaPrimary', () => {
    expect(content.hero.ctaPrimary).toContain('Agendar');
  });

  it('exports problema.cards as array of 3', () => {
    expect(content.problema.cards).toHaveLength(3);
    expect(content.problema.cards[0].title).toBe('PTAX volátil');
  });

  it('exports analise.notebooks as array of 8', () => {
    expect(content.analise.notebooks).toHaveLength(8);
    expect(content.analise.notebooks[0].id).toBe('NB-01');
  });

  it('exports decisao.recomendacoes as array of 3', () => {
    expect(content.decisao.recomendacoes).toHaveLength(3);
    expect(content.decisao.recomendacoes[0]).toContain('SE');
  });

  it('exports prova.nodes as array of 4', () => {
    expect(content.prova.nodes).toHaveLength(4);
  });
});
