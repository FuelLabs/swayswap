import { atom } from 'jotai';

export const poolFromAmountAtom = atom<bigint | null>(null);
export const poolToAmountAtom = atom<bigint | null>(null);