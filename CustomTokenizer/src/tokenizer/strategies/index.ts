import { hybridStrategy } from './hybridStrategy';
import { wordStrategy } from './wordStrategy';
import { characterStrategy } from './characterStrategy';
import type { TokenizerMode, TokenizerStrategy } from './types';

const STRATEGIES: Record<TokenizerMode, TokenizerStrategy> = {
  hybrid: hybridStrategy,
  word: wordStrategy,
  character: characterStrategy,
};

export function getStrategy(mode: TokenizerMode): TokenizerStrategy {
  return STRATEGIES[mode];
}

export type { TokenizerMode, TokenizerStrategy } from './types';
export { TOKENIZER_MODES } from './types';
