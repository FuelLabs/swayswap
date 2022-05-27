import * as ethers from '@ethersproject/units';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export const ZERO = toBigInt(0);

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
  return toNumber(value || 0) / toNumber(by || 0);
}

export function divideFnValidOnly(value?: BigNumberish | null, by?: BigNumberish | null) {
  const result = divideFn(value || 0, by || 0);

  return Number.isNaN(result) || !Number.isFinite(result) ? 0 : result;
}

export function parseToFormattedNumber(value: string | BigNumberish, precision: number) {
  return ethers.commify(formatUnits(value, precision));
}
