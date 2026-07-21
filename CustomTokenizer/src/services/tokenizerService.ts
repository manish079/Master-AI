import { Tokenizer } from '../tokenizer/core/Tokenizer';
import type { TokenizationResult } from '../tokenizer/types';
import type { TokenizerMode } from '../tokenizer/strategies';

export const MAX_INPUT_LENGTH = 50_000;

/**
 * UI-facing facade. Owns the singleton Tokenizer instance and applies
 * boundary concerns (length guard, ID parsing). The UI never imports
 * core tokenizer modules directly — preserves the layering boundary.
 */
class TokenizerService {
  private readonly tokenizer = new Tokenizer();

  tokenize(text: string, mode: TokenizerMode = 'hybrid'): TokenizationResult {
    return this.tokenizer.tokenize(this.guardLength(text), mode);
  }

  decodeIds(ids: readonly number[]): string {
    return this.tokenizer.decodeIds(ids);
  }

  /**
   * Parse a free-form list of token IDs (commas, whitespace, brackets all OK).
   * Returns the parsed numeric array along with any non-numeric chunks the
   * caller should surface as an inline warning.
   */
  parseIdInput(raw: string): { ids: number[]; rejected: string[] } {
    const ids: number[] = [];
    const rejected: string[] = [];
    const cleaned = raw.replace(/[\[\]]/g, ' ');
    for (const chunk of cleaned.split(/[\s,]+/)) {
      if (chunk.length === 0) continue;
      const n = Number(chunk);
      if (Number.isInteger(n) && n >= 0) ids.push(n);
      else rejected.push(chunk);
    }
    return { ids, rejected };
  }

  vocabSize(): number {
    return this.tokenizer.vocab.size();
  }

  private guardLength(text: string): string {
    return text.length <= MAX_INPUT_LENGTH ? text : text.slice(0, MAX_INPUT_LENGTH);
  }
}

export const tokenizerService = new TokenizerService();
