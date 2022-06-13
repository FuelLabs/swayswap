import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useRef } from 'react';

import { ActiveInput } from './types';

import { TOKENS } from '~/systems/Core';
import type { Coin, Maybe } from '~/types';

export const swapActiveInputAtom = atom<ActiveInput>(ActiveInput.from);
export const swapCoinsAtom = atom<[Coin, Coin]>([TOKENS[0], TOKENS[1]]);
export const swapIsTypingAtom = atom<boolean>(false);

export const useValueIsTyping = () => useAtomValue(swapIsTypingAtom);
export const useSetIsTyping = () => {
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

export const swapHasSwappedAtom = atom<boolean>(false);
export const swapAmountAtom = atom<Maybe<bigint>>(null);
