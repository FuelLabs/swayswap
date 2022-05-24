import { atom } from 'jotai';

import { ActiveInput } from './types';

import assets from '~/lib/CoinsMetadata';
import type { Coin } from '~/types';

export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin, Coin]>([assets[0], assets[1]]);
export const swapIsTypingAtom = atom<boolean>(false);
export const swapHasSwappedAtom = atom<boolean>(false);
export const swapAmountAtom = atom<bigint | null>(null);
