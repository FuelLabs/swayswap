import toast from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID } from '~/config';
import { refreshBalances, useTokenMethods, parseUnits } from '~/systems/Core';
import { Pages } from '~/types';

type UseMintOpts = {
  amount: string;
  tokenId: string;
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts) {
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();

  const mintPreview = useQuery(['MintPreviewNetwork', opts.amount], async () => {
    const amount = parseUnits(opts.amount || '0').toBigInt();
    return methods.mintGasFee(amount, { variableOutputs: 1 });
  });

  const mutation = useMutation(
    async (variables: { amount: string }) => {
      const mintAmount = parseUnits(variables.amount).toBigInt();
      await methods.mint(mintAmount, {
        gasLimit: mintPreview.data,
        variableOutputs: 1,
      });
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new coins
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        opts.onSuccess?.();
        toast.success(`Token received successfully!`);
        refreshBalances();
        navigate(Pages.swap);
      },
    }
  );

  function handleMint(amount: string) {
    mutation.mutate({ amount });
  }

  return {
    ...mutation,
    networkFee: mintPreview.data,
    handleMint,
  };
}
