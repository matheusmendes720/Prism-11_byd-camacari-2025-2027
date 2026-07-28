import { describe, it, expect } from 'vitest';
import { glossary, getDefinition } from '@/components/glossary/glossary-data';

describe('glossary', () => {
  it('contains 10 terms', () => {
    expect(Object.keys(glossary)).toHaveLength(10);
  });

  it('includes PTAX', () => {
    expect(glossary.PTAX).toBeDefined();
    expect(getDefinition('PTAX')).toContain('câmbio');
  });

  it('getDefinition returns fallback for unknown term', () => {
    expect(getDefinition('XYZ')).toBe('');
  });
});
