import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID } from '~/config';
import { useTokenMethods, useBalances, ZERO } from '~/systems/Core';
import { useTransactionCost } from '~/systems/Core/hooks/useTransactionCost';
import { txFeedback } from '~/systems/Core/utils/feedback';
import { Pages } from '~/types';

type UseMintOpts = {
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts = {}) {
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();
  const balances = useBalances();
  const txCost = useTransactionCost(['MintPreview--networkFee'], () => methods.queryNetworkFee());
  const { data: mintAmount } = useQuery(['MintPreview--mintAmount'], () => methods.getMintAmount());

  const mutation = useMutation(
    async () => {
      if (!txCost.total) return;
      return methods.mint(txCost.gas);
    },
    { onSuccess: txFeedback('Token received successfully!', handleSuccess) }
  );

  async function handleSuccess() {
    opts.onSuccess?.();
    await balances.refetch();
    navigate(Pages.swap);
  }

  function handleMint() {
    mutation.mutate();
  }

  return {
    ...mutation,
    txCost,
    handleMint,
    mintAmount: mintAmount || ZERO,
  };
}
