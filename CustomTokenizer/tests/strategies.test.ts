import { describe, it, expect } from 'vitest';
import { Tokenizer } from '../src/tokenizer/core/Tokenizer';
import { SPECIAL_TOKEN_IDS } from '../src/tokenizer/core/specialTokens';

describe('tokenizer strategies', () => {
  const tokenizer = new Tokenizer();

  describe('hybrid mode', () => {
    it('encodes common words as single tokens', () => {
      const { tokens } = tokenizer.tokenize('user is going to india', 'hybrid');
      // All five units are common words → five word-tokens.
      expect(tokens).toHaveLength(5);
      expect(tokens.every((t) => t.kind === 'word')).toBe(true);
    });

    it('falls back to chars only for OOV words', () => {
      const { tokens } = tokenizer.tokenize('the abc user', 'hybrid');
      // "the" → word, "abc" → 3 chars, "user" → word.
      expect(tokens.map((t) => t.kind)).toEqual(['word', 'char', 'char', 'char', 'word']);
    });
  });

  describe('word-only mode', () => {
    it('replaces every OOV word with a single <UNK>', () => {
      const { tokens } = tokenizer.tokenize('the flibbertigibbet ran', 'word');
      const unk = tokens.find((t) => t.id === SPECIAL_TOKEN_IDS.UNK);
      expect(unk).toBeDefined();
      expect(unk!.kind).toBe('special');
    });

    it('emits one token per word for fully in-vocab input', () => {
      const { tokens } = tokenizer.tokenize('user is going to india', 'word');
      expect(tokens).toHaveLength(5);
      expect(tokens.every((t) => t.kind === 'word')).toBe(true);
    });
  });

  describe('character mode', () => {
    it('emits one token per character', () => {
      const { tokens } = tokenizer.tokenize('hi user', 'character');
      // Letters of "hi", a space token, then letters of "user" → 7 tokens total.
      expect(tokens).toHaveLength(7);
      expect(tokens.every((t) => t.kind === 'char')).toBe(true);
      expect(tokens.map((t) => t.surface).join('')).toBe('hi user');
    });
  });
});
