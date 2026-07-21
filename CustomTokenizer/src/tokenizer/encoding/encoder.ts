import type { Token, Unit } from '../types';
import type { Vocabulary } from '../core/Vocabulary';
import { hybridStrategy } from '../strategies/hybridStrategy';

/**
 * Backwards-compatible default encoder. The Tokenizer orchestrator now
 * dispatches through `strategies/`; this remains as the canonical entry
 * point for code that just wants the hybrid (lossless) behavior.
 */
export function encodeUnits(units: readonly Unit[], vocab: Vocabulary): Token[] {
  return hybridStrategy.encodeUnits(units, vocab);
}
