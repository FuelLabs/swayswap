import { useMemo } from 'react';

import { COIN_ETH } from '../utils/constants';
import { getOverrides } from '../utils/gas';

import { useWallet } from './useWallet';

import { TokenContractAbi__factory } from '~/types/contracts';

export function useTokenMethods(tokenId: string) {
  const wallet = useWallet()!;
  const contract = useMemo(
    () => TokenContractAbi__factory.connect(tokenId, wallet),
    [wallet.address]
  );

  return {
    contract,
    getBalance() {
      return wallet?.getBalance(tokenId);
    },
    queryNetworkFee() {
      return contract.prepareCall.mint({
        forward: [1, COIN_ETH],
        variableOutputs: 2,
      });
    },
    async getMintAmount() {
      return contract.dryRun.get_mint_amount();
    },
    async mint(gasLimit: bigint) {
      return contract.submitResult.mint(
        getOverrides({
          variableOutputs: 2,
          gasLimit,
        })
      );
    },
  };
}
