import type { BigNumberish } from '@ethersproject/bignumber';
import { BigNumber } from '@ethersproject/bignumber';
import * as ethers from '@ethersproject/units';
import { Decimal } from 'decimal.js';

import { DECIMAL_UNITS, FIXED_UNITS } from '~/config';

export const ZERO = toBigInt(0);

export const ONE_ASSET = parseUnits('1', DECIMAL_UNITS).toBigInt();
// Max value supported
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export const MAX_U64_VALUE = 0xffff_ffff_ffff_ffff;
// Max value from Sway Contract
export const MAX_U64_STRING = '18446744073709551615';

export function toFixed(
  number: BigNumberish | null | undefined,
  maxDecimals: number = FIXED_UNITS
) {
  const [amount, decimals = '0'] = String(number?.toString() || '0.0').split('.');
  const minDecimals = decimals.split('').findIndex((u: string) => u !== '0');
  const decimalFormatted = decimals.slice(
    0,
    minDecimals >= maxDecimals ? minDecimals + 1 : maxDecimals
  );
  return [amount || 0, '.', ...decimalFormatted].join('');
}

export function toNumber(number: BigNumberish | null | undefined) {
  return BigNumber.from(number || 0).toNumber();
}

export function parseUnits(number: string, precision: number = DECIMAL_UNITS) {
  return ethers.parseUnits(number, precision);
}

export function toBigInt(number: BigNumberish) {
  return BigNumber.from(number).toBigInt();
}

export function formatUnits(number: BigNumberish, precision: number = DECIMAL_UNITS): string {
  return ethers.formatUnits(number, precision);
}

export function divideFn(value?: BigNumberish | null, by?: BigNumberish | null) {
  return new Decimal(value?.toString() || 0).div(by?.toString() || 0).toNumber();
}

export function divideFnValidOnly(value?: BigNumberish | null, by?: BigNumberish | null) {
  const result = divideFn(value || 0, by || 0);

  return Number(Number.isNaN(result) || !Number.isFinite(result) ? 0 : result);
}

export function parseToFormattedNumber(
  value: string | BigNumberish,
  precision: number = DECIMAL_UNITS
) {
  let val = value;
  if (typeof value === 'number') {
    val = BigInt(Math.trunc(value));
  }
  const result = ethers.commify(toFixed(formatUnits(val, precision), FIXED_UNITS));
  const decimal = new Decimal(result.replaceAll(',', ''));
  return decimal.lessThanOrEqualTo('0.0001') ? '0' : result;
}

export function multiplyFn(value?: BigNumberish | null, by?: BigNumberish | null) {
  return new Decimal(value?.toString() || 0).mul(by?.toString() || 0).toNumber();
}

export function minimumZero(value: number | bigint) {
  return value < 0 ? 0 : value;
}

export function maxAmount(value: number | bigint, max: number | bigint) {
  return max > value ? value : max;
}

export function isSwayInfinity(value: BigNumberish | null) {
  return value?.toString() === MAX_U64_STRING;
}
