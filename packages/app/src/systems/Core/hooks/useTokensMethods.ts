import type { BigNumberish } from 'fuels';
import { useQuery } from 'react-query';

import { getOverrides } from '../utils/gas';

import { useWallet } from './useWallet';

import { TokenContractAbi__factory } from '~/types/contracts';

export function useTokenMethods(tokenId: string) {
  const { wallet, isLoading, isError } = useWallet();

  const { data: methods, isLoading: isTokenMethodsLoading } = useQuery(
    ['TokenMethods', tokenId],
    async () => {
      const contract = TokenContractAbi__factory.connect(tokenId, wallet!);
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
          const { value: mintAmount } = await contract.functions.get_mint_amount().get();
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
    },
    {
      enabled: Boolean(wallet && !isLoading && !isError),
    }
  );

  return { methods, isLoading: isTokenMethodsLoading };

  // const contract = useMemo(() => {
  //   return TokenContractAbi__factory.connect(tokenId, wallet!);
  // }, [wallet]);
}
