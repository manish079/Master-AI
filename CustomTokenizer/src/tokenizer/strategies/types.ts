import type { Token, Unit } from '../types';
import type { Vocabulary } from '../core/Vocabulary';

export type TokenizerMode = 'hybrid' | 'word' | 'character';

export interface TokenizerStrategy {
  readonly mode: TokenizerMode;
  encodeUnits(units: readonly Unit[], vocab: Vocabulary): Token[];
}

export interface TokenizerModeOption {
  readonly value: TokenizerMode;
  readonly label: string;
  readonly description: string;
}

export const TOKENIZER_MODES: readonly TokenizerModeOption[] = Object.freeze([
  {
    value: 'hybrid',
    label: 'Word + Char (Hybrid)',
    description: 'Common words → 1 token; unknown words fall back to characters. Lossless.',
  },
  {
    value: 'word',
    label: 'Word-only',
    description: 'Each word → 1 token. Unknown words become <UNK> (lossy).',
  },
  {
    value: 'character',
    label: 'Character-based',
    description: 'Every character is its own token. Always lossless, never uses the word vocab.',
  },
]);
