import { useBalances } from './useBalances';

import { DECIMAL_UNITS } from '~/config';
import CoinsMetadata from '~/lib/CoinsMetadata';
import { parseToFormattedNumber } from '~/lib/math';

const ETH_ID = CoinsMetadata.find((item) => item.symbol === 'ETH')?.assetId;

export function useEthBalance() {
  const { data: balances } = useBalances();
  const balance = balances?.find((item) => item.assetId === ETH_ID)?.amount;
  return {
    raw: balance,
    formatted: balance && parseToFormattedNumber(balance, DECIMAL_UNITS),
  };
}
