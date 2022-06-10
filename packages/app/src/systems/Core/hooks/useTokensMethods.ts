import { useMemo } from 'react';

import { objectId } from '../utils';
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
    async queryNetworkFee(amount: bigint) {
      return contract.prepareCall.mint_and_transfer_coins(amount, objectId(wallet.address), {
        variableOutputs: 1,
      });
    },
    mint(amount: bigint, gasLimit: bigint) {
      return contract.submit.mint_and_transfer_coins(
        amount,
        objectId(wallet.address),
        getOverrides({
          variableOutputs: 1,
          gasLimit,
        })
      );
    },
  };
}
