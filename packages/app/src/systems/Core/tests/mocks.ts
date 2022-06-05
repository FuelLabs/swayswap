import type { CoinQuantity } from 'fuels';

import { COIN_ETH, ONE_ASSET } from '../utils';

export const mockBalances = (balances?: CoinQuantity[]) => {
  jest.mock(
    '../../Core/hooks/useBalances.ts',
    () =>
      balances || [
        {
          amount: ONE_ASSET,
          assetId: COIN_ETH,
        },
      ]
  );

  return () => jest.unmock('../../Core/hooks/useBalances.ts');
};
