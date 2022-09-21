import { useActor, useInterpret } from "@xstate/react";
import Decimal from "decimal.js";
import type { CoinQuantity } from "fuels";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

import type { AddLiquidityMachineService } from "../machines/addLiquidityMachine";
import { addLiquidityMachine } from "../machines/addLiquidityMachine";
import type { AddLiquidityMachineContext } from "../types";
import { liquidityPreviewEmpty } from "../types";

import { IS_DEVELOPMENT } from "~/config";
import { TOKENS, useContract, useSubscriber } from "~/systems/Core";
import { AppEvents } from "~/types";

const serviceMap = new Map();

export const AddLiquidityContext = createContext<AddLiquidityMachineService>(
  {} as AddLiquidityMachineService
);

function useAddLiquidityService() {
  let service = useContext(AddLiquidityContext);

  /**
   * Need this because of React.context that updates for null on each refresh
   * Causing an error in useActor. But it's on development
   */
  if (!service && IS_DEVELOPMENT) {
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
  const navigate = useNavigate();
  const coinFrom = TOKENS[0];
  const coinTo = TOKENS[1];
  const context: AddLiquidityMachineContext = {
    navigate,
    client,
    contract,
    coinFrom,
    coinTo,
    active: null,
    poolRatio: null,
    fromAmount: null,
    toAmount: null,
    poolInfo: null,
    poolPosition: null,
    poolShare: new Decimal(0),
    balances: [],
    liquidityPreview: liquidityPreviewEmpty,
    transactionCost: null,
  };
  const service = useInterpret(addLiquidityMachine, {
    context,
  });

  if (IS_DEVELOPMENT) {
    serviceMap.set("service", service);
  }

  useSubscriber<CoinQuantity[]>(
    AppEvents.updatedBalances,
    (data) => {
      service.send("SET_BALANCES", { data });
    },
    [service]
  );

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
