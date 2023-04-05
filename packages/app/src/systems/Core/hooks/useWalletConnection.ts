import { useQuery } from 'react-query';

import { useFuel } from './useFuel';

export function useWalletConnection() {
  const { fuel } = useFuel();
  const {
    data: isConnected,
    isLoading: isConnectedLoading,
    isError: isConnectedError,
  } = useQuery(
    ['connected'],
    async () => {
      const isFuelConnected = await fuel!.isConnected();
      return isFuelConnected;
    },
    {
      enabled: !!fuel,
      initialData: false,
      refetchInterval: 1000,
    }
  );
  return {
    isConnected,
    isConnectedLoading,
    isConnectedError,
  };
}
