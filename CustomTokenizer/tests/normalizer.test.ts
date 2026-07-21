import { describe, it, expect } from 'vitest';
import { normalize } from '../src/tokenizer/preprocessing/normalizer';
import { split } from '../src/tokenizer/preprocessing/splitter';

describe('normalize', () => {
  it('lowercases ASCII text', () => {
    expect(normalize('Hello World')).toBe('hello world');
  });

  it('collapses whitespace and trims', () => {
    expect(normalize('  foo   bar\n\nbaz  ')).toBe('foo bar baz');
  });

  it('applies NFKC: full-width digits → ASCII', () => {
    expect(normalize('１２３')).toBe('123');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(normalize('   \n\t  ')).toBe('');
  });
});

describe('split', () => {
  it('splits words and punctuation as separate units', () => {
    const units = split('the quick, brown fox.');
    expect(units.map((u) => u.text)).toEqual(['the', 'quick', ',', 'brown', 'fox', '.']);
    expect(units.map((u) => u.kind)).toEqual([
      'word',
      'word',
      'punct',
      'word',
      'word',
      'punct',
    ]);
  });

  it('classifies number runs as numbers', () => {
    const units = split('order 42 now');
    expect(units.map((u) => u.kind)).toEqual(['word', 'number', 'word']);
  });

  it('returns an empty array for empty input', () => {
    expect(split('')).toEqual([]);
  });
});
