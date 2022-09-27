import { Decimal } from 'decimal.js';
import { bn } from 'fuels';
import type { BigNumberish, BN } from 'fuels';

import { DECIMAL_UNITS, FIXED_UNITS } from '~/config';
import type { Maybe } from '~/types';

/** Zero BN function */
export const ZERO = bn(0);
/** One Asset Amount 1000000000 */
export const ONE_ASSET = bn.parseUnits('1', DECIMAL_UNITS);
/** Max value from Sway Contract */
export const MAX_U64_STRING = '0xFFFFFFFFFFFFFFFF';

// export function getNumberOrHex(value: Maybe<BigNumberish>): number | string {
//   if (typeof value === 'number') {
//     return value;
//   }
//   return bn(value || 0).toHex();
// }

export function multiply(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): BN {
  return bn(new Decimal(bn(value).toHex()).mul(bn(by).toHex()).round().toHex());
  // return bn(new Decimal(getNumberOrHex(value)).mul(getNumberOrHex(by)).round().toHex());
}

export function divide(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): BN {
  return bn(new Decimal(bn(value).toHex()).div(bn(by).toHex()).round().toHex());
  // return bn(new Decimal(getNumberOrHex(value)).div(getNumberOrHex(by)).round().toHex());
}

export function minimumZero(value: BigNumberish): BN {
  return bn(value).lte('0') ? bn('0') : bn(value);
}

export function maxAmount(value: BigNumberish, max: BigNumberish): BN {
  return bn(max).lt(value) ? bn(value) : bn(max);
}

export function isValidNumber(value: BigNumberish) {
  try {
    if (typeof value === 'string') {
      return bn.parseUnits(value).lte(MAX_U64_STRING);
    }
    return bn(value).lte(MAX_U64_STRING);
  } catch (e) {
    return false;
  }
}

export function calculatePercentage(amount: BN, by: BN) {
  return new Decimal(amount.toHex()).div(by.toHex()).mul(100);
}
