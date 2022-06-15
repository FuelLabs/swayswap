import { useMachine, useSelector } from "@xstate/react";
import type { CoinQuantity } from "fuels";
import { atom, useAtom } from "jotai";
import type { ReactNode } from "react";
import { useEffect, createContext, useContext } from "react";
import { useQueryClient } from "react-query";

import type {
  SwapMachineService,
  SwapMachineState,
} from "../machines/swapMachine";
import { isLoadingState, swapMachine } from "../machines/swapMachine";
import type { SwapMachineContext } from "../types";
import { SwapDirection } from "../types";

import { useCoinByParam } from "./useCoinByParam";

import {
  useWallet,
  useContract,
  useSlippage,
  useSubscriber,
} from "~/systems/Core";

const selectors = {
  isLoading: isLoadingState,
  canSwap: (state: SwapMachineState) => state.hasTag("canSwap"),
  coinFrom: (state: SwapMachineState) => state.context.coinFrom,
  coinTo: (state: SwapMachineState) => state.context.coinTo,
  direction: (state: SwapMachineState) => state.context.direction,
  txCost: (state: SwapMachineState) => state.context.txCost,
};

// ----------------------------------------------------------------------------
// Global State
// ----------------------------------------------------------------------------

const swapGlobalAtom = atom<Partial<SwapMachineContext>>({});

export function useSwapGlobalState() {
  return useAtom(swapGlobalAtom);
}

// ----------------------------------------------------------------------------
// PubSub
// ----------------------------------------------------------------------------

export enum SwapEvents {
  "refetchBalances" = "refetchBalances",
}

// ----------------------------------------------------------------------------
// SwapContext
// ----------------------------------------------------------------------------

type Context = {
  state: SwapMachineState;
  send: SwapMachineService["send"];
  service: SwapMachineService;
};

const swapContext = createContext({} as Context);

export function useSwapContext() {
  return useContext(swapContext);
}

export function useSwap() {
  const { send, service } = useContext(swapContext);
  const isLoading = useSelector(service, selectors.isLoading);
  const canSwap = useSelector(service, selectors.canSwap);
  const coinFrom = useSelector(service, selectors.coinFrom);
  const coinTo = useSelector(service, selectors.coinTo);
  const direction = useSelector(service, selectors.direction);
  const txCost = useSelector(service, selectors.txCost);

  function onInvertCoins() {
    send("INVERT_COINS");
  }
  function onSwap() {
    send("SWAP");
  }

  return {
    onSwap,
    onInvertCoins,
    state: {
      isLoading,
      canSwap,
      coinFrom,
      coinTo,
      direction,
      txCost,
    },
  };
}

type SwapProviderProps = {
  children: ReactNode;
};

export function SwapProvider({ children }: SwapProviderProps) {
  const [globalState, setGlobalState] = useSwapGlobalState();
  const client = useQueryClient();
  const wallet = useWallet();
  const contract = useContract();
  const slippage = useSlippage();
  const coinFrom = useCoinByParam("coinFrom");
  const coinTo = useCoinByParam("coinTo");

  const [state, send, service] = useMachine(swapMachine, {
    context: {
      client,
      wallet,
      contract,
      direction: globalState.direction || SwapDirection.fromTo,
      coinFrom: coinFrom || globalState.coinFrom,
      coinTo: coinTo || globalState.coinTo,
      fromAmount: globalState.fromAmount,
      toAmount: globalState.toAmount,
      slippage: slippage.value,
    } as SwapMachineContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  /**
   * This effect is a machine context subscription in order to keep
   * a global state data and persist it between page navigation
   */
  useEffect(() => {
    const sub = service.subscribe((item) => setGlobalState(item.context));
    return sub.unsubscribe;
  }, []);

  /**
   * This subscriber is need because there's a lot of times the balance
   * is updated outside the machine
   */
  useSubscriber<CoinQuantity[]>(SwapEvents.refetchBalances, (data) => {
    send("SET_BALANCES", { data });
  });

  return (
    <swapContext.Provider value={{ state, send, service }}>
      {children}
    </swapContext.Provider>
  );
}
