import type { MutationOptions } from 'react-query';
import { useMutation } from 'react-query';

import { useAppContext } from '~/context/AppContext';
import { sleep } from '~/lib/utils';

export function useFaucet(opts: MutationOptions = {}) {
  const { faucet } = useAppContext();

  return useMutation(async () => {
    await faucet();
    await sleep(1000);
  }, opts);
}
