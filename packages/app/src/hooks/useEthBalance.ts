import { formatUnits } from 'ethers/lib/utils';

import { useBalances } from './useBalances';

import { DECIMAL_UNITS } from '~/config';
import CoinsMetadata from '~/lib/CoinsMetadata';

const ETH_ID = CoinsMetadata.find((item) => item.symbol === 'ETH')?.assetId;

export function useEthBalance() {
  const { data: balances } = useBalances();
  const balance = balances?.find((item) => item.assetId === ETH_ID)?.amount;
  return {
    raw: balance,
    formatted: balance && formatUnits(balance, DECIMAL_UNITS),
  };
}
