import type { Token } from '../types';
import type { TokenizerStrategy } from './types';
import { SPECIAL_TOKENS, SPECIAL_TOKEN_IDS } from '../core/specialTokens';

/**
 * Word-only strategy. Every word/number unit becomes exactly one token;
 * unknowns collapse to <UNK>. Punctuation is preserved as a char-level token
 * so that decoded output keeps its shape.
 */
export const wordStrategy: TokenizerStrategy = {
  mode: 'word',
  encodeUnits(units, vocab) {
    const tokens: Token[] = [];
    for (const unit of units) {
      if (unit.kind === 'punct') {
        const id = vocab.idOf(unit.text);
        tokens.push(
          id !== undefined
            ? { id, surface: unit.text, kind: 'punct' }
            : { id: SPECIAL_TOKEN_IDS.UNK, surface: unit.text, kind: 'special' },
        );
        continue;
      }
      const id = vocab.idOf(unit.text);
      if (id !== undefined) {
        tokens.push({ id, surface: unit.text, kind: 'word' });
      } else {
        tokens.push({
          id: SPECIAL_TOKEN_IDS.UNK,
          surface: SPECIAL_TOKENS[SPECIAL_TOKEN_IDS.UNK],
          kind: 'special',
        });
      }
    }
    return tokens;
  },
};
