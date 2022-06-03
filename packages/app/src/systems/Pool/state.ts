import { atom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

export const poolFromAmountAtom = atomWithReset<bigint | null>(null);
export const poolToAmountAtom = atomWithReset<bigint | null>(null);

export const poolStageDoneAtom = atom<number>(0);

export const useResetPoolAmounts = () => {
  const resetFromAmount = useResetAtom(poolFromAmountAtom);
  const resetToAmount = useResetAtom(poolToAmountAtom);
  return () => {
    resetFromAmount();
    resetToAmount();
  };
};
