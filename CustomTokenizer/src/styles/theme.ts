/**
 * Centralized design tokens. Tailwind classes are exported as named groups
 * so component code stays terse and styles stay consistent across the app.
 */
export const theme = {
  // Royal gradient backdrop for the page itself.
  pageBg:
    'min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(217,70,239,0.16),_transparent_55%)] bg-slate-950 text-slate-100',
  // Glassmorphism card surface.
  card:
    'rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_30px_rgba(2,6,23,0.45)] backdrop-blur-xl',
  cardHeader: 'flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4',
  cardBody: 'p-5',
  // Section headers (small caps).
  sectionLabel: 'mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-300/80',
  // Field surfaces (inputs, selects, code blocks).
  fieldSurface:
    'w-full rounded-lg border border-white/10 bg-slate-900/60 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
  // Token chip palette per kind. Mint/emerald gradient for word, amber for char fallback.
  tokenChip: {
    word:
      'bg-gradient-to-br from-emerald-400/20 to-teal-500/30 border-emerald-400/30 text-emerald-100',
    char:
      'bg-gradient-to-br from-amber-400/15 to-orange-500/20 border-amber-300/30 text-amber-100',
    punct: 'bg-white/5 border-white/15 text-slate-200',
    special:
      'bg-gradient-to-br from-fuchsia-500/25 to-purple-600/30 border-fuchsia-400/40 text-fuchsia-100',
  },
  // Visual character cell shown in the "Tokenized Text" preview.
  unitCell: {
    word:
      'bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border-indigo-400/30 text-indigo-100',
    char:
      'bg-white/[0.06] border-white/15 text-slate-100',
    punct: 'bg-white/5 border-white/10 text-slate-300',
  },
} as const;
