import { useMachine } from "@xstate/react";
import type { ReactNode } from "react";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { InterpreterFrom, StateFrom } from "xstate";
import { assign, createMachine } from "xstate";

import { Pages } from "~/types";

const LOCALSTORAGE_KEY = "fuel--welcomeStep";
const STEPS = [
  { id: 0, path: Pages["welcome.createWallet"] },
  { id: 1, path: Pages["welcome.addFunds"] },
  { id: 2, path: Pages["welcome.done"] },
  { id: 3, path: null },
];

function getCurrent() {
  try {
    const curr = localStorage.getItem(LOCALSTORAGE_KEY);
    return curr ? JSON.parse(curr) : STEPS[0];
  } catch (_) {
    return STEPS[0];
  }
}

function setCurrent(id: number) {
  const current = STEPS[id];
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(current));
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
  path: string | null;
};

type MachineContext = {
  current: Step;
};

type MachineEvents = { type: "NEXT" } | { type: "SET_CURRENT"; value: number };

const welcomeStepsMachine = createMachine<MachineContext>({
  id: "welcomeSteps",
  initial: "init",
  schema: {
    context: {} as MachineContext,
    events: {} as MachineEvents,
  },
  context: {
    current: getCurrent(),
  },
  states: {
    init: {
      always: [
        {
          target: "creatingWallet",
          cond: (ctx) => ctx.current.id === 0,
        },
        {
          target: "addingFunds",
          cond: (ctx) => ctx.current.id === 1,
        },
        {
          target: "done",
          cond: (ctx) => ctx.current.id === 2,
        },
        {
          target: "finished",
        },
      ],
    },
    creatingWallet: {
      entry: [assignCurrent(0), "navigateTo"],
      on: {
        NEXT: {
          target: "addingFunds",
        },
      },
    },
    addingFunds: {
      entry: [assignCurrent(1), "navigateTo"],
      on: {
        NEXT: {
          target: "done",
        },
      },
    },
    done: {
      entry: [assignCurrent(2), "navigateTo"],
      on: {
        FINISH: {
          target: "finished",
        },
      },
    },
    finished: {
      entry: assignCurrent(3),
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
  const [state, send, service] = useMachine<Machine>(
    welcomeStepsMachine.withConfig({
      actions: {
        navigateTo: (context) => {
          if (context.current.id > 2) return;
          navigate?.(`/welcome/${context.current.path}`);
        },
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
