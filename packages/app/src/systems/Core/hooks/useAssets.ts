import type { BN, CoinQuantity } from 'fuels';
import { bn } from 'fuels';
import { useQuery } from 'react-query';

import { TOKENS, ASSET_404 } from '../utils';

import { useWallet } from './useWallet';

import type { Coin } from '~/types';

type AssetAmount = Coin & { amount: BN };
const mergeCoinsWithMetadata = (coins: CoinQuantity[] = []): Array<AssetAmount> =>
  coins.map((coin) => {
    const coinMetadata = TOKENS.find((c) => c.assetId === coin.assetId);
    return {
      // TODO: Create default Coin Metadata when token didn't have registered data
      // Another options could be querying from the contract
      // https://github.com/FuelLabs/swayswap-demo/issues/33
      name: coinMetadata?.name || ASSET_404.name,
      img: coinMetadata?.img || ASSET_404.img,
      pairOf: coinMetadata?.pairOf,
      assetId: coin.assetId,
      amount: bn(coin.amount || 0),
    };
  });

export function useAssets() {
  const { wallet } = useWallet();

  const {
    isLoading,
    data: balances,
    refetch,
  } = useQuery('AssetsPage-balances', () => wallet?.getBalances());

  const coins = mergeCoinsWithMetadata(balances);
  return { coins, refetch, isLoading };
}
