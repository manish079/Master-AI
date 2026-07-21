/**
 * Character vocabulary used as the lossless OOV fallback.
 * Order is frozen — DO NOT reorder, doing so will change every char-token ID.
 */
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const PUNCTUATION = ` .,!?;:'"()-_/\\@#$%&*+=<>[]{}|~^\`\n\t`;

export const CHARACTERS: readonly string[] = Object.freeze(
  Array.from(LOWERCASE + DIGITS + PUNCTUATION),
);
