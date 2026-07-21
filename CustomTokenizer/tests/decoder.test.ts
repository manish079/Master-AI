import { describe, it, expect } from 'vitest';
import { Tokenizer } from '../src/tokenizer/core/Tokenizer';

describe('decodeIds (paste-and-decode flow)', () => {
  const tokenizer = new Tokenizer();

  it('round-trips common-word IDs', () => {
    const { ids } = tokenizer.tokenize('user is going to india', 'hybrid');
    expect(tokenizer.decodeIds(ids)).toBe('user is going to india');
  });

  it('rebuilds OOV words from char-fallback IDs', () => {
    const { ids } = tokenizer.tokenize('the flibbertigibbet ran', 'hybrid');
    expect(tokenizer.decodeIds(ids)).toBe('the flibbertigibbet ran');
  });

  it('attaches punctuation without a leading space', () => {
    const { ids } = tokenizer.tokenize('hello, world.', 'hybrid');
    expect(tokenizer.decodeIds(ids)).toBe('hello, world.');
  });

  it('returns <UNK> for IDs outside the vocabulary', () => {
    const decoded = tokenizer.decodeIds([999_999]);
    expect(decoded).toContain('<UNK>');
  });
});
