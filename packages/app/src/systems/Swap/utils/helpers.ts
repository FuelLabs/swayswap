import Decimal from 'decimal.js';
import { bn, BN, format } from 'fuels';

import type { CoinAmount, SwapMachineContext } from '../types';
import { SwapDirection } from '../types';

import { DECIMAL_UNITS } from '~/config';
import { isCoinEth, multiply, ONE_ASSET } from '~/systems/Core';
import type { TransactionCost } from '~/systems/Core/utils/gas';
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
export function createAmount(value: Maybe<string | BN>): CoinAmount {
  if (!value) return ZERO_AMOUNT;
  if (typeof value === 'string') {
    const raw = bn.parseUnits(value);
    return {
      value,
      raw,
    };
  }
  if (BN.isBN(value)) {
    return {
      value: bn(value).formatUnits(DECIMAL_UNITS),
      raw: value,
    };
  }
  return ZERO_AMOUNT;
}

export function getPricePerToken(fromAmount?: Maybe<BN>, toAmount?: Maybe<BN>) {
  if (!toAmount || !fromAmount || bn(fromAmount).isZero() || bn(toAmount).isZero()) return '';
  return format(
    bn(new Decimal(toAmount.toHex()).div(fromAmount.toHex()).mul(ONE_ASSET.toHex()).round().toHex())
  );
}

function getPriceImpact(amounts: BN[], reserves: BN[]) {
  if (amounts.find((a) => bn(a).isZero()) || reserves.find((r) => bn(r).isZero())) return '0';
  const exchangeRateAfter = new Decimal(amounts[1].toHex()).div(amounts[0].toHex());
  const exchangeRateBefore = new Decimal(reserves[1].toHex()).div(reserves[0].toHex());
  const result = exchangeRateBefore.div(exchangeRateAfter).sub(1).mul(100);
  return result.toFixed(2);
}

export const calculatePriceImpact = (ctx: SwapMachineContext) => {
  // If any value is 0 return 0
  const { coinFrom, poolInfo, fromAmount, toAmount } = ctx;
  const tokenReserve1 = poolInfo?.token_reserve1;
  const tokenReserve2 = poolInfo?.token_reserve2;
  if (!fromAmount?.raw || !toAmount?.raw || !tokenReserve1 || !tokenReserve2) {
    return '0';
  }
  const isEth = isCoinEth(coinFrom);
  const amounts = [toAmount.raw, fromAmount.raw];
  const reserves = isEth ? [tokenReserve2, tokenReserve1] : [tokenReserve1, tokenReserve2];

  return getPriceImpact(amounts, reserves);
};

export const calculatePriceWithSlippage = (
  amount: BN,
  direction: SwapDirection,
  slippage: number
) => {
  const isFrom = direction === SwapDirection.fromTo;
  return multiply(amount, isFrom ? 1 - slippage : 1 + slippage);
};

export function hasEnoughBalance(amount: Maybe<BN>, balance: Maybe<BN>) {
  return bn(amount).lte(bn(balance)) && !bn(balance).isZero();
}

// TODO: Add unit tests on this
export function hasLiquidityForSwap({ direction, poolInfo, coinTo, toAmount }: SwapMachineContext) {
  const isFrom = direction === SwapDirection.fromTo;
  const tokenReserve1 = bn(poolInfo?.token_reserve1);
  const tokenReserve2 = bn(poolInfo?.token_reserve2);
  const toAmountRaw = bn(toAmount?.raw);

  if (isFrom) return true;

  const reserveAmount = isCoinEth(coinTo) ? tokenReserve1 : tokenReserve2;
  return toAmountRaw.lte(reserveAmount);
}

export const hasEthForNetworkFee = (params: SwapMachineContext) => {
  const { ethBalance, txCost } = params;
  const balance = bn(ethBalance);
  const txCostTotal = bn(txCost?.fee);

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
  const balance = bn(isFrom ? ctx.coinFromBalance : ctx.coinToBalance);

  return createAmount(balance);
};
