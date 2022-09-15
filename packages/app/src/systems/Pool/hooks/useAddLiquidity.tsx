import { useActor, useInterpret } from "@xstate/react";
import Decimal from "decimal.js";
import type { CoinQuantity } from "fuels";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useQueryClient } from "react-query";

import type { AddLiquidityMachineService } from "../machines/addLiquidityMachine";
import { addLiquidityMachine } from "../machines/addLiquidityMachine";
import type { AddLiquidityMachineContext } from "../types";
import { poolInfoEmpty, liquidityPreviewEmpty } from "../types";

import { TOKENS, useContract, useSubscriber, useWallet } from "~/systems/Core";
import { AppEvents } from "~/types";

const serviceMap = new Map();
const isProd = process.env.NODE_ENV === "production";

export const AddLiquidityContext = createContext<AddLiquidityMachineService>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as any
);

function useAddLiquidityService() {
  let service = useContext(AddLiquidityContext);

  /**
   * Need this because of React.context that updates for null on each refresh
   * Causing an error in useActor. But it's on development
   */
  if (!service && !isProd) {
    service = serviceMap.get("service");
  }

  return service;
}

export function useAddLiquidityContext() {
  const service = useAddLiquidityService();
  const [state] = useActor(service);
  return { state, service, send: service.send };
}

export function AddLiquidityProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient();
  const contract = useContract();
  const wallet = useWallet();
  const coinFrom = TOKENS[0];
  const coinTo = TOKENS[1];
  const context: AddLiquidityMachineContext = {
    client,
    wallet,
    contract,
    coinFrom,
    coinTo,
    active: null,
    fromAmount: null,
    toAmount: null,
    poolInfo: poolInfoEmpty,
    poolShare: new Decimal(0),
    balances: [],
    liquidityPreview: liquidityPreviewEmpty,
    transactionCost: null,
  };
  const service = useInterpret(addLiquidityMachine, {
    context,
    devTools: true,
  });

  if (!isProd) {
    serviceMap.set("service", service);
  }

  useSubscriber<CoinQuantity[]>(AppEvents.updatedBalances, (data) => {
    service.send("SET_BALANCES", { data });
  });

  return (
    <AddLiquidityContext.Provider value={service}>
      {children}
    </AddLiquidityContext.Provider>
  );
}

export function isLoadingState() {
  const { state } = useAddLiquidityContext();
  return state.hasTag("loading");
}
