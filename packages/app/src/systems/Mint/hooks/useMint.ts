import type { FunctionInvocationScope } from 'fuels';
import { bn } from 'fuels';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID } from '~/config';
import { useTokenMethods, useBalances } from '~/systems/Core';
import { useTransactionCost } from '~/systems/Core/hooks/useTransactionCost';
import { txFeedback } from '~/systems/Core/utils/feedback';
import { Pages } from '~/types';

type UseMintOpts = {
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts = {}) {
  const { methods, isLoading } = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();
  const balances = useBalances();
  const txCost = useTransactionCost(
    ['MintPreview--networkFee'],
    () => methods?.queryNetworkFee() as FunctionInvocationScope,
    {
      enabled: Boolean(methods && !isLoading),
    }
  );

  const { data: mintAmount } = useQuery(
    ['MintPreview--mintAmount'],
    () => {
      console.log('in min amount');
      return methods?.getMintAmount();
    },
    { enabled: Boolean(methods && !isLoading) }
  );

  const mutation = useMutation(
    async () => {
      console.log('in mint mutation');
      //if (txCost.total.isZero()) return;
      return methods!.mint(txCost.total);
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
    mintAmount: bn(mintAmount),
  };
}
