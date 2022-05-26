import type { SwapState } from './types';
import { ActiveInput } from './types';

import type { Exchange_contractAbi } from '~/types/contracts';

const getSwapWithMaximumRequiredAmount = async (
  contract: Exchange_contractAbi,
  assetId: string,
  amount: bigint
) => {
  const requiredAmount = await contract.callStatic.get_swap_with_maximum(amount, {
    forward: [0, assetId],
  });
  return requiredAmount;
};

const getSwapWithMinimumMinAmount = async (
  contract: Exchange_contractAbi,
  assetId: string,
  amount: bigint
) => {
  const minAmount = await contract.callStatic.get_swap_with_minimum(amount, {
    forward: [0, assetId],
  });
  return minAmount;
};

export const queryPreviewAmount = async (
  contract: Exchange_contractAbi,
  { amount, direction, coinFrom }: SwapState
) => {
  if (direction === ActiveInput.to && amount) {
    const previewAmount = await getSwapWithMaximumRequiredAmount(
      contract,
      coinFrom.assetId,
      amount
    );
    return previewAmount;
  }
  if (amount) {
    const previewAmount = await getSwapWithMinimumMinAmount(contract, coinFrom.assetId, amount);
    return previewAmount;
  }
  return null;
};

export const swapTokens = async (
  contract: Exchange_contractAbi,
  { coinFrom, direction, amount }: SwapState
) => {
  const DEADLINE = 1000;
  if (direction === ActiveInput.to && amount) {
    const forwardAmount = await getSwapWithMaximumRequiredAmount(
      contract,
      coinFrom.assetId,
      amount
    );
    if (!forwardAmount.has_liquidity) {
      throw new Error('Not enough liquidity on pool');
    }
    await contract.functions.swap_with_maximum(amount, DEADLINE, {
      forward: [forwardAmount.amount, coinFrom.assetId],
      variableOutputs: 1,
    });
  } else if (direction === ActiveInput.from && amount) {
    const minValue = await getSwapWithMinimumMinAmount(contract, coinFrom.assetId, amount);
    if (!minValue.has_liquidity) {
      throw new Error('Not enough liquidity on pool');
    }
    await contract.functions.swap_with_minimum(minValue.amount, DEADLINE, {
      forward: [amount, coinFrom.assetId],
      variableOutputs: 1,
    });
  }
};
