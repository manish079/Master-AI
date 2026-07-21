export type TokenKind = 'word' | 'char' | 'punct' | 'special';

export interface Token {
  readonly id: number;
  readonly surface: string;
  readonly kind: TokenKind;
}

export type UnitKind = 'word' | 'number' | 'punct';

export interface Unit {
  readonly text: string;
  readonly kind: UnitKind;
}

export interface TokenizationResult {
  readonly tokens: readonly Token[];
  readonly ids: readonly number[];
  readonly decoded: string;
  readonly stats: TokenizationStats;
}

export interface TokenizationStats {
  readonly tokenCount: number;
  readonly wordTokens: number;
  readonly charTokens: number;
  readonly punctTokens: number;
  readonly vocabHitRate: number;
}
