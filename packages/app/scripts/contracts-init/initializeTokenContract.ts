import type { BigNumberish } from 'fuels';
import { bn } from 'fuels';

import type { TokenContractAbi } from '../../src/types/contracts';

const { MINT_AMOUNT } = process.env;

export async function initializeTokenContract(
  tokenContract: TokenContractAbi,
  overrides: { gasPrice: BigNumberish }
) {
  const mintAmount = bn(MINT_AMOUNT || '0x44364C5BB0000');
  const address = {
    value: tokenContract.account!.address.toB256(),
  };

  try {
    process.stdout.write('Initialize Token Contract\n');
    await tokenContract.functions.initialize(mintAmount, address).txParams(overrides).call();
  } catch (err) {
    process.stdout.write('Token Contract already initialized\n');
  }
}
