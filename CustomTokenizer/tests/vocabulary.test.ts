import { describe, it, expect } from 'vitest';
import { Vocabulary } from '../src/tokenizer/core/Vocabulary';
import { SPECIAL_TOKEN_IDS } from '../src/tokenizer/core/specialTokens';

describe('Vocabulary', () => {
  const vocab = new Vocabulary();

  it('reserves the four special tokens at IDs 0–3', () => {
    expect(vocab.idOf('<PAD>')).toBe(SPECIAL_TOKEN_IDS.PAD);
    expect(vocab.idOf('<UNK>')).toBe(SPECIAL_TOKEN_IDS.UNK);
    expect(vocab.idOf('<BOS>')).toBe(SPECIAL_TOKEN_IDS.BOS);
    expect(vocab.idOf('<EOS>')).toBe(SPECIAL_TOKEN_IDS.EOS);
  });

  it('maps every entry to a unique, round-trippable ID', () => {
    const seenIds = new Set<number>();
    for (let id = 0; id < vocab.size(); id += 1) {
      const entry = vocab.entryOf(id);
      expect(entry).toBeDefined();
      expect(vocab.idOf(entry!)).toBe(id);
      expect(seenIds.has(id)).toBe(false);
      seenIds.add(id);
    }
  });

  it('returns undefined for unknown lookups', () => {
    expect(vocab.idOf('definitelynotaword_xyz')).toBeUndefined();
    expect(vocab.entryOf(-1)).toBeUndefined();
    expect(vocab.entryOf(999_999)).toBeUndefined();
  });

  it('produces identical IDs across instances (determinism)', () => {
    const a = new Vocabulary();
    const b = new Vocabulary();
    expect(a.idOf('the')).toBe(b.idOf('the'));
    expect(a.idOf('a')).toBe(b.idOf('a'));
    expect(a.size()).toBe(b.size());
  });
});
