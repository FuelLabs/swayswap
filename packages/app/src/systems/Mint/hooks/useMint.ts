import type { FunctionInvocationScope } from 'fuels';
import { bn } from 'fuels';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TOKEN_ID1, TOKEN_ID2 } from '~/config';
import { useTokenMethods, useBalances } from '~/systems/Core';
import { useTransactionCost } from '~/systems/Core/hooks/useTransactionCost';
import { txFeedback } from '~/systems/Core/utils/feedback';
import { Pages } from '~/types';

type UseMintOpts = {
  onSuccess?: () => void;
};

export function useMint(opts: UseMintOpts = {}) {
  const { methods: tokenMethods1, isLoading: isLoading1 } = useTokenMethods(TOKEN_ID1);
  const { methods: tokenMethods2, isLoading: isLoading2 } = useTokenMethods(TOKEN_ID2);
  const navigate = useNavigate();
  const balances = useBalances();
  const txCost = useTransactionCost(
    ['MintPreview--networkFee'],
    () => tokenMethods1?.queryNetworkFee() as FunctionInvocationScope,
    {
      enabled: Boolean(tokenMethods1 && !isLoading1),
    }
  );

  const { data: mintAmount1 } = useQuery(
    ['MintPreview--mintAmount1'],
    () => {
      return tokenMethods1?.getMintAmount();
    },
    { enabled: Boolean(tokenMethods1 && !isLoading1) }
  );

  const { data: mintAmount2 } = useQuery(
    ['MintPreview--mintAmount2'],
    () => {
      return tokenMethods1?.getMintAmount();
    },
    { enabled: Boolean(tokenMethods2 && !isLoading2) }
  );

  const mutation1 = useMutation(
    async () => {
      if (txCost.total.isZero()) return;
      return tokenMethods1?.mint();
    },
    { onSuccess: txFeedback('Token received successfully!', handleSuccess) }
  );

  const mutation2 = useMutation(
    async () => {
      if (txCost.total.isZero()) return;
      return tokenMethods2?.mint();
    },
    { onSuccess: txFeedback('Token received successfully!', handleSuccess) }
  );

  async function handleSuccess() {
    opts.onSuccess?.();
    await balances.refetch();
    navigate(Pages.swap);
  }

  function handleMint() {
    mutation1.mutate();
    mutation2.mutate();
  }

  return {
    ...mutation1,
    ...mutation2,
    txCost,
    handleMint,
    mintAmount1: bn(mintAmount1),
    mintAmount2: bn(mintAmount2),
  };
}
