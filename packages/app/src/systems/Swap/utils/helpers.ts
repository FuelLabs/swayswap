import type { CoinQuantity } from 'fuels';

import type { SwapInfo, SwapState } from '../types';
import { ActiveInput, ValidationStateEnum } from '../types';

import { COIN_ETH } from '~/systems/Core/utils/constants';
import {
  ZERO,
  toNumber,
  isSwayInfinity,
  divideFnValidOnly,
  multiplyFn,
} from '~/systems/Core/utils/math';
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

  if (direction === ActiveInput.from) {
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
  direction: ActiveInput
) => {
  let total = 0;
  if (direction === ActiveInput.from) {
    total = multiplyFn(amount, 1 - slippage);
  } else {
    total = multiplyFn(amount, 1 + slippage);
  }
  return BigInt(Math.trunc(total));
};

type StateParams = {
  swapState: SwapState | null;
  previewAmount: bigint | null;
  hasLiquidity: boolean;
  slippage: number;
  balances?: CoinQuantity[];
};

export const getValidationText = (state: ValidationStateEnum, swapState: SwapState | null) => {
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
    default:
      return 'Swap';
  }
};

export const hasBalanceWithSlippage = ({
  swapState,
  previewAmount,
  slippage,
  balances,
}: StateParams) => {
  if (swapState!.direction === ActiveInput.to) {
    const amountWithSlippage = calculatePriceWithSlippage(
      previewAmount || ZERO,
      slippage,
      swapState!.direction
    );
    const currentBalance = toNumber(
      balances?.find((coin) => coin.assetId === swapState!.coinFrom.assetId)?.amount || ZERO
    );
    return amountWithSlippage > currentBalance;
  }
  return false;
};

export const getValidationState = (stateParams: StateParams): ValidationStateEnum => {
  const { swapState, previewAmount, hasLiquidity } = stateParams;
  if (!swapState?.coinFrom || !swapState?.coinTo) {
    return ValidationStateEnum.SelectToken;
  }
  if (!swapState?.amount) {
    return ValidationStateEnum.EnterAmount;
  }
  if (!previewAmount) {
    return ValidationStateEnum.InsufficientLiquidity;
  }
  if (!swapState.hasBalance || hasBalanceWithSlippage(stateParams)) {
    return ValidationStateEnum.InsufficientBalance;
  }
  if (!hasLiquidity || isSwayInfinity(previewAmount))
    return ValidationStateEnum.InsufficientLiquidity;
  return ValidationStateEnum.Swap;
};

// If amount desired is bigger then
// the reserves return
export const hasReserveAmount = (swapState?: SwapState | null, poolInfo?: PoolInfo) => {
  if (swapState?.direction === ActiveInput.to) {
    if (swapState.coinTo.assetId === COIN_ETH) {
      return (swapState.amount || 0) < (poolInfo?.eth_reserve || 0);
    }
    return (swapState.amount || 0) < (poolInfo?.token_reserve || 0);
  }
  return true;
};
