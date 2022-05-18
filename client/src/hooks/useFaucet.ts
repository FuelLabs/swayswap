import { MutationOptions, useMutation } from 'react-query';
import { useAppContext } from 'src/context/AppContext';
import { sleep } from 'src/lib/utils';

export function useFaucet(opts: MutationOptions = {}) {
  const { faucet } = useAppContext();

  return useMutation(async () => {
    await faucet();
    await sleep(1000);
  }, opts);
}
