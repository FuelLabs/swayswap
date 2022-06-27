import { atom, useAtom } from "jotai";

import type { SwapMachineContext } from "../types";

const swapGlobalAtom = atom<Partial<SwapMachineContext>>({});

export function useSwapGlobalState() {
  return useAtom(swapGlobalAtom);
}
