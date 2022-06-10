import type { Contract } from 'fuels';

import { CONTRACT_ID, DEADLINE } from '~/config';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { getOverrides } from '~/systems/Core/utils/gas';

export enum PoolQueries {
  RemoveLiquidityNetworkFee = 'RemoveLiquidity-networkFee',
}

export function prepareRemoveLiquidity(contract: Contract) {
  return contract.prepareCall.remove_liquidity(1, 1, DEADLINE, {
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
  return contract.submit.remove_liquidity(
    1,
    1,
    DEADLINE,
    getOverrides({
      forward: [amount, CONTRACT_ID],
      variableOutputs: 2,
      gasLimit: txCost.total,
    })
  );
}
