import { Overrides } from 'fuels';
import { useMemo } from 'react';
import { useWallet } from 'src/context/AppContext';
import { TokenContractAbi__factory } from 'src/types/contracts';
import { objectId } from '../lib/utils';

export function useTokenMethods(tokenId: string) {
  const wallet = useWallet()!;
  const contract = useMemo(
    () => TokenContractAbi__factory.connect(tokenId, wallet),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet.address]
  );

  return {
    contract,
    getBalance() {
      return wallet.getBalance(tokenId);
    },
    mint(amount: bigint) {
      return contract.functions.mint_coins(amount);
    },
    transferTo(amount: bigint, overrides: Overrides & { from?: string | Promise<string> } = {}) {
      return contract.functions.transfer_coins_to_output(
        amount,
        objectId(contract.id),
        objectId(wallet.address),
        overrides
      );
    },
  };
}
