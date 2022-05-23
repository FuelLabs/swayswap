import { atom } from 'jotai';

import { ActiveInput } from './types';

import assets from '~/lib/CoinsMetadata';
import type { Coin } from '~/types';

export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin | null, Coin | null]>([assets[0], null]);
export const swapAmountAtom = atom<bigint | null>(null);
export const swapIsTypingAtom = atom<boolean>(false);
