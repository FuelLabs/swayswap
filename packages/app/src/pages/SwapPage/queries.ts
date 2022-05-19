import type { SwapState } from './types';
import { ActiveInput } from './types';

import type { ExchangeContractAbi } from '~/types/contracts';

const getSwapWithMaximumRequiredAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const requiredAmount = await contract.callStatic.get_swap_with_maximum(amount, {
    forward: [0, assetId],
  });
  return requiredAmount;
};

const getSwapWithMinimumMinAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: bigint
) => {
  const minAmount = await contract.callStatic.get_swap_with_minimum(amount, {
    forward: [0, assetId],
  });
  return minAmount;
};

export const queryPreviewAmount = async (
  contract: ExchangeContractAbi,
  { amount, direction, from }: SwapState
) => {
  if (direction === ActiveInput.to && amount) {
    const previewAmount = await getSwapWithMaximumRequiredAmount(contract, from, amount);
    return previewAmount;
  }
  if (amount) {
    const previewAmount = await getSwapWithMinimumMinAmount(contract, from, amount);
    return previewAmount;
  }
  return null;
};

export const swapTokens = async (
  contract: ExchangeContractAbi,
  { from, direction, amount }: SwapState
) => {
  const DEADLINE = 1000;
  if (direction === ActiveInput.to && amount) {
    const forwardAmount = await getSwapWithMaximumRequiredAmount(contract, from, amount);
    if (!forwardAmount.has_liquidity) {
      throw new Error('Not enough liquidity on pool');
    }
    await contract.functions.swap_with_maximum(amount, DEADLINE, {
      forward: [forwardAmount.amount, from],
      variableOutputs: 1,
    });
  } else if (direction === ActiveInput.from && amount) {
    const minValue = await getSwapWithMinimumMinAmount(contract, from, amount);
    if (!minValue.has_liquidity) {
      throw new Error('Not enough liquidity on pool');
    }
    await contract.functions.swap_with_minimum(minValue.amount, DEADLINE, {
      forward: [amount, from],
      variableOutputs: 1,
    });
  }
};
