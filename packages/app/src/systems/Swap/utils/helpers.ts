import { bn, BN } from 'fuels';

import type { CoinAmount, SwapMachineContext } from '../types';
import { SwapDirection } from '../types';

import { DECIMAL_UNITS } from '~/config';
import { isCoinEth } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
import {
  ZERO,
  toNumber,
  divideFnValidOnly,
  multiplyFn,
  ONE_ASSET,
  toFixed,
  parseInputValueBigInt,
  formatUnits,
  parseToFormattedNumber,
  toBigInt,
  safeBigInt,
} from '~/systems/Core/utils/math';
import type { Coin, Maybe } from '~/types';

export const ZERO_AMOUNT = { value: '', raw: bn(0) };

/**
 * This function returns amounts that are used inside SwapMachine
 *
 * Should return ZERO_AMOUNT if value doesn't exist or is less than zero
 * Should do rightly formatter according to type
 *
 * @param value Maybe<bigint | string>
 * @returns CoinAmount
 */
export function createAmount(value: Maybe<BN | string | number>): CoinAmount {
  if (!value) return ZERO_AMOUNT;
  if (BN.isBN(value) && value.eq(ZERO)) return ZERO_AMOUNT;
  if (typeof value === 'number' && value < 0) return ZERO_AMOUNT;
  if (BN.isBN(value)) {
    return {
      value: formatUnits(value, DECIMAL_UNITS),
      raw: value,
    };
  }
  if (typeof value === 'string') {
    return {
      value,
      raw: parseInputValueBigInt(value),
    };
  }
  if (typeof value === 'number') {
    return {
      value: parseToFormattedNumber(value),
      raw: toBigInt(Math.ceil(value)),
    };
  }
  return ZERO_AMOUNT;
}

export function getPricePerToken(fromAmount?: Maybe<BN>, toAmount?: Maybe<BN>) {
  if (!toAmount || !fromAmount) return '';
  const ratio = divideFnValidOnly(toAmount, fromAmount);
  const price = ratio * toNumber(ONE_ASSET);
  return toFixed(price / toNumber(ONE_ASSET));
}

function getPriceImpact(amounts: BN[], reserves: BN[]) {
  const exchangeRateAfter = divideFnValidOnly(amounts[1], amounts[0]);
  const exchangeRateBefore = divideFnValidOnly(reserves[1], reserves[0]);
  const result = (exchangeRateAfter / exchangeRateBefore - 1) * 100;
  return result > 100 ? 100 : result.toFixed(2);
}

export const calculatePriceImpact = (ctx: SwapMachineContext) => {
  // If any value is 0 return 0
  const { coinFrom, poolInfo, fromAmount, toAmount } = ctx;
  const ethReserve = poolInfo?.eth_reserve;
  const tokenReserve = poolInfo?.token_reserve;
  if (!fromAmount?.raw || !toAmount?.raw || !ethReserve || !tokenReserve) {
    return '0';
  }

  const isEth = isCoinEth(coinFrom);
  const amounts = [toAmount.raw, fromAmount.raw];
  const reserves = isEth ? [tokenReserve, ethReserve] : [ethReserve, tokenReserve];
  return getPriceImpact(amounts, reserves);
};

export const calculatePriceWithSlippage = (
  amount: BN,
  direction: SwapDirection,
  slippage: number
) => {
  const isFrom = direction === SwapDirection.fromTo;
  const total = multiplyFn(amount, isFrom ? 1 - slippage : 1 + slippage);
  return toBigInt(Math.trunc(total));
};

export function hasEnoughBalance(amount: Maybe<BN>, balance: Maybe<BN>) {
  return Boolean(amount && balance && amount.lt(balance));
}

// TODO: Add unit tests on this
export function hasLiquidityForSwap({
  direction,
  poolInfo,
  coinFrom,
  fromAmount,
  coinTo,
  toAmount,
  txCost,
  amountPlusSlippage,
}: SwapMachineContext) {
  if (!coinFrom || !coinTo || !txCost?.fee) return false;

  const isFrom = direction === SwapDirection.fromTo;
  const ethReserve = safeBigInt(poolInfo?.eth_reserve);
  const tokenReserve = safeBigInt(poolInfo?.token_reserve);
  const fromAmountRaw = safeBigInt(fromAmount?.raw);
  const toAmountRaw = safeBigInt(toAmount?.raw);
  const networkFee = safeBigInt(txCost?.fee);
  const plusSlippage = safeBigInt(amountPlusSlippage?.raw);

  if (isCoinEth(coinFrom) && isFrom) {
    return fromAmountRaw.add(networkFee).lt(ethReserve) && toAmountRaw.lt(tokenReserve);
  }
  if (isCoinEth(coinFrom) && !isFrom) {
    return plusSlippage.add(networkFee).lt(ethReserve) && toAmountRaw.lt(tokenReserve);
  }
  return fromAmountRaw.add(tokenReserve) && toAmountRaw.add(networkFee).lt(ethReserve);
}

export const hasEthForNetworkFee = (params: SwapMachineContext) => {
  const { ethBalance, direction, coinFrom, fromAmount, txCost, amountPlusSlippage } = params;
  const balance = safeBigInt(ethBalance);
  const txCostTotal = safeBigInt(txCost?.fee);
  const plusSlippage = safeBigInt(amountPlusSlippage?.raw);
  const fromAmountRaw = safeBigInt(fromAmount?.raw);
  const isFrom = direction === SwapDirection.fromTo;

  /**
   * When coinFrom is ETH and we wan't to buy tokens if exact amount of ETH
   */
  if (isCoinEth(coinFrom) && isFrom) {
    return fromAmountRaw.add(txCostTotal).lte(balance);
  }
  /**
   * When coinFrom is ETH and we wan't to buy exact amount of token
   */
  if (isCoinEth(coinFrom) && !isFrom) {
    return plusSlippage.add(txCostTotal).lte(balance);
  }
  /**
   * When coinFrom isn't ETH but you need to pay gas fee
   */
  return balance.gt(txCostTotal);
};

export interface CalculateMaxBalanceToSwapParams {
  direction: SwapDirection;
  ctx: {
    coinFrom?: Coin;
    coinTo?: Coin;
    coinFromBalance?: Maybe<BN>;
    coinToBalance?: Maybe<BN>;
    txCost?: TransactionCost;
  };
}

export const calculateMaxBalanceToSwap = ({ direction, ctx }: CalculateMaxBalanceToSwapParams) => {
  const isFrom = direction === SwapDirection.fromTo;
  const shouldUseNetworkFee =
    (isFrom && isCoinEth(ctx.coinFrom)) || (!isFrom && isCoinEth(ctx.coinTo));
  const balance = safeBigInt(isFrom ? ctx.coinFromBalance : ctx.coinToBalance);
  const networkFee = safeBigInt(ctx.txCost?.fee);
  const nextValue = balance.gt(ZERO) && shouldUseNetworkFee ? balance.sub(networkFee) : balance;

  return createAmount(nextValue);
};
