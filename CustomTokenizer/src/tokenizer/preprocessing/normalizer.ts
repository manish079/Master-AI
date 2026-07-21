/**
 * Normalize raw input into a canonical form before splitting.
 * Single responsibility: produce a deterministic string for tokenization.
 *
 * Steps:
 *   1. Unicode NFKC normalization (e.g. ﬁ → fi, full-width digits → ASCII)
 *   2. Lowercase (locale-independent via toLowerCase, not toLocaleLowerCase)
 *   3. Collapse runs of whitespace into a single space and trim
 */
export function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
