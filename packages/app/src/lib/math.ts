import { BigNumber } from 'bignumber.js';
import { Decimal } from 'decimal.js';
import { commify } from 'ethers/lib/utils';
import type { BigNumberish } from 'fuels';

import { ZERO } from './constants';

import { DECIMAL_UNITS } from '~/config';

export function toNumber(number: BigNumberish) {
  let value: number | string | null = null;
  if (typeof number === 'bigint') {
    value = BigInt(number).toString();
  } else {
    value = number;
  }
  return new BigNumber(value || 0).toNumber();
}

export function parseUnits(number: string, precision: number) {
  const denominator = Number([1, ...new Array(precision).fill(0)].join(''));
  return toBigInt(new Decimal(toNumber(number)).mul(denominator).toFixed());
}

export function toBigInt(number: BigNumberish) {
  return BigInt(Math.trunc(toNumber(number)));
}

export function formatUnits(number: BigNumberish, precision: number) {
  const denominator = Number([1, ...new Array(precision).fill(0)].join(''));
  return new Decimal(toNumber(number)).div(denominator).toFixed();
}

export function divideFn(value?: BigNumberish | null, by?: BigNumberish | null) {
  return toNumber(value || ZERO) / toNumber(by || ZERO);
}

export function divideFnValidOnly(value?: BigNumberish | null, by?: BigNumberish | null) {
  const result = divideFn(value || 0, by || 0);

  return Number.isNaN(result) || !Number.isFinite(result) ? 0 : result;
}

export const parseToFormattedNumber = (
  value: string | BigNumberish,
  unit: number = DECIMAL_UNITS
) => commify(formatUnits(value, unit));
