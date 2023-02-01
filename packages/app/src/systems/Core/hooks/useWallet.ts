import { useQuery } from 'react-query';

import { useFuel } from './useFuel';

export const useWallet = () => {
  const [fuel] = useFuel();

  const {
    data: wallet,
    isLoading,
    isError,
  } = useQuery(
    ['wallet'],
    async () => {
      const isConnected = await fuel.isConnected();
      if (!isConnected) {
        await fuel.connect();
      }
      const selectedAccount = (await fuel.currentAccount()) as string;
      const selectedWallet = await fuel.getWallet(selectedAccount);
      return selectedWallet;
    },
    {
      enabled: !!fuel,
    }
  );

  return { wallet, isLoading, isError };
};
