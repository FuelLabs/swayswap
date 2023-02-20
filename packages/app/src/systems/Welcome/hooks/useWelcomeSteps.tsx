import { useMachine } from "@xstate/react";
import type { Wallet } from "fuels";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { InterpreterFrom, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { useWallet } from "~/systems/Core";
import type { Maybe } from "~/types";
import { Pages } from "~/types";

export const LOCALSTORAGE_WELCOME_KEY = "fuel--welcomeStep";
export const LOCALSTORAGE_AGREEMENT_KEY = "fuel--agreement";

export const STEPS = [
  { id: 0, path: Pages.connect },
  { id: 1, path: Pages["welcome.done"] },
  { id: 2, path: null },
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
  wallet?: Maybe<Wallet>;
};

type MachineEvents = { type: "NEXT" } | { type: "SET_CURRENT"; value: number };

const welcomeStepsMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QHcwBsDGB7AtmAygC5gAOsAdAJYB2lhAxANoAMAuoqCVrHZVtRxAAPRAEYAzAFZyAFgCcCgOyTRc8QDZF65gCYANCACeiGeLnkAHDouiVOxXNWTxigL6uDqTLgLEyVWgZGUXYkEC4eQj4BMJEECWl5JRU1TW19IzE5HXJmRRtxC3EE9XUZd090bDwiUgoaOiYdUM5uXn5BOITZBTllVQ0tXQNjBHEZRUtrURlJPtEHdQt1CpAvat86gMbGcRbwtqiO2LEpHuSBtOHMsbUpmxllnUl5dVFV9Z9a-2xqajAMFFqFAAOoAQzQaDADAAcgBRAAaABUWPsIu0YqA4vJpFpJJJFIpbHJHqVFCMxBZzFYCopiqIdAtsh8ql8-BQIPwwPQAIIAYT5cIACkiAPo8gDiACU4XCALJwmEotiCdFHTHCRBzGTkHRJTRUuZ9CkIGzkSTMS3MUw6cR5Kws7w1dnkTn-egAMQAkjCvfgABKo1WHaKdRAFciiBaidTicSMtTZE2MizkOTOGZRmTMOPFNyrahYCBwQSfZ11YORUMnBAAWnUJvruStLdbeUdG2+9UClYxYYQMgyo3G5myDxeUmsFg7bK2v3+gJooIhUMIvfV-btOTjc2eMnUjijJts4nuElUVlEFnx5Q8a1Z5f8brA6+rWMQ2nUaaWdL6sfyObHlYaYZlINgSJa053mWmz+AAZg0sAABaQK+xzvggajSDG2YMn+khWEOiCMpM6bFIM2TMLYEzuO4QA */
  createMachine<MachineContext>({
    id: "welcomeSteps",
    predictableActionArguments: true,
    initial: "init",
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvents,
    },
    context: {
      current: getCurrent(),
      acceptAgreement: getAgreement(),
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
            target: "done",
            cond: (ctx) =>
              ctx.current.id === 1 ||
              (ctx.current.id >= 1 && !ctx.acceptAgreement),
          },
          {
            cond: (ctx) => ctx.current.id === 2 && ctx.acceptAgreement,
            target: "finished",
          },
        ],
      },
      connectingWallet: {
        entry: [assignCurrent(0), "navigateTo"],
        on: {
          NEXT: {
            target: "done",
          },
        },
      },
      done: {
        entry: [assignCurrent(1), "navigateTo"],
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
        entry: assignCurrent(2),
        type: "final",
      },
    },
  });

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
  const { wallet } = useWallet();

  const [state, send, service] = useMachine<Machine>(() =>
    welcomeStepsMachine
      .withContext({
        wallet,
        current: getCurrent(),
        acceptAgreement: getAgreement(),
      })
      .withConfig({
        actions: {
          navigateTo: (context) => {
            if (context.current.id > 1) return;
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
