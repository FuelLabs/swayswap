import { atom } from 'jotai';
import assets from "src/lib/CoinsMetadata";
import { Coin } from 'src/types';

export enum ActiveInput {
  'from' = 'from',
  'to' = 'to',
}

export type SwapState = {
  from: string;
  to: string;
  direction: ActiveInput;
  amount: bigint | null;
};

export const swapAtom = atom<SwapState | null>(null);
export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin, Coin]>([
  assets[0],
  assets[1],
])