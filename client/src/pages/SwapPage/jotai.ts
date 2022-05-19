import { atom } from 'jotai';
import assets from "src/lib/CoinsMetadata";
import { Coin } from 'src/types';
import { ActiveInput } from './types';

export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin, Coin]>([
  assets[0],
  assets[1],
])
export const swapAmountAtom = atom<bigint | null>(null);
