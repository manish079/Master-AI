interface HeaderProps {
  vocabSize: number;
}

export function Header({ vocabSize }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-indigo-900/40"
            aria-hidden="true"
          >
            T
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Custom Tokenizer</h1>
            <p className="text-xs text-slate-400">Deterministic encoding · lossless decoding</p>
          </div>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-slate-300">
            vocab {vocabSize.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}
