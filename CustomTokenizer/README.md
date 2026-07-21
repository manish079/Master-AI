# Custom Tokenizer

A production-grade, deterministic custom tokenizer with a modern dark-themed React UI.

Common English words map to a single stable token ID; out-of-vocabulary words
fall back to character-level tokens, so encoding is **lossless** and **fully
reversible**. Same input always produces the same token IDs.

**Features**
- **Three tokenizer modes** selectable in the UI:
  - *Hybrid* (default) — words from vocab + char-level OOV fallback (lossless).
  - *Word-only* — every word is one token; unknowns become `<UNK>` (lossy).
  - *Character-based* — one token per character (always lossless).
- **Decode panel** — paste any list of token IDs and reconstruct the original text.
- **Visual tokenized text** — boxed cells per token, color-coded by kind.
- **~1500-word vocabulary** covering common English plus tech/product nouns
  (`user`, `email`, `india`, `react`, `database`, …) so day-to-day prose
  encodes compactly.

---

## Quick Start

```bash
cd "CustomTokenizer"
npm install
npm run dev
```

Open the URL printed by Vite (default `http://localhost:5173`).

### Other scripts

```bash
npm test         # run the unit test suite (vitest)
npm run build    # type-check and produce a production bundle in dist/
npm run preview  # preview the production bundle
npm run lint     # type-check only
```

> Requires Node.js 18+ (Node 20 LTS recommended).

---

## Architecture

Two strict layers. Dependencies point inward only — UI imports from services,
services import from the tokenizer core, and the tokenizer core has zero React
dependencies (it's pure TypeScript and trivially portable).

```
┌─────────────────────────────────────────────┐
│             UI LAYER  (React)               │
│   pages / components / hooks / styles       │
│            depends on services              │
└──────────────────┬──────────────────────────┘
                   │ imports
                   ▼
┌─────────────────────────────────────────────┐
│       DATA LAYER  (pure TypeScript)         │
│  services → tokenizer (core / preprocessing │
│             / encoding / data)              │
└─────────────────────────────────────────────┘
```

### Folder structure

```
src/
├── components/          UI Layer
│   ├── layout/          → Header
│   ├── tokenizer/       → TokenizerInput, TokenizerOutput, TokenChip, StatsBar
│   └── ui/              → Button, TextArea, Card  (design-system primitives)
├── pages/               → HomePage (composes the page)
├── hooks/               → useTokenizer (state management)
├── services/            → tokenizerService (singleton facade)
├── tokenizer/           Data Layer (pure, framework-free)
│   ├── core/            → Tokenizer, Vocabulary, specialTokens
│   ├── strategies/      → hybrid / word-only / character (swappable)
│   ├── preprocessing/   → normalizer, splitter
│   ├── encoding/        → encoder (hybrid wrapper), decoder + decodeIds
│   ├── data/            → commonWords (~1500), characters
│   └── types.ts
├── styles/              → Tailwind base + design tokens
└── main.tsx, App.tsx
tests/                   → vitest suite (vocab, normalizer, encoder, full pipeline)
```

---

## Tokenization Flow

```
raw text
   │
   ▼  preprocessing/normalizer.ts
NFKC + lowercase + collapse whitespace
   │
   ▼  preprocessing/splitter.ts
Unit[]  — words / numbers / punctuation
   │
   ▼  encoding/encoder.ts
For each unit:
  • word in vocab? → emit one word-token (consistent ID)
  • else            → emit one char-token per character (lossless fallback)
  • punct           → emit one punct-token
   │
   ▼
Token[]  →  decoder.ts can reverse this back to text
```

### Vocabulary layout (frozen IDs)

| ID range  | Contents                                   | Source                              |
|-----------|--------------------------------------------|-------------------------------------|
| `0–3`     | `<PAD>`, `<UNK>`, `<BOS>`, `<EOS>`         | `tokenizer/core/specialTokens.ts`   |
| `4–~80`   | Printable characters (a–z, 0–9, punct)     | `tokenizer/data/characters.ts`      |
| `~81–...` | ~500 common English words                  | `tokenizer/data/commonWords.ts`     |

Order is fixed via `Object.freeze`. Any common word always gets the same ID
across runs and machines — that's the determinism guarantee.

### Extending the vocabulary

To add new common words, **append** them to the `COMMON_WORDS` array in
`src/tokenizer/data/commonWords.ts`. Appending preserves all existing IDs;
inserting in the middle or reordering will break determinism for any consumer
that has stored old IDs.

---

## Design Decisions

- **Char-level fallback over `<UNK>`** — keeps the encoder lossless: `decode(encode(x))` reconstructs `x` for any input. A single `<UNK>` token would discard information.
- **Singleton service** — the tokenizer is stateless and immutable, so one shared instance is sufficient and avoids re-allocating the vocabulary on every keystroke.
- **Single-responsibility functions** — `normalize`, `split`, `encodeUnits`, and `decode` each do exactly one thing and compose into the `Tokenizer` orchestrator.
- **UI ↔ data isolation** — UI components never import tokenizer internals directly. They go through `tokenizerService`, which is the boundary that handles input length guards and any future caching/telemetry.

---

## Verification Checklist

- [x] `npm test` — all suites green (vocab, normalizer, encoder, end-to-end)
- [x] `npm run build` — zero TypeScript errors, production bundle in `dist/`
- [x] Manual: tokenize `"The quick brown fox jumps over the lazy dog."` → mostly word tokens
- [x] Manual: tokenize `"flibbertigibbet"` → amber char-fallback chips
- [x] Manual: tokenize the same input twice → identical IDs (determinism)
- [x] Manual: empty input → friendly empty state, no crash

---

## Tech Stack

React 18 · TypeScript 5 · Vite 5 · Tailwind CSS 3 · Vitest 2
