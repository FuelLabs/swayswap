import type { CoinQuantity } from 'fuels';

import type { SwapInfo, SwapState } from '../types';
import { SwapDirection, ValidationStateEnum } from '../types';

import { isCoinEth } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import {
  ZERO,
  toNumber,
  isSwayInfinity,
  divideFnValidOnly,
  multiplyFn,
  ONE_ASSET,
  toFixed,
} from '~/systems/Core/utils/math';
import type { Maybe } from '~/types';
import type { PoolInfo } from '~/types/contracts/ExchangeContractAbi';

export function getPricePerToken(fromAmount?: Maybe<bigint>, toAmount?: Maybe<bigint>) {
  if (!toAmount || !fromAmount) return '';
  const ratio = divideFnValidOnly(toAmount, fromAmount);
  const price = ratio * toNumber(ONE_ASSET);
  return toFixed(price / toNumber(ONE_ASSET));
}

function getPriceImpact(amounts: bigint[], reserves: bigint[]) {
  const exchangeRateAfter = divideFnValidOnly(amounts[0], amounts[1]);
  const exchangeRateBefore = divideFnValidOnly(reserves[0], reserves[1]);
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
  const isFrom = direction === SwapDirection.fromTo;
  const isEth = isCoinEth(coinFrom);
  const amounts = isFrom ? [previewAmount, amount] : [amount, previewAmount];
  const reserves = isEth ? [eth_reserve, token_reserve] : [token_reserve, eth_reserve];

  return getPriceImpact(amounts, reserves);
};

export const calculatePriceWithSlippage = (
  amount: bigint,
  slippage: number,
  direction: SwapDirection
) => {
  const isFrom = direction === SwapDirection.fromTo;
  const total = multiplyFn(amount, isFrom ? 1 - slippage : 1 + slippage);
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

    if (isCoinEth(swapState!.coinFrom)) {
      amountWithSlippage += txCost?.total || ZERO;
    }

    return amountWithSlippage > currentBalance;
  }
  return false;
};

const hasEthForNetworkFee = ({ balances, txCost }: StateParams) => {
  const currentBalance = toNumber(balances?.find(isCoinEth)?.amount || ZERO);
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
    if (isCoinEth(swapState.coinTo)) {
      return (swapState.amount || 0) < (poolInfo?.eth_reserve || 0);
    }
    return (swapState.amount || 0) < (poolInfo?.token_reserve || 0);
  }
  return true;
};
