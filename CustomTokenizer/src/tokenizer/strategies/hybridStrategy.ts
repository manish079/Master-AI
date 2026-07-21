import type { Token } from '../types';
import type { Vocabulary } from '../core/Vocabulary';
import type { TokenizerStrategy } from './types';
import { SPECIAL_TOKEN_IDS } from '../core/specialTokens';

/**
 * Default strategy. Word in vocab → one token. Otherwise, character-level
 * fallback so the encoding stays fully reversible.
 */
export const hybridStrategy: TokenizerStrategy = {
  mode: 'hybrid',
  encodeUnits(units, vocab) {
    const tokens: Token[] = [];
    for (const unit of units) {
      if (unit.kind === 'punct') {
        tokens.push(charToken(unit.text, vocab, 'punct'));
        continue;
      }
      const wordId = vocab.idOf(unit.text);
      if (wordId !== undefined) {
        tokens.push({ id: wordId, surface: unit.text, kind: 'word' });
        continue;
      }
      for (const ch of Array.from(unit.text)) {
        tokens.push(charToken(ch, vocab, 'char'));
      }
    }
    return tokens;
  },
};

function charToken(ch: string, vocab: Vocabulary, kind: 'char' | 'punct'): Token {
  const id = vocab.idOf(ch);
  if (id !== undefined) return { id, surface: ch, kind };
  return { id: SPECIAL_TOKEN_IDS.UNK, surface: ch, kind: 'special' };
}
