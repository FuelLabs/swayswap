import type { Overrides } from 'fuels';
import { useMemo } from 'react';

import { objectId } from '../utils';
import type { TransactionCost } from '../utils/gas';
import { getOverrides, getTransactionCost } from '../utils/gas';

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
    async queryNetworkFee(
      amount: bigint,
      overrides: Overrides & { from?: string | Promise<string> } = {}
    ): Promise<TransactionCost> {
      return getTransactionCost(
        contract.prepareCall.mint_and_transfer_coins(
          amount,
          objectId(wallet.address),
          getOverrides({
            gasPrice: 0,
            bytePrice: 0,
            ...overrides,
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any
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
