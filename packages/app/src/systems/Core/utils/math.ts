import * as ethers from '@ethersproject/units';
import { Decimal } from 'decimal.js';
import { bn } from 'fuels';
import type { BigNumberish, BN } from 'fuels';

import { DECIMAL_UNITS, FIXED_UNITS } from '~/config';
import type { Maybe } from '~/types';

export const ZERO = bn(0);

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

export function isZero(number: Maybe<BigNumberish>): boolean {
  return bn(number || 0).eq(0);
}

export function toNumber(number: Maybe<BigNumberish>): number {
  if (typeof number === 'number') return number;
  return bn(number || '0').toNumber();
}

export function parseUnits(number: string, precision: number = DECIMAL_UNITS): BN {
  return bn(ethers.parseUnits(number, precision).toHexString());
}

export function parseInputValueBigInt(value: string): BN {
  if (value !== '') {
    const nextValue = value === '.' ? '0.' : value;
    return toBigInt(parseUnits(nextValue));
  }
  return ZERO;
}

export function toBigInt(number: BigNumberish) {
  return bn(number);
}

export function formatUnits(number: BigNumberish, precision: number = DECIMAL_UNITS): string {
  return ethers.formatUnits(bn(number).toHex(), precision);
}

export function divideFn(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): number {
  return new Decimal(Number(value || 0) || 0).div(Number(by || 0)).toNumber();
}

export function divideFnValidOnly(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): number {
  const result = divideFn(value || 0, by || 0);

  return Number(Number.isNaN(result) || !Number.isFinite(result) ? 0 : result);
}

export function parseToFormattedNumber(
  value: BigNumberish,
  precision: number = DECIMAL_UNITS
): string {
  let val = value;
  if (typeof value === 'number') {
    val = Math.trunc(value);
  }
  return ethers.commify(toFixed(formatUnits(val, precision), FIXED_UNITS));
}

export function multiplyFn(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): number {
  return new Decimal(value?.toString() || 0).mul(by?.toString() || 0).toNumber();
}

export function minimumZero(value: BigNumberish): BN {
  return bn(value).lt(0) ? bn(0) : bn(value);
}

export function maxAmount(value: BigNumberish, max: BigNumberish): BN {
  return bn(max).lt(value) ? bn(value) : bn(max);
}

export function isSwayInfinity(value: Maybe<BigNumberish>): boolean {
  return bn(value || 0).gte(MAX_U64_STRING);
}

export function safeBigInt(value?: Maybe<BigNumberish>, defaultValue?: number): BN {
  return bn(value || bn(defaultValue || 0));
}

export function isValidNumber(value: number) {
  return value <= Number.MAX_SAFE_INTEGER;
}
