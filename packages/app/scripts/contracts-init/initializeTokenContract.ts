import type { Overrides } from 'fuels';

import type { TokenContractAbi } from '../../src/types/contracts';

const { MINT_AMOUNT } = process.env;

export async function initializeTokenContract(
  tokenContract: TokenContractAbi,
  overrides: Overrides
) {
  const mintAmount = BigInt(MINT_AMOUNT || '2000000000000');
  const address = {
    value: tokenContract.wallet!.address,
  };

  try {
    process.stdout.write('Initialize Token Contract\n');
    await tokenContract.submit.initialize(mintAmount, address, overrides);
  } catch (err) {
    process.stdout.write('Token Contract already initialized\n');
  }
}
