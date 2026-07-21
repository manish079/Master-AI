import { SPECIAL_TOKENS } from './specialTokens';
import { CHARACTERS } from '../data/characters';
import { COMMON_WORDS } from '../data/commonWords';

/**
 * Bidirectional, frozen mapping between vocabulary entries and stable numeric IDs.
 * IDs are assigned by concatenating: special tokens, characters, common words,
 * in that fixed order. Same input → same ID across runs and machines.
 */
export class Vocabulary {
  private readonly entryToId: ReadonlyMap<string, number>;
  private readonly idToEntry: ReadonlyMap<number, string>;
  readonly specialOffset: number;
  readonly charOffset: number;
  readonly wordOffset: number;

  constructor(
    specials: readonly string[] = SPECIAL_TOKENS,
    chars: readonly string[] = CHARACTERS,
    words: readonly string[] = COMMON_WORDS,
  ) {
    const entryToId = new Map<string, number>();
    const idToEntry = new Map<number, string>();

    let nextId = 0;
    this.specialOffset = nextId;
    nextId = registerAll(specials, nextId, entryToId, idToEntry);

    this.charOffset = nextId;
    nextId = registerAll(chars, nextId, entryToId, idToEntry);

    this.wordOffset = nextId;
    registerAll(words, nextId, entryToId, idToEntry);

    this.entryToId = entryToId;
    this.idToEntry = idToEntry;
  }

  has(entry: string): boolean {
    return this.entryToId.has(entry);
  }

  idOf(entry: string): number | undefined {
    return this.entryToId.get(entry);
  }

  entryOf(id: number): string | undefined {
    return this.idToEntry.get(id);
  }

  size(): number {
    return this.entryToId.size;
  }
}

/**
 * Register a sequence of entries starting at `startId`. Duplicates are silently
 * skipped so the first occurrence of an entry wins (preserves determinism even
 * if a word appears in two source lists).
 */
function registerAll(
  entries: readonly string[],
  startId: number,
  entryToId: Map<string, number>,
  idToEntry: Map<number, string>,
): number {
  let id = startId;
  for (const entry of entries) {
    if (entryToId.has(entry)) continue;
    entryToId.set(entry, id);
    idToEntry.set(id, entry);
    id += 1;
  }
  return id;
}
