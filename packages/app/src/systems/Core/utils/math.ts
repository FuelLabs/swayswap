// import * as ethers from '@ethersproject/units';
import { Decimal } from 'decimal.js';
import { bn } from 'fuels';
import type { BigNumberish, BN } from 'fuels';

import { DECIMAL_UNITS, FIXED_UNITS } from '~/config';
import type { Maybe } from '~/types';

/** Zero BN function */
export const ZERO = bn(0);
/** One Asset Amount 1000000000 */
export const ONE_ASSET = parseUnits('1', DECIMAL_UNITS);
/** Max value from Sway Contract */
export const MAX_U64_STRING = '0xFFFFFFFFFFFFFFFF';

export function isZero(number: Maybe<BigNumberish>): boolean {
  return bn(number || 0).eq(0);
}

export function formatUnits(number: BN, precision: number = DECIMAL_UNITS) {
  const valueUnits = number.toString().slice(0, precision * -1);
  const valueDecimals = number.toString().slice(precision * -1);
  const length = valueDecimals.length;
  const defaultDecimals = Array.from({ length: precision - length })
    .fill('0')
    .join('');

  return `${valueUnits ? `${valueUnits}.` : '0.'}${defaultDecimals}${valueDecimals}`;
}

export function format(
  value: BN = ZERO,
  maxDecimals: number = FIXED_UNITS,
  precision: number = DECIMAL_UNITS
) {
  const [valueUnits = '0', valueDecimals = '0'] = formatUnits(value, precision).split('.');
  const groupRegex = new RegExp(`(\\d)(?=(\\d{${maxDecimals}})+\\b)`, 'g');
  const units = valueUnits.replace(groupRegex, '$1,');
  let decimals = valueDecimals.slice(0, maxDecimals);

  if (valueUnits === '0') {
    const firstNonZero = valueDecimals.match(/[1-9]/);

    if (firstNonZero && firstNonZero.index && firstNonZero.index + 1 > maxDecimals) {
      decimals = valueDecimals.slice(0, firstNonZero.index + 1);
    }
  }

  return `${units}.${decimals}`;
}

export function parseUnits(value: string, precision: number = DECIMAL_UNITS): BN {
  const [valueUnits = '0', valueDecimals = '0'] = value.split('.');
  const length = valueDecimals.length;

  if (length > precision) {
    throw new Error('Decimal can not be bigger than the precision');
  }

  const decimals = Array.from({ length: precision }).fill('0');
  decimals.splice(0, length, valueDecimals);
  const amount = `${valueUnits.replace(',', '')}${decimals.join('')}`;
  return bn(amount);
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

export function getNumberOrHex(value: Maybe<BigNumberish>): number | string {
  if (typeof value === 'number') {
    return value;
  }
  return bn(value || 0).toHex();
}

export function multiply(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): BN {
  return bn(new Decimal(getNumberOrHex(value)).mul(getNumberOrHex(by)).round().toHex());
}

export function divide(value?: Maybe<BigNumberish>, by?: Maybe<BigNumberish>): BN {
  return bn(new Decimal(getNumberOrHex(value)).div(getNumberOrHex(by)).round().toHex());
}

export function minimumZero(value: BigNumberish): BN {
  return bn(value).lte('0') ? bn('0') : bn(value);
}

export function maxAmount(value: BigNumberish, max: BigNumberish): BN {
  return bn(max).lt(value) ? bn(value) : bn(max);
}

export function safeBigInt(value?: Maybe<BigNumberish>, defaultValue?: BigNumberish): BN {
  return bn(value || defaultValue || 0);
}

export function isValidNumber(value: BigNumberish) {
  return bn(value).lte(MAX_U64_STRING);
}
