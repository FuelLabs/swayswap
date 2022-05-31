import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { refreshBalances } from './useBalances';
import { useTokenMethods } from './useTokensMethods';

import { TOKEN_ID } from '~/config';
import { parseUnits } from '~/lib/math';
import { Pages } from '~/types/pages';

type UseMintOpts = {
  tokenId: string;
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts) {
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();

  const mutation = useMutation(
    async (variables: { amount: string }) => {
      const mintAmount = parseUnits(variables.amount).toBigInt();
      await methods.mint(mintAmount);
      await methods.transferTo(mintAmount, { variableOutputs: 1 });
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        opts.onSuccess?.();
        toast.success(`Token minted successfully!`);
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
    handleMint,
  };
}
