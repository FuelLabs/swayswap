import { SwapDirection } from '../types';
import type { SwapMachineContext } from '../types';

import { safeBigInt, getDeadline } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import type { ExchangeContractAbi } from '~/types/contracts';

const DEADLINE = 1000;

export const queryNetworkFeeOnSwap = async (params: SwapMachineContext) => {
  const { direction, contract, coinFrom } = params;
  if (!contract || !coinFrom) {
    throw new Error('Contract not found');
  }

  const directionValue = direction || SwapDirection.fromTo;
  if (directionValue === SwapDirection.toFrom) {
    return contract.prepareCall.swap_with_maximum(1, DEADLINE, {
      forward: [1, coinFrom.assetId],
      variableOutputs: 2,
      gasLimit: 1000000,
    });
  }
  return contract.prepareCall.swap_with_minimum(1, DEADLINE, {
    forward: [1, coinFrom.assetId],
    variableOutputs: 2,
    gasLimit: 1000000,
  });
};

const getSwapWithMaximumRequiredAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const requiredAmount = await contract.dryRun.get_swap_with_maximum(amount, {
    forward: [0, assetId],
  });
  return requiredAmount;
};

const getSwapWithMinimumMinAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const minAmount = await contract.dryRun.get_swap_with_minimum(amount, {
    forward: [0, assetId],
  });
  return minAmount;
};

export const queryPreviewAmount = async (params: SwapMachineContext) => {
  const { coinFrom: coin, fromAmount, toAmount, contract, direction } = params;

  if (!coin || !contract) return;
  const coinId = coin.assetId;
  const isFrom = direction === SwapDirection.fromTo;
  const amount = isFrom ? fromAmount : toAmount;

  if (direction === SwapDirection.toFrom) {
    return getSwapWithMaximumRequiredAmount(contract, coinId, safeBigInt(amount?.raw));
  }
  if (direction === SwapDirection.fromTo) {
    return getSwapWithMinimumMinAmount(contract, coinId, safeBigInt(amount?.raw));
  }
};

export const swapTokens = async (params: SwapMachineContext) => {
  const {
    contract,
    coinFrom,
    coinTo,
    fromAmount,
    toAmount,
    direction,
    txCost,
    amountLessSlippage,
    amountPlusSlippage,
  } = params;

  if (!contract || !coinFrom || !coinTo || !toAmount || !fromAmount || !txCost?.total) {
    throw new Error('Missing some parameters');
  }

  const deadline = await getDeadline(contract);

  if (direction === SwapDirection.fromTo) {
    return contract.submit.swap_with_minimum(
      safeBigInt(amountLessSlippage?.raw),
      deadline,
      getOverrides({
        forward: [fromAmount.raw, coinFrom.assetId],
        gasLimit: txCost.total,
        variableOutputs: 2,
      })
    );
  }

  return contract.submit.swap_with_maximum(
    toAmount.raw,
    deadline,
    getOverrides({
      forward: [safeBigInt(amountPlusSlippage?.raw), coinFrom.assetId],
      gasLimit: txCost.total,
      variableOutputs: 2,
    })
  );
};
