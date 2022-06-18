import { useQuery } from 'react-query';

import { getChainConfig } from '../utils/gas';

export function useChainConfig() {
  const { data } = useQuery('ChainConfig', async () => getChainConfig());
  return data;
}
