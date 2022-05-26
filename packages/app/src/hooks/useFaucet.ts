import type { MutationOptions } from 'react-query';
import { useQueryClient, useMutation } from 'react-query';

import { useAppContext } from '~/context/AppContext';
import { sleep } from '~/lib/utils';

export function useFaucet(opts: MutationOptions = {}) {
  const { faucet } = useAppContext();
  const client = useQueryClient();

  return useMutation(
    async () => {
      await faucet();
      await sleep(1000);
    },
    {
      ...opts,
      onSuccess(...args) {
        opts.onSuccess?.(...args);
        client.refetchQueries(['AssetsPage-balances']);
      },
    }
  );
}
