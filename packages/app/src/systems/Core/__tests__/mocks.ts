import type { CoinQuantity } from 'fuels';

import { useBalances } from '../hooks/useBalances';
import { ONE_ASSET } from '../utils';

export const mockBalances = (balances?: CoinQuantity[]) => {
  (useBalances as jest.Mock).mockImplementation(() => ({
    data: balances || [
      {
        amount: ONE_ASSET,
        assetId: '0x0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
    loading: false,
    refetch: () => undefined,
  }));
};
