import { useWallet } from 'src/context/AppContext';
import { CoinQuantity, toBigInt } from 'fuels';
import { Coin } from 'src/types';
import CoinsMetadata from 'src/lib/CoinsMetadata';
import { useQuery } from 'react-query';
import urljoin from 'url-join';

const { PUBLIC_URL } = process.env;

type Asset = Coin & { amount: bigint };
const mergeCoinsWithMetadata = (coins: CoinQuantity[] = []): Array<Asset> => {
  return coins.map((coin) => {
    const coinMetadata = CoinsMetadata.find((c) => c.assetId === coin.assetId);
    return {
      // TODO: Create default Coin Metadata when token didn't have registered data
      // Another options could be querying from the contract
      // https://github.com/FuelLabs/swayswap-demo/issues/33
      name: coinMetadata?.name || '404',
      img: urljoin(PUBLIC_URL, coinMetadata?.img || '/icons/other.svg'),
      assetId: coin.assetId,
      amount: toBigInt(coin.amount || 0),
    };
  });
};

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
