import type { Token } from '../../tokenizer/types';
import { theme } from '../../styles/theme';

interface TokenizedTextPreviewProps {
  tokens: readonly Token[];
}

/**
 * Renders the tokenized text as a row of letter/word cells (like the screenshot
 * reference). Each token gets one boxed cell, color-coded by kind. Whitespace
 * is rendered as a small gap so the original word boundaries are visible.
 */
export function TokenizedTextPreview({ tokens }: TokenizedTextPreviewProps) {
  if (tokens.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 bg-slate-900/40 px-3 py-6 text-center text-xs text-slate-500">
        Tokenized text will appear here.
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-slate-900/40 p-3">
      {tokens.map((tok, idx) => {
        const cellClass =
          tok.kind === 'word'
            ? theme.unitCell.word
            : tok.kind === 'punct'
              ? theme.unitCell.punct
              : theme.unitCell.char;
        return (
          <span
            key={`${tok.id}-${idx}`}
            title={`${tok.kind} • id ${tok.id}`}
            className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-md border px-1.5 py-1 font-mono text-xs ${cellClass}`}
          >
            {renderSurface(tok.surface)}
          </span>
        );
      })}
    </div>
  );
}

function renderSurface(s: string): string {
  if (s === ' ') return '␣';
  if (s === '\n') return '↵';
  if (s === '\t') return '⇥';
  return s;
}
