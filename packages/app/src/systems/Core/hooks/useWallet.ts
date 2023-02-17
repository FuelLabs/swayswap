import { useQuery } from 'react-query';

import { useFuel } from './useFuel';

export const useWallet = () => {
  const fuel = useFuel();

  const {
    data: wallet,
    isLoading,
    isError,
  } = useQuery(
    ['wallet'],
    async () => {
      const isConnected = await fuel?.isConnected();
      if (!isConnected) {
        await fuel?.connect();
      }
      const currentAccount = await fuel!.currentAccount();
      const currentWallet = (await fuel?.getWallet(currentAccount))!;
      return currentWallet;
    },
    {
      enabled: !!fuel,
    }
  );

  return { wallet, isLoading, isError };
};
