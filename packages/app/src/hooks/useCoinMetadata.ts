import CoinsMetadata from '~/lib/CoinsMetadata';

export interface UseCoinMetadata {
  symbol?: string;
}

export function useCoinMetadata({ symbol }: UseCoinMetadata) {
  return {
    coinMetaData: CoinsMetadata.find((c) => c.symbol === symbol),
  };
}
