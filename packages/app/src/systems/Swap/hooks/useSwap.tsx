import { useActor, useInterpret, useSelector } from "@xstate/react";
import type { CoinQuantity } from "fuels";
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

import { useSwapGlobalState } from "./useSwapGlobalState";
import { useSwapURLParams } from "./useSwapURLParams";

import {
  useWallet,
  useContract,
  useSlippage,
  useSubscriber,
  compareStates,
} from "~/systems/Core";
import { AppEvents } from "~/types";

const selectors = {
  isLoading: isLoadingState,
  canSwap: (state: SwapMachineState) => state.hasTag("canSwap"),
  canInvertCoins: (state: SwapMachineState) => !state.hasTag("needSelectToken"),
  coinFrom: (state: SwapMachineState) => state.context.coinFrom,
  coinTo: (state: SwapMachineState) => state.context.coinTo,
  direction: (state: SwapMachineState) => state.context.direction,
  txCost: (state: SwapMachineState) => state.context.txCost,
};

// ----------------------------------------------------------------------------
// SwapContext
// ----------------------------------------------------------------------------

const serviceMap = new Map();
const isProd = process.env.NODE_ENV === "production";

const swapServiceContext = createContext<SwapMachineService>(
  // @ts-ignore
  null as SwapMachineService
);

export function useSwapService() {
  let service = useContext(swapServiceContext);
  /**
   * Need this because of React.context that updates for null on each refresh
   * Causing an error in useActor. But it's on development
   */
  if (!service && !isProd) {
    service = serviceMap.get("service");
  }
  return service;
}

export function useSwapContext() {
  const service = useSwapService();
  const [state] = useActor(service);
  return { state, service, send: service.send };
}

export function useSwap() {
  const service = useSwapService();
  const isLoading = useSelector(service, selectors.isLoading);
  const canSwap = useSelector(service, selectors.canSwap);
  const coinFrom = useSelector(service, selectors.coinFrom, compareStates);
  const coinTo = useSelector(service, selectors.coinTo, compareStates);
  const direction = useSelector(service, selectors.direction);
  const txCost = useSelector(service, selectors.txCost, compareStates);
  const canInvertCoins = useSelector(service, selectors.canInvertCoins);

  function onInvertCoins() {
    service.send("INVERT_COINS");
  }
  function onSwap() {
    service.send("SWAP");
  }

  return {
    onSwap,
    onInvertCoins,
    state: {
      canInvertCoins,
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
  const { coinFrom, coinTo, setCoinParams } = useSwapURLParams();
  const client = useQueryClient();
  const wallet = useWallet();
  const contract = useContract();
  const slippage = useSlippage();

  const service = useInterpret(swapMachine, {
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

  if (!isProd) {
    serviceMap.set("service", service);
  }

  /**
   * This effect is a machine context subscription in order to keep
   * a global state data and persist it between page navigation
   */
  useEffect(() => {
    const sub = service.subscribe((item) => {
      setCoinParams(item.context);
      setGlobalState(item.context);
    });
    return sub.unsubscribe;
  }, []);

  /**
   * This subscriber is need because there's a lot of times the balance
   * is updated outside the machine
   */
  useSubscriber<CoinQuantity[]>(AppEvents.updatedBalances, (data) => {
    service.send("SET_BALANCES", { data });
  });

  return (
    <swapServiceContext.Provider value={service}>
      {children}
    </swapServiceContext.Provider>
  );
}
