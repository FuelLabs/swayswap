import * as ethers from '@ethersproject/units';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { Decimal } from 'decimal.js';

export const ZERO = toBigInt(0);

export function toFixed(number: BigNumberish | null | undefined, maxDecimals: number = 3) {
  const [amount, decimals] = String(number?.toString() || '0.0').split('.');
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

export function parseUnits(number: string, precision: number) {
  return ethers.parseUnits(number, precision);
}

export function toBigInt(number: BigNumberish) {
  return BigNumber.from(number).toBigInt();
}

export function formatUnits(number: BigNumberish, precision: number): string {
  return ethers.formatUnits(number, precision);
}

export function divideFn(value?: BigNumberish | null, by?: BigNumberish | null) {
  return new Decimal(value?.toString() || 0).div(by?.toString() || 0).toNumber();
}

export function divideFnValidOnly(value?: BigNumberish | null, by?: BigNumberish | null) {
  const result = divideFn(value || 0, by || 0);

  return Number(Number.isNaN(result) || !Number.isFinite(result) ? 0 : result);
}

export function parseToFormattedNumber(value: string | BigNumberish, precision: number = 3) {
  let val = value;
  if (typeof value === 'number') {
    val = BigInt(value);
  }
  return ethers.commify(formatUnits(val, precision));
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
