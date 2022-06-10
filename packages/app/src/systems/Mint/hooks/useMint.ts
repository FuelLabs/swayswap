import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID } from '~/config';
import { useTokenMethods, parseUnits, useBalances } from '~/systems/Core';
import { useTransactionCost } from '~/systems/Core/hooks/useTransactionCost';
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

  const txCost = useTransactionCost(['MintPreview--networkFee', opts.amount], () => {
    const amount = parseUnits(opts.amount || '0').toBigInt();
    return methods.queryNetworkFee(amount);
  });

  const mutation = useMutation(
    async (variables: { amount: string }) => {
      const mintAmount = parseUnits(variables.amount).toBigInt();
      if (!txCost.total) return;
      await methods.mint(mintAmount, txCost.total);
    },
    {
      onSuccess: async () => {
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
