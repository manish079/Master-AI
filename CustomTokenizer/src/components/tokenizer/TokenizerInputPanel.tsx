import type { Token } from '../../tokenizer/types';
import { TOKENIZER_MODES, type TokenizerMode } from '../../tokenizer/strategies';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { theme } from '../../styles/theme';
import { TokenizedTextPreview } from './TokenizedTextPreview';

interface TokenizerInputPanelProps {
  inputText: string;
  mode: TokenizerMode;
  tokens: readonly Token[];
  hasInput: boolean;
  onChangeInput: (text: string) => void;
  onChangeMode: (mode: TokenizerMode) => void;
  onTokenize: () => void;
  onClear: () => void;
}

export function TokenizerInputPanel({
  inputText,
  mode,
  tokens,
  hasInput,
  onChangeInput,
  onChangeMode,
  onTokenize,
  onClear,
}: TokenizerInputPanelProps) {
  const modeOptions = TOKENIZER_MODES.map((m) => ({ value: m.value, label: m.label }));
  const activeMode = TOKENIZER_MODES.find((m) => m.value === mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTokenize();
  };

  return (
    <Card title="Input & Tokenization" icon={<PlayIcon />}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="tokenizer-input" className={theme.sectionLabel}>
            Input Text
          </label>
          <TextArea
            id="tokenizer-input"
            value={inputText}
            onChange={(e) => onChangeInput(e.target.value)}
            placeholder="Type or paste text here, then press Tokenize…"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={!hasInput} aria-label="Tokenize input">
                Tokenize
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClear}
                aria-label="Clear input"
              >
                Clear
              </Button>
            </div>
            <span className="text-xs text-slate-500">
              {inputText.length.toLocaleString()} chars
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="tokenizer-mode" className={theme.sectionLabel}>
            Tokenizer Type
          </label>
          <Select
            id="tokenizer-mode"
            value={mode}
            options={modeOptions}
            onChange={(e) => onChangeMode(e.target.value as TokenizerMode)}
          />
          {activeMode && (
            <p className="mt-1.5 text-xs text-slate-400">{activeMode.description}</p>
          )}
        </div>

        <div>
          <h3 className={theme.sectionLabel}>Tokenized Text</h3>
          <TokenizedTextPreview tokens={tokens} />
        </div>
      </form>
    </Card>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 2l9 5-9 5V2z" />
    </svg>
  );
}
