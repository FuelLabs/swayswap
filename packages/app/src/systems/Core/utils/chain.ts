import type { BigNumberish, Contract } from 'fuels';

import { toBigInt } from './math';

import { DEADLINE } from '~/config';

export async function getDeadline(contract: Contract, deadline?: BigNumberish) {
  const blockHeight = await contract.wallet!.provider.getBlockNumber();
  const nexDeadline = blockHeight.add(deadline || toBigInt(DEADLINE));
  return nexDeadline;
}
