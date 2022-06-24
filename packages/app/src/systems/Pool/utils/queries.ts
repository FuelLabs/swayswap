import type { Contract } from 'fuels';

import { CONTRACT_ID } from '~/config';
import { getDeadline } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { getOverrides } from '~/systems/Core/utils/gas';

export enum PoolQueries {
  RemoveLiquidityNetworkFee = 'RemoveLiquidity-networkFee',
}

export async function prepareRemoveLiquidity(contract: Contract) {
  const deadline = await getDeadline(contract);
  return contract.prepareCall.remove_liquidity(1, 1, deadline, {
    forward: [1, CONTRACT_ID],
    variableOutputs: 2,
    gasLimit: 100_000_000,
  });
}

export async function submitRemoveLiquidity(
  contract: Contract,
  amount: bigint,
  txCost: TransactionCost
) {
  const deadline = await getDeadline(contract);
  return contract.submitResult.remove_liquidity(
    1,
    1,
    deadline,
    getOverrides({
      forward: [amount, CONTRACT_ID],
      variableOutputs: 2,
      gasLimit: txCost.total,
    })
  );
}
