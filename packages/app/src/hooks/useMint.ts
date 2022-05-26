import { parseUnits } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useTokenMethods } from './useTokensMethods';

import { DECIMAL_UNITS, TOKEN_ID } from '~/config';
import { sleep } from '~/lib/utils';

export function useMint() {
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();

  return useMutation(
    async (variables: { amount: string }) => {
      const mintAmount = parseUnits(variables.amount, DECIMAL_UNITS).toBigInt();
      await methods.mint(mintAmount);
      await methods.transferTo(mintAmount, { variableOutputs: 1 });
      await sleep(1000);
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        toast.success(`Token minted successfully!`);
        navigate('/swap');
      },
    }
  );
}
