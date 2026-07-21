import { Header } from '../components/layout/Header';
import { TokenizerInputPanel } from '../components/tokenizer/TokenizerInputPanel';
import { TokenizerOutputPanel } from '../components/tokenizer/TokenizerOutputPanel';
import { useTokenizer } from '../hooks/useTokenizer';
import { tokenizerService } from '../services/tokenizerService';
import { theme } from '../styles/theme';

export function HomePage() {
  const t = useTokenizer();

  return (
    <div className={theme.pageBg}>
      <Header vocabSize={tokenizerService.vocabSize()} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Tokenize text deterministically
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">
            Common words map to a single stable ID. Switch tokenizer types to see different
            encoding strategies. Paste any token IDs in the right panel to decode them back to text.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TokenizerInputPanel
            inputText={t.inputText}
            mode={t.mode}
            tokens={t.result?.tokens ?? []}
            hasInput={t.hasInput}
            onChangeInput={t.setInputText}
            onChangeMode={t.setMode}
            onTokenize={t.tokenize}
            onClear={t.clear}
          />
          <TokenizerOutputPanel
            result={t.result}
            encodeError={t.encodeError}
            isTruncated={t.isTruncated}
            decodeIdsRaw={t.decodeIdsRaw}
            onChangeDecodeIds={t.setDecodeIdsRaw}
            onDecode={t.decodeFromIds}
            decoded={t.decode.decoded}
            decodeError={t.decode.error}
            rejected={t.decode.rejected}
          />
        </div>
      </main>
    </div>
  );
}
