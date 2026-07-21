import type { Token } from '../types';
import type { Vocabulary } from '../core/Vocabulary';
import type { TokenizerStrategy } from './types';
import { SPECIAL_TOKEN_IDS } from '../core/specialTokens';

/**
 * Character-based strategy. Every character of every unit becomes its own
 * token, with a single space token between adjacent units so the original
 * spacing round-trips on decode.
 */
export const characterStrategy: TokenizerStrategy = {
  mode: 'character',
  encodeUnits(units, vocab) {
    const tokens: Token[] = [];
    units.forEach((unit, idx) => {
      if (idx > 0 && unit.kind !== 'punct') tokens.push(charToken(' ', vocab));
      for (const ch of Array.from(unit.text)) {
        tokens.push(charToken(ch, vocab));
      }
    });
    return tokens;
  },
};

function charToken(ch: string, vocab: Vocabulary): Token {
  const id = vocab.idOf(ch);
  if (id !== undefined) return { id, surface: ch, kind: 'char' };
  return { id: SPECIAL_TOKEN_IDS.UNK, surface: ch, kind: 'special' };
}
