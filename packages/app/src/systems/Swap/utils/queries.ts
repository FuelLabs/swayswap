import type { SwapState } from '../types';
import { ActiveInput } from '../types';

import { COIN_ETH, ZERO } from '~/systems/Core';
import { getGasFee, getOverrides } from '~/systems/Core/utils/gas';
import type { ExchangeContractAbi } from '~/types/contracts';

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

export const queryPreviewAmount = async (
  contract: ExchangeContractAbi,
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
  contract: ExchangeContractAbi,
  { coinFrom, direction, amount }: SwapState,
  gasLimit: bigint
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
    await contract.submit.swap_with_maximum(
      amount,
      DEADLINE,
      getOverrides({
        forward: [forwardAmount.amount, coinFrom.assetId],
        gasLimit,
        variableOutputs: 1,
      })
    );
  } else if (direction === ActiveInput.from && amount) {
    const minValue = await getSwapWithMinimumMinAmount(contract, coinFrom.assetId, amount);
    if (!minValue.has_liquidity) {
      throw new Error('Not enough liquidity on pool');
    }
    await contract.submit.swap_with_minimum(
      minValue.amount,
      DEADLINE,
      getOverrides({
        forward: [amount, coinFrom.assetId],
        gasLimit,
        variableOutputs: 1,
      })
    );
  }
};

export const queryNetworkFee = async (contract: ExchangeContractAbi, direction?: ActiveInput) => {
  const DEADLINE = 1000;
  const directionValue = direction || ActiveInput.from;
  if (directionValue === ActiveInput.to) {
    return getGasFee(
      await contract.simulateResult.swap_with_maximum(1, DEADLINE, {
        forward: [1, COIN_ETH],
        variableOutputs: 1,
      })
    );
  }
  if (directionValue === ActiveInput.from) {
    return getGasFee(
      await contract.simulateResult.swap_with_minimum(1, DEADLINE, {
        forward: [1, COIN_ETH],
        variableOutputs: 1,
      })
    );
  }
  return ZERO;
};
