import { useQuery, UseQueryOptions } from 'react-query';
import { useWallet } from 'src/context/AppContext';

export function useBalances(opts: UseQueryOptions = {}) {
  const wallet = useWallet();
  return useQuery('AssetsPage-balances', () => wallet!.getBalances(), opts as any);
}
