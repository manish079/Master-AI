import { useState } from 'react';
import type { TokenizationResult } from '../../tokenizer/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { theme } from '../../styles/theme';
import { TokenChip } from './TokenChip';
import { StatsBar } from './StatsBar';

interface TokenizerOutputPanelProps {
  result: TokenizationResult | null;
  encodeError: string | null;
  isTruncated: boolean;
  decodeIdsRaw: string;
  onChangeDecodeIds: (raw: string) => void;
  onDecode: () => void;
  decoded: string | null;
  decodeError: string | null;
  rejected: readonly string[];
}

export function TokenizerOutputPanel(props: TokenizerOutputPanelProps) {
  const {
    result,
    encodeError,
    isTruncated,
    decodeIdsRaw,
    onChangeDecodeIds,
    onDecode,
    decoded,
    decodeError,
    rejected,
  } = props;

  return (
    <Card title="Token Output" icon={<PlayIcon />}>
      <div className="space-y-6">
        <EncodedSection
          result={result}
          encodeError={encodeError}
          isTruncated={isTruncated}
        />
        <div className="border-t border-white/10" />
        <DecodeSection
          decodeIdsRaw={decodeIdsRaw}
          onChangeDecodeIds={onChangeDecodeIds}
          onDecode={onDecode}
          decoded={decoded}
          decodeError={decodeError}
          rejected={rejected}
        />
      </div>
    </Card>
  );
}

function EncodedSection({
  result,
  encodeError,
  isTruncated,
}: Pick<TokenizerOutputPanelProps, 'result' | 'encodeError' | 'isTruncated'>) {
  const [copied, setCopied] = useState(false);

  if (encodeError) {
    return (
      <div>
        <h3 className={theme.sectionLabel}>Encoded Tokens</h3>
        <p role="alert" className="text-sm text-rose-300">
          {encodeError}
        </p>
      </div>
    );
  }

  if (!result || result.tokens.length === 0) {
    return (
      <div>
        <h3 className={theme.sectionLabel}>Encoded Tokens</h3>
        <p className="rounded-lg border border-dashed border-white/10 bg-slate-900/40 px-3 py-6 text-center text-xs text-slate-500">
          Encoded tokens will appear here.
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result.ids));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={theme.sectionLabel}>Encoded Tokens</h3>
        <Button variant="secondary" onClick={handleCopy} aria-label="Copy token IDs">
          {copied ? 'Copied!' : '📋 Copy'}
        </Button>
      </div>

      {isTruncated && (
        <p
          role="alert"
          className="rounded-md border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
        >
          Input exceeded the maximum length and was truncated.
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 rounded-lg border border-white/10 bg-slate-900/40 p-3 max-h-56 overflow-auto scrollbar-slim">
        {result.tokens.map((token, idx) => (
          <TokenChip key={`${token.id}-${idx}`} token={token} />
        ))}
      </div>

      <StatsBar stats={result.stats} />
    </div>
  );
}

function DecodeSection({
  decodeIdsRaw,
  onChangeDecodeIds,
  onDecode,
  decoded,
  decodeError,
  rejected,
}: Pick<
  TokenizerOutputPanelProps,
  'decodeIdsRaw' | 'onChangeDecodeIds' | 'onDecode' | 'decoded' | 'decodeError' | 'rejected'
>) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDecode();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className={theme.sectionLabel}>Decode Tokens</h3>
          <Button type="submit" aria-label="Decode token IDs">
            Decode
          </Button>
        </div>
        <TextArea
          id="decode-ids-input"
          value={decodeIdsRaw}
          onChange={(e) => onChangeDecodeIds(e.target.value)}
          placeholder="Paste token IDs (e.g. 102, 47, 88, 132)…"
          className="font-mono"
        />
        {rejected.length > 0 && (
          <p className="mt-1.5 text-xs text-amber-300">
            Skipped non-numeric input: {rejected.slice(0, 5).join(', ')}
            {rejected.length > 5 ? '…' : ''}
          </p>
        )}
      </div>

      <div>
        <h3 className={theme.sectionLabel}>Decoded Text</h3>
        {decodeError ? (
          <p
            role="alert"
            className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-3 text-sm text-rose-200"
          >
            {decodeError}
          </p>
        ) : (
          <pre className="rounded-lg border border-white/10 bg-slate-900/40 p-3 font-mono text-sm text-emerald-100 whitespace-pre-wrap min-h-[3rem] scrollbar-slim">
            {decoded ?? <span className="text-slate-500">Decoded text will appear here.</span>}
          </pre>
        )}
      </div>
    </form>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M3 2l9 5-9 5V2z" />
    </svg>
  );
}
