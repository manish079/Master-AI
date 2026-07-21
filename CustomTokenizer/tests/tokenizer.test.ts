import { describe, it, expect } from 'vitest';
import { Tokenizer } from '../src/tokenizer/core/Tokenizer';

describe('Tokenizer', () => {
  const tokenizer = new Tokenizer();

  it('produces identical IDs for identical inputs (determinism)', () => {
    const sample = 'The quick brown fox jumps over the lazy dog.';
    const baseline = tokenizer.tokenize(sample).ids;
    for (let i = 0; i < 100; i += 1) {
      expect(tokenizer.tokenize(sample).ids).toEqual(baseline);
    }
  });

  it('round-trips text via encode → decode for in-vocab input', () => {
    const sample = 'the quick brown fox jumps over the lazy dog';
    const result = tokenizer.tokenize(sample);
    expect(result.decoded).toBe(sample);
  });

  it('reconstructs OOV words via char-level fallback', () => {
    const sample = 'the flibbertigibbet ran';
    const result = tokenizer.tokenize(sample);
    expect(result.decoded).toContain('flibbertigibbet');
  });

  it('returns an empty result for empty or whitespace-only input', () => {
    expect(tokenizer.tokenize('').tokens).toHaveLength(0);
    expect(tokenizer.tokenize('   \n\t   ').tokens).toHaveLength(0);
  });

  it('reports stats consistent with the token list', () => {
    const sample = 'the quick brown fox.';
    const { stats, tokens } = tokenizer.tokenize(sample);
    expect(stats.tokenCount).toBe(tokens.length);
    expect(stats.wordTokens + stats.charTokens + stats.punctTokens).toBeLessThanOrEqual(
      tokens.length,
    );
    expect(stats.vocabHitRate).toBeGreaterThan(0);
    expect(stats.vocabHitRate).toBeLessThanOrEqual(1);
  });

  it('treats common words case-insensitively (via normalization)', () => {
    const lower = tokenizer.tokenize('the').ids;
    const upper = tokenizer.tokenize('THE').ids;
    expect(lower).toEqual(upper);
  });
});
