import type { BN, Contract } from 'fuels';

import { CONTRACT_ID } from '~/config';
import { getDeadline } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import { getOverrides } from '~/systems/Core/utils/gas';

export enum PoolQueries {
  RemoveLiquidityNetworkFee = 'RemoveLiquidity-networkFee',
  AddLiquidityNetworkFee = 'AddLiquidity-networkFee',
}

export async function prepareRemoveLiquidity(contract: Contract) {
  const deadline = await getDeadline(contract);
  return contract.functions
    .remove_liquidity(1, 1, deadline)
    .callParams({
      forward: [1, CONTRACT_ID],
    })
    .txParams({
      variableOutputs: 2,
      gasLimit: 100_000_000,
    });
}

export async function submitRemoveLiquidity(
  contract: Contract,
  amount: BN,
  txCost: TransactionCost
) {
  const deadline = await getDeadline(contract);
  const { transactionResult } = await contract.functions
    .remove_liquidity(1, 1, deadline)
    .callParams({
      forward: [amount, CONTRACT_ID],
    })
    .txParams(
      getOverrides({
        variableOutputs: 2,
        gasLimit: txCost.total,
      })
    )
    .call();
  return transactionResult;
}
