import { atom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

import type { Maybe } from '~/types';

export const poolFromAmountAtom = atomWithReset<Maybe<bigint>>(null);
export const poolToAmountAtom = atomWithReset<Maybe<bigint>>(null);

export const poolStageDoneAtom = atom<number>(0);

export const useResetPoolAmounts = () => {
  const resetFromAmount = useResetAtom(poolFromAmountAtom);
  const resetToAmount = useResetAtom(poolToAmountAtom);
  return () => {
    resetFromAmount();
    resetToAmount();
  };
};
