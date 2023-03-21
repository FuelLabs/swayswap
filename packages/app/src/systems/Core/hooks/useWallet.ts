import { useQuery } from 'react-query';

import { useFuel } from './useFuel';

export const useWallet = () => {
  const fuel = useFuel();

  const { data: isConnected } = useQuery(
    ['connected'],
    async () => {
      const isFuelConnected = await fuel!.isConnected();
      return isFuelConnected;
    },
    {
      enabled: !!fuel,
    }
  );

  const {
    data: wallet,
    isLoading,
    isError,
  } = useQuery(
    ['wallet'],
    async () => {
      // The wallet should be connected as the user did it in the first step
      // We could add a check to see if the wallet is past the welcome steps
      // and still disconnected
      const currentAccount = await fuel!.currentAccount();
      const currentWallet = (await fuel?.getWallet(currentAccount))!;
      return currentWallet;
    },
    {
      enabled: !!fuel && !!isConnected,
    }
  );

  return { wallet, isLoading, isError };
};
