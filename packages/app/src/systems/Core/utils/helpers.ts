import { TOKENS } from './tokenList';

import type { Coin, Maybe } from '~/types';

export const objectId = (value: string) => ({ value });

export const sleep = (ms: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function omit<T>(list: string[], props: T) {
  return Object.entries(props).reduce((obj, [key, value]) => {
    if (list.some((k) => k === key)) return obj;
    return { ...obj, [key]: value };
  }, {} as T) as T;
}

export function isCoinEth(coin: Maybe<Coin>) {
  return coin?.assetId === TOKENS[0].assetId;
}
