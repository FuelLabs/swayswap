import { TOKENS } from '../utils';

export interface UseCoinMetadata {
  symbol?: string;
}

export function useCoinMetadata({ symbol }: UseCoinMetadata) {
  return {
    coinMetaData: TOKENS.find((c) => c.symbol === symbol),
  };
}
