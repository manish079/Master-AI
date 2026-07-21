import { useCallback, useMemo, useState } from 'react';
import { tokenizerService, MAX_INPUT_LENGTH } from '../services/tokenizerService';
import type { TokenizationResult } from '../tokenizer/types';
import type { TokenizerMode } from '../tokenizer/strategies';

interface DecodeState {
  decoded: string | null;
  error: string | null;
  rejected: readonly string[];
}

interface State {
  inputText: string;
  mode: TokenizerMode;
  result: TokenizationResult | null;
  encodeError: string | null;
  isTruncated: boolean;
  decodeIdsRaw: string;
  decode: DecodeState;
}

const initialState: State = {
  inputText: '',
  mode: 'hybrid',
  result: null,
  encodeError: null,
  isTruncated: false,
  decodeIdsRaw: '',
  decode: { decoded: null, error: null, rejected: [] },
};

/**
 * Owns the React state for the tokenizer page. Keeps encoding and decoding
 * flows independent so each panel updates without disturbing the other.
 */
export function useTokenizer() {
  const [state, setState] = useState<State>(initialState);

  const setInputText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, inputText: text }));
  }, []);

  const setMode = useCallback((mode: TokenizerMode) => {
    setState((prev) => {
      if (prev.inputText.trim().length === 0) return { ...prev, mode };
      // Re-tokenize live when mode changes if there's already input.
      try {
        const result = tokenizerService.tokenize(prev.inputText, mode);
        return {
          ...prev,
          mode,
          result,
          encodeError: null,
          isTruncated: prev.inputText.length > MAX_INPUT_LENGTH,
          // Pre-fill the decode panel with the freshly-encoded IDs for convenience.
          decodeIdsRaw: result.ids.join(', '),
        };
      } catch (err) {
        return {
          ...prev,
          mode,
          encodeError: err instanceof Error ? err.message : 'Tokenization failed.',
        };
      }
    });
  }, []);

  const tokenize = useCallback(() => {
    setState((prev) => {
      try {
        const result = tokenizerService.tokenize(prev.inputText, prev.mode);
        return {
          ...prev,
          result,
          encodeError: null,
          isTruncated: prev.inputText.length > MAX_INPUT_LENGTH,
          decodeIdsRaw: result.ids.join(', '),
          decode: { decoded: null, error: null, rejected: [] },
        };
      } catch (err) {
        return {
          ...prev,
          result: null,
          encodeError: err instanceof Error ? err.message : 'Tokenization failed.',
          isTruncated: false,
        };
      }
    });
  }, []);

  const setDecodeIdsRaw = useCallback((raw: string) => {
    setState((prev) => ({ ...prev, decodeIdsRaw: raw }));
  }, []);

  const decodeFromIds = useCallback(() => {
    setState((prev) => {
      const { ids, rejected } = tokenizerService.parseIdInput(prev.decodeIdsRaw);
      if (ids.length === 0) {
        return {
          ...prev,
          decode: {
            decoded: null,
            error: 'No valid token IDs found. Paste a comma- or space-separated list of numbers.',
            rejected,
          },
        };
      }
      try {
        const decoded = tokenizerService.decodeIds(ids);
        return { ...prev, decode: { decoded, error: null, rejected } };
      } catch (err) {
        return {
          ...prev,
          decode: {
            decoded: null,
            error: err instanceof Error ? err.message : 'Decoding failed.',
            rejected,
          },
        };
      }
    });
  }, []);

  const clear = useCallback(() => setState(initialState), []);

  const hasInput = useMemo(() => state.inputText.trim().length > 0, [state.inputText]);

  return {
    ...state,
    hasInput,
    setInputText,
    setMode,
    tokenize,
    setDecodeIdsRaw,
    decodeFromIds,
    clear,
  };
}
