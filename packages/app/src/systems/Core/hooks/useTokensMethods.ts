import type { Overrides } from 'fuels';
import { useMemo } from 'react';

import { objectId } from '../utils';
import { getGasFee, getOverrides } from '../utils/gas';

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
    async mintGasFee(
      amount: bigint,
      overrides: Overrides & { from?: string | Promise<string> } = {}
    ) {
      return getGasFee(
        await contract.simulateResult.mint_and_transfer_coins(
          amount,
          objectId(wallet.address),
          getOverrides(overrides)
        )
      );
    },
    mint(amount: bigint, overrides: Overrides & { from?: string | Promise<string> } = {}) {
      return contract.submit.mint_and_transfer_coins(
        amount,
        objectId(wallet.address),
        getOverrides(overrides)
      );
    },
  };
}
