import * as ethers from '@ethersproject/units';
import { Decimal } from 'decimal.js';
import type { BigNumberish } from 'fuels';

import { DECIMAL_UNITS, FIXED_UNITS } from '~/config';
import type { Maybe } from '~/types';

export const ZERO = toBigInt(0);

export const ONE_ASSET = parseUnits('1', DECIMAL_UNITS);
// Max value supported
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export const MAX_U64_VALUE = 0xffff_ffff_ffff_ffff;
// Max value from Sway Contract
export const MAX_U64_STRING = '18446744073709551615';

export function toFixed(number: Maybe<BigNumberish>, maxDecimals: number = FIXED_UNITS) {
  const [amount, decimals = '0'] = String(number?.toString() || '0.0').split('.');
  const minDecimals = decimals.split('').findIndex((u: string) => u !== '0');
  const canShowMinDecimals = minDecimals >= maxDecimals && amount === '0';
  const decimalFormatted = decimals.slice(0, canShowMinDecimals ? minDecimals + 1 : maxDecimals);
  return [amount || 0, '.', ...decimalFormatted].join('');
}

export function toNumber(number: Maybe<BigNumberish>) {
  return Number(BigInt(number || '0'));
}

export function parseUnits(number: string, precision: number = DECIMAL_UNITS) {
  return ethers.parseUnits(number, precision).toBigInt();
}

export function parseInputValueBigInt(value: string) {
  if (value !== '') {
    const nextValue = value === '.' ? '0.' : value;
    return toBigInt(parseUnits(nextValue));
  }
  return ZERO;
}

export function toBigInt(number: BigNumberish) {
  return BigInt(number || '0');
}

export function formatUnits(number: BigNumberish, precision: number = DECIMAL_UNITS): string {
  return ethers.formatUnits(number, precision);
}

export function divideFn(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>) {
  return new Decimal(value?.toString() || 0).div(by?.toString() || 0).toNumber();
}

export function divideFnValidOnly(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>) {
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
  return ethers.commify(toFixed(formatUnits(val, precision), FIXED_UNITS));
}

export function multiplyFn(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>) {
  return new Decimal(value?.toString() || 0).mul(by?.toString() || 0).toNumber();
}

export function minimumZero(value: number | bigint) {
  return value < 0 ? 0 : value;
}

export function maxAmount(value: number | bigint, max: number | bigint) {
  return max > value ? value : max;
}

export function isSwayInfinity(value: Maybe<BigNumberish>) {
  return value?.toString() === MAX_U64_STRING;
}

export function safeBigInt(value?: Maybe<bigint>, defaultValue?: number) {
  return value || toBigInt(defaultValue || 0);
}
