import type { Unit } from '../types';

/**
 * Split normalized text into a sequence of typed units. Each match is one of:
 *   - a contiguous run of letters → 'word'
 *   - a contiguous run of digits  → 'number'
 *   - a single non-whitespace, non-alphanumeric character → 'punct'
 *
 * Whitespace is the implicit separator and is dropped — encoding rebuilds
 * spacing during decode based on unit kind.
 */
export function split(text: string): Unit[] {
  const pattern = /\p{L}+|\p{N}+|[^\s\p{L}\p{N}]/gu;
  const units: Unit[] = [];
  for (const match of text.matchAll(pattern)) {
    units.push({ text: match[0], kind: classify(match[0]) });
  }
  return units;
}

function classify(token: string): Unit['kind'] {
  if (/^\p{L}+$/u.test(token)) return 'word';
  if (/^\p{N}+$/u.test(token)) return 'number';
  return 'punct';
}
