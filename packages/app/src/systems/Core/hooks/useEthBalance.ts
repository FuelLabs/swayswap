import { TOKENS, parseToFormattedNumber } from '../utils';

import { useBalances } from './useBalances';

const ETH_ID = TOKENS.find((item) => item.symbol === 'ETH')?.assetId;

export function useEthBalance() {
  const { data: balances } = useBalances();
  const balance = balances?.find((item) => item.assetId === ETH_ID)?.amount;

  return {
    raw: balance,
    formatted: balance && parseToFormattedNumber(balance),
  };
}
