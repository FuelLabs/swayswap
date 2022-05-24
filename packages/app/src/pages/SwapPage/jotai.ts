import { atom, useSetAtom } from 'jotai';
import { useRef } from 'react';

import { ActiveInput } from './types';

import assets from '~/lib/CoinsMetadata';
import type { Coin } from '~/types';

export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin | null, Coin | null]>([assets[0], null]);
export const swapAmountAtom = atom<bigint | null>(null);
export const swapIsTypingAtom = atom<boolean>(false);

export const useSetTyping = () => {
  const setTyping = useSetAtom(swapIsTypingAtom);
  const timeout = useRef<number>(0);

  return (typing: boolean) => {
    setTyping(typing);
    if (typing) {
      clearTimeout(timeout.current);
      timeout.current = Number(
        setTimeout(() => {
          setTyping(false);
        }, 600)
      );
    }
  };
};
