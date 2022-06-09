import { useWallet } from './useWallet';

import { CONTRACT_ID } from '~/config';
import { ExchangeContractAbi__factory } from '~/types/contracts';

export const useContract = () => {
  const wallet = useWallet();
  return wallet && ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
};
