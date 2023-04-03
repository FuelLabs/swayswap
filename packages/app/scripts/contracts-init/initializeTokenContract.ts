import type { BigNumberish } from 'fuels';
import { bn } from 'fuels';

import type { TokenContractAbi } from '../../src/types/contracts';

export async function initializeTokenContract(
  tokenContract: TokenContractAbi,
  overrides: { gasPrice: BigNumberish },
  mintAmount: string
) {
  const address = {
    value: tokenContract.account!.address.toB256(),
  };

  try {
    process.stdout.write('Initialize Token Contract\n');
    await tokenContract.functions
      .initialize(bn.parseUnits(mintAmount), address)
      .txParams(overrides)
      .call();
  } catch (err) {
    console.log(err);
    process.stdout.write('Token Contract already initialized\n');
  }
}
