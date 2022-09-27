import { bn, BN } from 'fuels';
import { NativeAssetId } from 'fuels';

import { SwapDirection } from '../types';
import type { SwapMachineContext } from '../types';

import { getDeadline, ZERO } from '~/systems/Core';
import { getOverrides } from '~/systems/Core/utils/gas';
import type { ExchangeContractAbi } from '~/types/contracts';
import type { PreviewInfoOutput } from '~/types/contracts/ExchangeContractAbi';

export const queryNetworkFeeOnSwap = async (params: SwapMachineContext) => {
  const { direction, contract, coinFrom } = params;
  if (!contract || !coinFrom) {
    throw new Error('Contract not found');
  }

  const deadline = await getDeadline(contract);
  const directionValue = direction || SwapDirection.fromTo;

  if (directionValue === SwapDirection.toFrom) {
    return contract.functions
      .swap_with_maximum(1, deadline)
      .callParams({
        forward: [2, NativeAssetId],
      })
      .txParams({
        variableOutputs: 2,
        gasLimit: 1000000,
      });
  }
  return contract.functions
    .swap_with_minimum(1, deadline)
    .callParams({
      forward: [2, NativeAssetId],
    })
    .txParams({
      variableOutputs: 2,
      gasLimit: 1000000,
    });
};

const getSwapWithMaximumRequiredAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BN
) => {
  const { value: requiredAmount } = await contract.functions
    .get_swap_with_maximum(amount)
    .callParams({
      forward: [0, assetId],
    })
    .txParams({
      gasPrice: ZERO,
    })
    .get();
  return requiredAmount;
};

const getSwapWithMinimumMinAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BN
) => {
  const { value: minAmount } = await contract.functions
    .get_swap_with_minimum(amount)
    .callParams({
      forward: [0, assetId],
    })
    .txParams({
      gasPrice: ZERO,
    })
    .get();
  return minAmount;
};

export const queryPreviewAmount = async (
  params: SwapMachineContext
): Promise<PreviewInfoOutput | undefined> => {
  const { coinFrom: coin, fromAmount, toAmount, contract, direction } = params;

  if (!coin || !contract) return;
  const coinId = coin.assetId;
  const isFrom = direction === SwapDirection.fromTo;
  const amount = isFrom ? fromAmount : toAmount;

  if (direction === SwapDirection.toFrom) {
    return getSwapWithMaximumRequiredAmount(contract, coinId, bn(amount?.raw));
  }
  if (direction === SwapDirection.fromTo) {
    return getSwapWithMinimumMinAmount(contract, coinId, bn(amount?.raw));
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
    const { transactionResult } = await contract.functions
      .swap_with_minimum(bn(amountLessSlippage?.raw), deadline)
      .callParams({
        forward: [fromAmount.raw, coinFrom.assetId],
      })
      .txParams(
        getOverrides({
          gasLimit: txCost.total,
          variableOutputs: 2,
        })
      )
      .call();
    return transactionResult;
  }

  const { transactionResult } = await contract.functions
    .swap_with_maximum(toAmount.raw, deadline)
    .callParams({
      forward: [bn(amountPlusSlippage?.raw), coinFrom.assetId],
    })
    .txParams(
      getOverrides({
        gasLimit: txCost.total,
        variableOutputs: 2,
      })
    )
    .call();
  return transactionResult;
};
