import type { CoinQuantity } from 'fuels';

import type { SwapInfo, SwapState } from '../types';
import { SwapDirection, ValidationStateEnum } from '../types';

import { COIN_ETH } from '~/systems/Core/utils/constants';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import {
  ZERO,
  toNumber,
  isSwayInfinity,
  divideFnValidOnly,
  multiplyFn,
} from '~/systems/Core/utils/math';
import type { Maybe } from '~/types';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export function getPriceImpact(
  outputAmount: bigint,
  inputAmount: bigint,
  reserveInput: bigint,
  reserveOutput: bigint
) {
  const exchangeRateAfter = divideFnValidOnly(inputAmount, outputAmount);
  const exchangeRateBefore = divideFnValidOnly(reserveInput, reserveOutput);
  const result = (exchangeRateAfter / exchangeRateBefore - 1) * 100;
  return result > 100 ? 100 : result.toFixed(2);
}

export const calculatePriceImpact = ({
  direction,
  amount,
  coinFrom,
  previewAmount,
  token_reserve,
  eth_reserve,
}: SwapInfo) => {
  // If any value is 0 return 0
  if (!previewAmount || !amount || !token_reserve || !eth_reserve) return '0';

  if (direction === SwapDirection.fromTo) {
    if (coinFrom?.assetId !== COIN_ETH) {
      return getPriceImpact(previewAmount, amount, token_reserve, eth_reserve);
    }
    return getPriceImpact(previewAmount, amount, eth_reserve, token_reserve);
  }
  if (coinFrom?.assetId !== COIN_ETH) {
    return getPriceImpact(amount, previewAmount, token_reserve, eth_reserve);
  }
  return getPriceImpact(amount, previewAmount, eth_reserve, token_reserve);
};

export const calculatePriceWithSlippage = (
  amount: bigint,
  slippage: number,
  direction: SwapDirection
) => {
  let total = 0;
  if (direction === SwapDirection.fromTo) {
    total = multiplyFn(amount, 1 - slippage);
  } else {
    total = multiplyFn(amount, 1 + slippage);
  }
  return BigInt(Math.trunc(total));
};

type StateParams = {
  swapState: Maybe<SwapState>;
  previewAmount: Maybe<bigint>;
  hasLiquidity: boolean;
  slippage: number;
  balances?: CoinQuantity[];
  txCost?: TransactionCost;
};

export const getValidationText = (state: ValidationStateEnum, swapState: Maybe<SwapState>) => {
  switch (state) {
    case ValidationStateEnum.SelectToken:
      return 'Select token';
    case ValidationStateEnum.EnterAmount:
      return 'Enter amount';
    case ValidationStateEnum.InsufficientBalance:
      return `Insufficient ${swapState?.coinFrom.symbol || ''} balance`;
    case ValidationStateEnum.InsufficientAmount:
      return `Insufficient amount to swap`;
    case ValidationStateEnum.InsufficientLiquidity:
      return 'Insufficient liquidity';
    case ValidationStateEnum.InsufficientFeeBalance:
      return 'Insufficient ETH for gas';
    default:
      return 'Swap';
  }
};

export const notHasBalanceWithSlippage = ({
  swapState,
  previewAmount,
  slippage,
  balances,
  txCost,
}: StateParams) => {
  if (swapState!.direction === SwapDirection.toFrom) {
    let amountWithSlippage = calculatePriceWithSlippage(
      previewAmount || ZERO,
      slippage,
      swapState!.direction
    );
    const currentBalance = toNumber(
      balances?.find((coin) => coin.assetId === swapState!.coinFrom.assetId)?.amount || ZERO
    );

    if (swapState!.coinFrom.assetId === COIN_ETH) {
      amountWithSlippage += txCost?.total || ZERO;
    }

    return amountWithSlippage > currentBalance;
  }
  return false;
};

const hasEthForNetworkFee = ({ balances, txCost }: StateParams) => {
  const currentBalance = toNumber(
    balances?.find((coin) => coin.assetId === COIN_ETH)?.amount || ZERO
  );
  return currentBalance > (txCost?.total || ZERO);
};

export const getValidationState = (stateParams: StateParams): ValidationStateEnum => {
  const { swapState, previewAmount, hasLiquidity } = stateParams;
  if (!swapState?.coinFrom || !swapState?.coinTo) {
    return ValidationStateEnum.SelectToken;
  }
  if (!swapState?.amount) {
    return ValidationStateEnum.EnterAmount;
  }
  if (!swapState.hasBalance || notHasBalanceWithSlippage(stateParams)) {
    return ValidationStateEnum.InsufficientBalance;
  }
  if (!previewAmount) {
    return ValidationStateEnum.InsufficientLiquidity;
  }
  if (!hasLiquidity || isSwayInfinity(previewAmount)) {
    return ValidationStateEnum.InsufficientLiquidity;
  }
  if (!hasEthForNetworkFee(stateParams)) {
    return ValidationStateEnum.InsufficientFeeBalance;
  }
  return ValidationStateEnum.Swap;
};

// If amount desired is bigger then
// the reserves return
export const hasReserveAmount = (swapState?: Maybe<SwapState>, poolInfo?: PoolInfo) => {
  if (swapState?.direction === SwapDirection.toFrom) {
    if (swapState.coinTo.assetId === COIN_ETH) {
      return (swapState.amount || 0) < (poolInfo?.eth_reserve || 0);
    }
    return (swapState.amount || 0) < (poolInfo?.token_reserve || 0);
  }
  return true;
};
