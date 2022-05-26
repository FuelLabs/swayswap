import { BigNumber } from 'bignumber.js';
import { Decimal } from 'decimal.js';
import type { BigNumberish } from 'fuels';

export function toNumber(number: BigNumberish) {
  let value: number | string | null = null;
  if (typeof number === 'bigint') {
    value = BigInt(number).toString();
  } else {
    value = number;
  }
  return new BigNumber(value || 0).toNumber();
}

export function divideBigInt(from: BigNumberish, to: BigNumberish) {
  return toNumber(from) / toNumber(to);
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
