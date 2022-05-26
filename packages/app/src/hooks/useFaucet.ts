import toast from 'react-hot-toast';
import { useQueryClient, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { ENABLE_FAUCET_API } from '~/config';
import { useAppContext } from '~/context/AppContext';
import { sleep } from '~/lib/utils';
import { Pages } from '~/types/pages';

type UseFaucetOpts = {
  onSuccess?: () => void;
};

export function useFaucet(opts: UseFaucetOpts = {}) {
  const { faucet } = useAppContext();
  const client = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    async () => {
      await faucet();
      await sleep(1000);
    },
    {
      ...opts,
      onSuccess() {
        opts.onSuccess?.();
        toast.success('Faucet added successfully!');
        client.refetchQueries(['AssetsPage-balances']);
      },
    }
  );

  function handleFaucet() {
    if (ENABLE_FAUCET_API) {
      navigate(Pages.faucet);
      return;
    }
    mutation.mutate();
  }

  return {
    ...mutation,
    handleFaucet,
  };
}
