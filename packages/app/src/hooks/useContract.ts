import { useContext } from 'react';

import { AppContext } from '~/context/AppContext';

export const useContract = () => {
  const { contract } = useContext(AppContext)!;
  return contract;
};
