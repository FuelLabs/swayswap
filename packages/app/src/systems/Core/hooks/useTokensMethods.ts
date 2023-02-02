import type { BigNumberish } from 'fuels';
import { useMemo } from 'react';

import { getOverrides } from '../utils/gas';

import { useWallet } from './useWallet';

import { TokenContractAbi__factory } from '~/types/contracts';

export function useTokenMethods(tokenId: string) {
  const { wallet } = useWallet()!;
  const contract = useMemo(
    () => TokenContractAbi__factory.connect(tokenId, wallet!.provider),
    [wallet]
  );

  return {
    contract,
    getBalance() {
      // TODO fix
      return wallet?.getBalance(tokenId);
    },
    queryNetworkFee() {
      return contract.functions.mint().txParams({
        variableOutputs: 1,
      });
    },
    async getMintAmount() {
      const { value: mintAmount } = await contract.functions
        .get_mint_amount()
        .txParams({
          variableOutputs: 1,
        })
        .get();
      return mintAmount;
    },
    async mint(gasLimit: BigNumberish) {
      const { transactionResult } = await contract.functions
        .mint()
        .txParams(
          getOverrides({
            variableOutputs: 1,
            gasLimit,
          })
        )
        .call();
      return transactionResult;
    },
  };
}
