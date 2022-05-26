import { BigNumber } from 'ethers';
import type { BigNumberish } from 'fuels';
import { urlJoin } from 'url-join-ts';

import { MAX_U64_STRING } from '~/config';

const { PUBLIC_URL } = process.env;

export const objectId = (value: string) => ({
  value,
});

// eslint-disable-next-line no-promise-executor-return
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const relativeUrl = (path: string) => urlJoin(PUBLIC_URL || '/', path);

export const isSwayInfinity = (value: BigNumberish | null) => value?.toString() === MAX_U64_STRING;

export function omit<T>(list: string[], props: T) {
  return Object.entries(props).reduce((obj, [key, value]) => {
    if (list.some((k) => k === key)) return obj;
    return { ...obj, [key]: value };
  }, {} as T) as T;
}

export function divideFn(value?: BigNumberish | null, by?: BigNumberish | null) {
  return BigNumber.from(value).toNumber() / BigNumber.from(by).toNumber();
}

export function divideFnValidOnly(value?: BigNumberish | null, by?: BigNumberish | null) {
  const result = divideFn(value || 0, by || 0);

  return Number.isNaN(result) || !Number.isFinite(result) ? 0 : result;
}
