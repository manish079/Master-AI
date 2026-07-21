import { Vocabulary } from './Vocabulary';
import { normalize } from '../preprocessing/normalizer';
import { split } from '../preprocessing/splitter';
import { decode, decodeIds } from '../encoding/decoder';
import { getStrategy, type TokenizerMode } from '../strategies';
import type { Token, TokenizationResult, TokenizationStats } from '../types';

/**
 * Orchestrates the tokenization pipeline: normalize → split → strategy.encodeUnits.
 * The strategy is swappable per-call so the UI can toggle modes without
 * re-instantiating the tokenizer or rebuilding the vocabulary.
 */
export class Tokenizer {
  constructor(private readonly vocabulary: Vocabulary = new Vocabulary()) {}

  encode(text: string, mode: TokenizerMode = 'hybrid'): Token[] {
    if (!text) return [];
    const normalized = normalize(text);
    if (!normalized) return [];
    const units = split(normalized);
    return getStrategy(mode).encodeUnits(units, this.vocabulary);
  }

  decode(tokens: readonly Token[]): string {
    return decode(tokens, this.vocabulary);
  }

  decodeIds(ids: readonly number[]): string {
    return decodeIds(ids, this.vocabulary);
  }

  tokenize(text: string, mode: TokenizerMode = 'hybrid'): TokenizationResult {
    const tokens = this.encode(text, mode);
    return {
      tokens,
      ids: tokens.map((t) => t.id),
      decoded: this.decode(tokens),
      stats: computeStats(tokens),
    };
  }

  get vocab(): Vocabulary {
    return this.vocabulary;
  }
}

function computeStats(tokens: readonly Token[]): TokenizationStats {
  let wordTokens = 0;
  let charTokens = 0;
  let punctTokens = 0;
  for (const t of tokens) {
    if (t.kind === 'word') wordTokens += 1;
    else if (t.kind === 'char') charTokens += 1;
    else if (t.kind === 'punct') punctTokens += 1;
  }
  const tokenCount = tokens.length;
  const vocabHitRate = tokenCount === 0 ? 0 : wordTokens / tokenCount;
  return { tokenCount, wordTokens, charTokens, punctTokens, vocabHitRate };
}
