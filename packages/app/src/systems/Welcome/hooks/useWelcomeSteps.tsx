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
  { id: 0, path: Pages["welcome.done"] },
  { id: 1, path: null },
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
  return assign({ current: (_) => setCurrent(id) });
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

const welcomeStepsMachine = createMachine<MachineContext>({
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
          target: "finished",
          cond: (ctx) => Boolean(ctx.wallet && !ctx.current.id),
        },
        {
          target: "done",
          cond: (ctx) =>
            ctx.current.id === 0 ||
            (ctx.current.id >= 0 && !ctx.acceptAgreement),
        },
        {
          cond: (ctx) => ctx.current.id === 1 && ctx.acceptAgreement,
          target: "finished",
        },
      ],
    },
    done: {
      entry: [assignCurrent(0), "navigateTo"],
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
      entry: assignCurrent(1),
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
            if (context.current.id > 0) return;
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
