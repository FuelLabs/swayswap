import type { CoinQuantity } from 'fuels';
import { format } from 'fuels';

import { TOKENS, ETH } from '../utils';

import { useBalances } from './useBalances';

const ETH_ID = TOKENS.find((item) => item.symbol === ETH.symbol)?.assetId;

export function useEthBalance() {
  const { data: balances } = useBalances();
  const balance = balances?.find((item: CoinQuantity) => item.assetId === ETH_ID)?.amount;

  return {
    raw: balance,
    formatted: balance && format(balance),
  };
}
