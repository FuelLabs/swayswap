import { useMachine } from "@xstate/react";
import type { BN } from "fuels";
import { bn } from "fuels";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { InterpreterFrom, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import {
  handleError,
  ETH,
  DAI,
  ETH_DAI,
  LocalStorageKey,
} from "~/systems/Core";
import { getOverrides } from "~/systems/Core/utils/gas";
import type { Maybe } from "~/types";
import { Pages } from "~/types";
import { TokenContractAbi__factory } from "~/types/contracts";

export const LOCALSTORAGE_WELCOME_KEY = `${LocalStorageKey}fuel--welcomeStep`;
export const LOCALSTORAGE_AGREEMENT_KEY = `${LocalStorageKey}fuel--agreement`;

export const STEPS = [
  { id: 0, path: Pages.connect },
  { id: 1, path: Pages.faucet },
  { id: 2, path: Pages.addAssets },
  { id: 3, path: Pages.mint },
  { id: 4, path: Pages["welcome.done"] },
  { id: 5, path: null },
];

export function getAgreement() {
  return localStorage.getItem(LOCALSTORAGE_AGREEMENT_KEY) === "true";
}

export function setAgreement(accept: boolean) {
  localStorage.setItem(LOCALSTORAGE_AGREEMENT_KEY, String(accept));
}

export function getCurrent() {
  try {
    const curr = localStorage.getItem(LOCALSTORAGE_WELCOME_KEY);

    return curr ? JSON.parse(curr) : STEPS[0];
  } catch (_) {
    return STEPS[0];
  }
}

export function setCurrent(id: number) {
  const current = STEPS[id];
  localStorage.setItem(LOCALSTORAGE_WELCOME_KEY, JSON.stringify(current));
  return current;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignCurrent(id: number): any {
  return assign({
    current: (_) => {
      return setCurrent(id);
    },
  });
}

// ----------------------------------------------------------------------------
// State Machine
// ----------------------------------------------------------------------------

export type Step = {
  id: number;
  path: Maybe<string>;
};

type MachineContext = {
  current: Step;
  acceptAgreement: boolean;
  balance: BN;
};

type MachineEvents = { type: "NEXT" } | { type: "SET_CURRENT"; value: number };

type MachineServices = {
  fetchBalance: {
    data: Array<BN>;
  };
};

const welcomeStepsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcwBsDGB7AtmAygC5gAOsAdAJYB2lhAxANoAMAuoqCVrHZVtRxAAPRAEYAzAFZyAFgCcCgOyTRc8QDZF65gCYANCACeiGeLnkAHDouiVOxXNWTxigL6uDqTLgLEyVWgZGUXYkEC4eQj4BMJEECWl5JRU1TW19IzE5HXJmRRtxC3EE9XUZd090bDwiUgoaOiYdUM5uXn5BOITZBTllVQ0tXQNjBHEZRUtrURlJPtEHdQt1CpAvat86gMbGcRbwtqiO2LEpHuSBtOHMsbUpmxllnUl5dVFV9Z9a-2xqajAMFFqFAAOoAQzQaDADAAcgBRAAaABUWPsIu0YqA4vJpFpJJJFIpbHJHqVFCMxBZzFYCopiqIdAtsh8ql8-BQIPwwPQAIIAYT5cIACkiAPo8gDiACU4XCALJwmEotiCdFHTHCRBzGTkHRJTRUuZ9CkIGzkSTMS3MUw6cR5Kws7w1dnkTn-egAMQAkjCvfgABKo1WHaKdRAFciiBaidTicSMtTZE2MizkOTOGZRmTMOPFNyrahYCBwQSfZ11YORUMnBAAWnUJvruStLdbeUdG2+9UClYxYYQMgyo3G5myDxeUmsFg7bK2v3+gJooIhUMIvfV-btOTjc2eMnUjijJts4nuElUVlEFnx5Q8a1Z5f8brA6+rWMQ2nUaaWdL6sfyObHlYaYZlINgSJa053mWmz+AAZg0sAABaQK+xzvggajSDG2YMn+khWEOiCMpM6bFIM2TMLYEzuO4QA */
  createMachine<MachineContext>(
    {
      id: "welcomeSteps",
      predictableActionArguments: true,
      initial: "init",
      schema: {
        context: {} as MachineContext,
        events: {} as MachineEvents,
        services: {} as MachineServices,
      },
      context: {
        current: getCurrent(),
        acceptAgreement: getAgreement(),
        balance: bn(),
      },
      states: {
        init: {
          always: [
            /**
             * This is mainly used for tests purposes
             */
            {
              target: "connectingWallet",
              cond: (ctx) => {
                return ctx.current.id === 0;
              },
            },
            {
              target: "fauceting",
              cond: (ctx) => {
                return ctx.current.id === 1;
              },
            },
            {
              target: "addingAssets",
              cond: (ctx) => {
                return ctx.current.id === 2;
              },
            },
            {
              target: "mintingAssets",
              cond: (ctx) => {
                return ctx.current.id === 3;
              },
            },
            {
              target: "done",
              cond: (ctx) =>
                ctx.current.id === 4 ||
                (ctx.current.id >= 4 && !ctx.acceptAgreement),
            },
            {
              cond: (ctx) => ctx.current.id === 5 && ctx.acceptAgreement,
              target: "finished",
            },
          ],
        },
        connectingWallet: {
          entry: [assignCurrent(0), "navigateTo"],
          on: {
            NEXT: {
              target: "fecthingBalance",
            },
          },
        },
        fecthingBalance: {
          invoke: {
            src: "fetchBalance",
            onDone: [
              {
                cond: "hasNoBalance",
                actions: ["assignBalances"],
                target: "fauceting",
              },
              {
                actions: ["assignBalances"],
                target: "addingAssets",
              },
            ],
            onError: {
              actions: ["toastErrorMessage"],
            },
          },
        },
        fauceting: {
          entry: [assignCurrent(1), "navigateTo"],
          on: {
            NEXT: {
              target: "#welcomeSteps.addingAssets",
            },
          },
        },
        addingAssets: {
          entry: [assignCurrent(2), "navigateTo"],
          initial: "addAssetsToWallet",
          states: {
            addAssetsToWallet: {
              on: {
                ADD_ASSETS: {
                  target: "addingAssets",
                },
              },
            },
            addingAssets: {
              tags: ["isLoadingMint"],
              invoke: {
                src: "addAssets",
                onDone: "#welcomeSteps.mintingAssets",
                onError: {
                  actions: ["toastErrorMessage"],
                  target: "addAssetsToWallet",
                },
              },
            },
          },
        },
        mintingAssets: {
          entry: [assignCurrent(3), "navigateTo"],
          initial: "mintAssets",
          states: {
            mintAssets: {
              on: {
                ADD_ASSETS: {
                  target: "mintingAssets",
                },
              },
            },
            mintingAssets: {
              tags: ["isLoadingMint"],
              invoke: {
                src: "mintAssets",
                onDone: "#welcomeSteps.done",
                onError: {
                  actions: ["toastErrorMessage"],
                  target: "mintAssets",
                },
              },
            },
          },
        },
        done: {
          entry: [assignCurrent(4), "navigateTo"],
          on: {
            ACCEPT_AGREEMENT: {
              actions: ["acceptAgreement"],
            },
            FINISH: {
              target: "finished",
            },
          },
        },
        finished: {
          entry: assignCurrent(5),
          type: "final",
        },
      },
    },
    {
      actions: {
        assignBalances: assign({
          balance: (_, ev) => ev.data,
        }),
        toastErrorMessage(_, ev) {
          handleError(ev.data);
          // eslint-disable-next-line no-console
          console.error(ev.data);
        },
      },
      guards: {
        hasNoBalance: (_, ev) => {
          return bn(ev.data).isZero();
        },
      },
      services: {
        fetchBalance: async () => {
          if (!window.fuel) {
            throw new Error("Fuel Wallet is not detected!");
          }
          const [address] = await window.fuel.accounts();
          if (!address) {
            throw Error("No account found!");
          }
          const wallet = await window.fuel.getWallet(address);
          return wallet.getBalance();
        },
        addAssets: async () => {
          if (!window.fuel) {
            throw new Error("Fuel Wallet is not detected!");
          }
          const assetsOnWallet = await window.fuel.assets();
          const assetsOnWalletIds = assetsOnWallet.map((a) => a.assetId);
          const assetsToAddToWallet = [
            {
              assetId: ETH.assetId,
              name: "sEther",
              symbol: "sETH",
              imageUrl: ETH.img,
              isCustom: true,
            },
            {
              assetId: DAI.assetId,
              name: "Dai",
              symbol: "Dai",
              imageUrl: DAI.img,
              isCustom: true,
            },
            {
              assetId: ETH_DAI.assetId,
              name: ETH_DAI.name,
              symbol: ETH_DAI.symbol,
              imageUrl: ETH_DAI.img,
              isCustom: true,
            },
          ];
          const assets = assetsToAddToWallet.filter(
            (a) => !assetsOnWalletIds.includes(a.assetId)
          );
          if (assets.length !== 0) {
            await window.fuel.addAssets(assets);
          }
        },
        mintAssets: async () => {
          if (!window.fuel) {
            throw new Error("Fuel Wallet is not detected!");
          }
          const [address] = await window.fuel.accounts();
          if (!address) {
            throw Error("No account found!");
          }
          const wallet = await window.fuel.getWallet(address);
          const token1 = TokenContractAbi__factory.connect(ETH.assetId, wallet);
          const token2 = TokenContractAbi__factory.connect(DAI.assetId, wallet);
          const calls = [];

          const addressId = {
            value: wallet.address.toHexString(),
          };
          const { value: hasMint1 } = await token1.functions
            .has_mint(addressId)
            .get();
          if (!hasMint1) {
            calls.push(token1.functions.mint());
          }
          const { value: hasMint2 } = await token2.functions
            .has_mint(addressId)
            .get();
          if (!hasMint2) {
            calls.push(token2.functions.mint());
          }

          if (calls.length === 0) {
            return;
          }

          await token1.multiCall(calls).txParams(getOverrides()).call();
        },
      },
    }
  );

// ----------------------------------------------------------------------------
// Context & Provider
// ----------------------------------------------------------------------------

type Machine = typeof welcomeStepsMachine;
type Service = InterpreterFrom<Machine>;
type Context = {
  state: StateFrom<Machine>;
  send: Service["send"];
  service: Service;
  next: () => void;
};
type WelcomeStepsProviderProps = {
  children: ReactNode;
};

export const stepsSelectors = {
  current(state: StateFrom<Machine>) {
    return state.context.current;
  },
  isFinished(state: StateFrom<Machine>) {
    return state.matches("finished");
  },
};

const ctx = createContext<Context>({} as Context);
export function StepsProvider({ children }: WelcomeStepsProviderProps) {
  const navigate = useNavigate();

  const [state, send, service] = useMachine<Machine>(() =>
    welcomeStepsMachine
      .withContext({
        current: getCurrent(),
        acceptAgreement: getAgreement(),
        balance: bn(),
      })
      .withConfig({
        actions: {
          navigateTo: (context) => {
            if (context.current.id > 4) return;
            navigate(`/welcome/${context.current.path}`);
          },
          acceptAgreement: assign((context, event) => {
            setAgreement(event.value);
            return {
              ...context,
              acceptAgreement: event.value,
            };
          }),
        },
      })
  );

  function next() {
    send("NEXT");
  }

  return (
    <ctx.Provider value={{ state, send, service, next }}>
      {children}
    </ctx.Provider>
  );
}

export function useWelcomeSteps() {
  return useContext(ctx);
}
