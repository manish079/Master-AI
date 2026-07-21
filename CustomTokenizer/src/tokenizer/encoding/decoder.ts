import type { Token } from '../types';
import { Vocabulary } from '../core/Vocabulary';

/**
 * Reconstruct human-readable text from rich tokens. Adjacent char tokens
 * concatenate (so OOV words rebuild as one word); punctuation never gets a
 * leading space; everything else is space-separated.
 */
export function decode(tokens: readonly Token[], vocab: Vocabulary): string {
  let out = '';
  let prevKind: Token['kind'] | null = null;

  for (const token of tokens) {
    const surface = vocab.entryOf(token.id) ?? token.surface;
    const needsLeadingSpace =
      prevKind !== null &&
      token.kind !== 'punct' &&
      surface !== ' ' &&
      !(prevKind === 'char' && token.kind === 'char');

    if (needsLeadingSpace) out += ' ';
    out += surface;
    prevKind = token.kind;
  }
  return out;
}

/**
 * Decode a bare ID list (no kind metadata available). Infers structure from
 * each entry's surface form: multi-character entries are treated as words,
 * single characters as part of the surrounding char run. Designed for the
 * "paste IDs to decode" workflow.
 */
export function decodeIds(ids: readonly number[], vocab: Vocabulary): string {
  let out = '';
  let prevWasSingle = false;

  for (const id of ids) {
    const entry = vocab.entryOf(id);
    if (entry === undefined) {
      if (out.length > 0 && !out.endsWith(' ')) out += ' ';
      out += '<UNK>';
      prevWasSingle = false;
      continue;
    }

    if (isPunctuation(entry)) {
      out += entry;
      prevWasSingle = false;
      continue;
    }

    const isSingle = Array.from(entry).length === 1 && entry !== ' ';
    if (out.length === 0 || out.endsWith(' ')) {
      out += entry;
    } else if (entry === ' ') {
      if (!out.endsWith(' ')) out += ' ';
    } else if (isSingle && prevWasSingle) {
      out += entry;
    } else {
      if (!out.endsWith(' ')) out += ' ';
      out += entry;
    }
    prevWasSingle = isSingle;
  }

  return out.trim();
}

function isPunctuation(s: string): boolean {
  return s.length === 1 && /[^\s\p{L}\p{N}]/u.test(s);
}
