import type { TokenizationStats } from '../../tokenizer/types';

interface StatsBarProps {
  stats: TokenizationStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: 'Tokens', value: stats.tokenCount },
    { label: 'Word', value: stats.wordTokens },
    { label: 'Char', value: stats.charTokens },
    { label: 'Punct', value: stats.punctTokens },
    { label: 'Vocab hit', value: `${(stats.vocabHitRate * 100).toFixed(0)}%` },
  ];
  return (
    <dl className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1"
        >
          <dt className="text-slate-400">{item.label}</dt>
          <dd className="font-mono font-medium text-slate-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
