import type { ScriptTransactionRequest } from 'fuels';

import type { SwapMachineContext } from '../types';
import { SwapDirection } from '../types';

import { COIN_ETH, ZERO } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import type { ExchangeContractAbi } from '~/types/contracts';

export const queryNetworkFeeOnSwap = async (
  contract: ExchangeContractAbi,
  direction?: SwapDirection
): Promise<ScriptTransactionRequest> => {
  const DEADLINE = 1000;
  const directionValue = direction || SwapDirection.fromTo;
  if (directionValue === SwapDirection.toFrom) {
    return contract.prepareCall.swap_with_maximum(1, DEADLINE, {
      forward: [1, COIN_ETH],
      variableOutputs: 1,
      gasLimit: 1000000,
    });
  }
  return contract.prepareCall.swap_with_minimum(1, DEADLINE, {
    forward: [1, COIN_ETH],
    variableOutputs: 1,
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
    return getSwapWithMaximumRequiredAmount(contract, coinId, amount?.raw || ZERO);
  }
  if (direction === SwapDirection.fromTo) {
    return getSwapWithMinimumMinAmount(contract, coinId, amount?.raw || ZERO);
  }
};

const DEADLINE = 1000;
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
  if (!contract || !coinFrom || !coinTo || !toAmount) {
    throw new Error('Missing some parameters');
  }

  if (direction === SwapDirection.fromTo && fromAmount && toAmount) {
    return contract.submit.swap_with_minimum(
      amountLessSlippage?.raw || ZERO,
      DEADLINE,
      getOverrides({
        forward: [fromAmount.raw, coinFrom.assetId],
        gasLimit: txCost?.total,
        variableOutputs: 1,
      })
    );
  }

  return contract.submit.swap_with_maximum(
    toAmount.raw,
    DEADLINE,
    getOverrides({
      forward: [amountPlusSlippage?.raw || ZERO, coinFrom.assetId],
      gasLimit: txCost?.total,
      variableOutputs: 1,
    })
  );
};
