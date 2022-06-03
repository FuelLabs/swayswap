import { useContext } from 'react';

import { AppContext } from '../context';

export const useWallet = () => {
  const { wallet } = useContext(AppContext)!;
  return wallet;
};
