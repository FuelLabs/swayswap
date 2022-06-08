import type { CoinQuantity } from 'fuels';

import { COIN_ETH, ONE_ASSET } from '../../utils';
import * as useBalances from '../useBalances';

const FAKE_BALANCE = [{ amount: ONE_ASSET, assetId: COIN_ETH }];

export function mockUseBalances(balances?: CoinQuantity[]) {
  const mock = {
    data: balances || FAKE_BALANCE,
    loading: false,
    refetch: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return jest.spyOn(useBalances, 'useBalances').mockImplementation(() => mock);
}
