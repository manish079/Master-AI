export const SPECIAL_TOKENS = Object.freeze([
  '<PAD>',
  '<UNK>',
  '<BOS>',
  '<EOS>',
] as const);

export const SPECIAL_TOKEN_IDS = Object.freeze({
  PAD: 0,
  UNK: 1,
  BOS: 2,
  EOS: 3,
});
