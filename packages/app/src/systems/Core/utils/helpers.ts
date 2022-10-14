import { TOKENS } from './tokenList';

import type { Coin, Maybe } from '~/types';

export const objectId = (value: string) => ({ value });

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function omit<T extends Object>(list: string[], props: T) {
  return Object.entries(props).reduce((obj, [key, value]) => {
    if (list.some((k) => k === key)) return obj;
    return { ...obj, [key]: value };
  }, {} as T) as T;
}

export function isCoinEth(coin: Maybe<Coin>) {
  return coin?.assetId === TOKENS[0].assetId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareStates(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
