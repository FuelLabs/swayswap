import type { Contract } from 'fuels';

import { toBigInt } from './math';

import { DEADLINE } from '~/config';

export async function getDeadline(contract: Contract, deadline?: bigint) {
  const blockHeight = await contract.wallet!.provider.getBlockNumber();
  const nexDeadline = blockHeight + (deadline || toBigInt(DEADLINE));
  return nexDeadline;
}
