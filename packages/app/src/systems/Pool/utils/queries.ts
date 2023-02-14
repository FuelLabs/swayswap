import type { BN, Contract } from 'fuels';

import type { AddLiquidityMachineContext } from '../types';

import { CONTRACT_ID } from '~/config';
import { getDeadline } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import type { Coin } from '~/types';
import type { ExchangeContractAbi } from '~/types/contracts';

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

export async function submitRemoveLiquidity(contract: Contract, amount: BN) {
  const deadline = await getDeadline(contract);
  const { transactionResult } = await contract.functions
    .remove_liquidity(1, 1, deadline)
    .callParams({
      forward: [amount, CONTRACT_ID],
    })
    .txParams(
      getOverrides({
        variableOutputs: 2,
      })
    )
    .call();
  console.log('tx res: ', transactionResult);
  return transactionResult;
}

export async function addLiquidity(
  contract: ExchangeContractAbi,
  fromAmount: BN,
  toAmount: BN,
  fromAsset: Coin,
  toAsset: Coin,
  gasLimit?: BN
) {
  const deadline = await getDeadline(contract);
  return contract
    .multiCall([
      contract.functions.deposit().callParams({
        forward: [fromAmount, fromAsset.assetId],
      }),
      contract.functions.deposit().callParams({
        forward: [toAmount, toAsset.assetId],
      }),
      contract.functions.add_liquidity(1, deadline),
    ])
    .txParams(
      getOverrides({
        variableOutputs: 2,
        gasLimit,
      })
    );
}

export async function fetchPoolInfo(ctx: AddLiquidityMachineContext) {
  const { contract } = ctx;
  if (!contract) return null;
  const { value } = await contract.functions.get_pool_info().get();
  return value;
}
