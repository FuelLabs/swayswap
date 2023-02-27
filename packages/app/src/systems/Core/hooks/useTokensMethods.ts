import { BigNumberish, Wallet } from 'fuels';
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
          console.log('Here');
          const tempWallet = Wallet.fromPrivateKey(
            '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298'
          );
          const tempContract = TokenContractAbi__factory.connect(tokenId, tempWallet);
          const { transactionResult } = await contract.functions
            .mint()
            .txParams(
              getOverrides({
                variableOutputs: 1,
              })
            )
            .call();
          console.log('tx res: ', transactionResult);
          return transactionResult;
        },
      };
    },
    {
      enabled: Boolean(wallet && !isLoading && !isError),
    }
  );

  return { methods, isLoading: isTokenMethodsLoading };
}
