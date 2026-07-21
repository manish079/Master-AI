import { describe, it, expect } from 'vitest';
import { encodeUnits } from '../src/tokenizer/encoding/encoder';
import { Vocabulary } from '../src/tokenizer/core/Vocabulary';
import type { Unit } from '../src/tokenizer/types';

describe('encodeUnits', () => {
  const vocab = new Vocabulary();

  it('emits one word-token for an in-vocab word', () => {
    const units: Unit[] = [{ text: 'the', kind: 'word' }];
    const tokens = encodeUnits(units, vocab);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].kind).toBe('word');
    expect(tokens[0].surface).toBe('the');
  });

  it('falls back to per-character tokens for OOV words', () => {
    const units: Unit[] = [{ text: 'flibbertigibbet', kind: 'word' }];
    const tokens = encodeUnits(units, vocab);
    expect(tokens).toHaveLength('flibbertigibbet'.length);
    expect(tokens.every((t) => t.kind === 'char')).toBe(true);
    expect(tokens.map((t) => t.surface).join('')).toBe('flibbertigibbet');
  });

  it('marks punctuation tokens with kind "punct"', () => {
    const units: Unit[] = [{ text: '.', kind: 'punct' }];
    const tokens = encodeUnits(units, vocab);
    expect(tokens[0].kind).toBe('punct');
    expect(tokens[0].surface).toBe('.');
  });
});
