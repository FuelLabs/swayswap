import { useMemo } from 'react';

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
    async queryNetworkFee() {
      return contract.prepareCall.mint({
        variableOutputs: 1,
      });
    },
    async getMintAmount() {
      return contract.dryRun.get_mint_amount();
    },
    mint(gasLimit: bigint) {
      return contract.submit.mint(
        getOverrides({
          variableOutputs: 1,
          gasLimit,
        })
      );
    },
  };
}
