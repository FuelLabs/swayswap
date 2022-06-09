import toast from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID } from '~/config';
import { useTokenMethods, parseUnits, useBalances, useEthBalance } from '~/systems/Core';
import { Pages } from '~/types';

type UseMintOpts = {
  amount: string;
  tokenId: string;
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts) {
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();
  const balances = useBalances();
  const ethBalance = useEthBalance();

  const { data: txCost } = useQuery(
    ['MintPreview--networkFee', opts.amount, ethBalance.formatted],
    async () => {
      const amount = parseUnits(opts.amount || '0').toBigInt();
      return methods.queryNetworkFee(amount, { variableOutputs: 1 });
    }
  );

  const mutation = useMutation(
    async (variables: { amount: string }) => {
      const mintAmount = parseUnits(variables.amount).toBigInt();
      await methods.mint(mintAmount, {
        gasLimit: txCost?.total,
        variableOutputs: 1,
      });
    },
    {
      onSuccess: async () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        opts.onSuccess?.();
        toast.success(`Token received successfully!`);
        await balances.refetch();
        navigate(Pages.swap);
      },
    }
  );

  function handleMint(amount: string) {
    mutation.mutate({ amount });
  }

  return {
    ...mutation,
    txCost,
    handleMint,
  };
}
