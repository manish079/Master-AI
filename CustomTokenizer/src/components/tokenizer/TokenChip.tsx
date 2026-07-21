import type { Token } from '../../tokenizer/types';
import { theme } from '../../styles/theme';

interface TokenChipProps {
  token: Token;
}

const VISIBLE_WHITESPACE: Record<string, string> = {
  ' ': '␣',
  '\n': '↵',
  '\t': '⇥',
};

export function TokenChip({ token }: TokenChipProps) {
  const displayed = VISIBLE_WHITESPACE[token.surface] ?? token.surface;
  const className = theme.tokenChip[token.kind];
  return (
    <span
      title={`${token.kind} • surface "${token.surface}" • id ${token.id}`}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs ${className}`}
    >
      <span className="font-medium">{displayed}</span>
      <span className="opacity-70">{token.id}</span>
    </span>
  );
}
