import type { CoinQuantity } from 'fuels';
import { toBigInt } from 'fuels';
import { useQuery } from 'react-query';

import { useWallet } from '~/hooks/useWallet';
import CoinsMetadata, { ASSET_404 } from '~/lib/CoinsMetadata';
import type { Coin } from '~/types';

type Asset = Coin & { amount: bigint };
const mergeCoinsWithMetadata = (coins: CoinQuantity[] = []): Array<Asset> =>
  coins.map((coin) => {
    const coinMetadata = CoinsMetadata.find((c) => c.assetId === coin.assetId);
    return {
      // TODO: Create default Coin Metadata when token didn't have registered data
      // Another options could be querying from the contract
      // https://github.com/FuelLabs/swayswap-demo/issues/33
      name: coinMetadata?.name || ASSET_404.name,
      img: coinMetadata?.img || ASSET_404.img,
      pairOf: coinMetadata?.pairOf,
      assetId: coin.assetId,
      amount: toBigInt(coin.amount || 0),
    };
  });

export function useAssets() {
  const wallet = useWallet();

  const {
    isLoading,
    data: balances,
    refetch,
  } = useQuery('AssetsPage-balances', () => wallet?.getBalances());

  const coins = mergeCoinsWithMetadata(balances);
  return { coins, refetch, isLoading };
}
