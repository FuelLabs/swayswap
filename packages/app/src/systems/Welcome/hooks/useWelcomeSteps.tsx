import { useInterpret, useSelector } from "@xstate/react";
import type { ReactNode } from "react";
import { useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import type { StateFrom } from "xstate";

import type {
  WelcomeMachine,
  WelcomeMachineService,
  WelcomeMachineState,
} from "../machines";
import { welcomeMachine } from "../machines";

import { LocalStorageKey } from "~/systems/Core";
import { useFuel } from "~/systems/Core/hooks/useFuel";
import type { Maybe } from "~/types";
import { Pages } from "~/types";

export const LOCALSTORAGE_AGREEMENT_KEY = `${LocalStorageKey}fuel--agreement`;

export function getAgreement() {
  return localStorage.getItem(LOCALSTORAGE_AGREEMENT_KEY) === "true";
}

export function setAgreement(accept: boolean) {
  localStorage.setItem(LOCALSTORAGE_AGREEMENT_KEY, String(accept));
}

// ----------------------------------------------------------------------------
// State Machine
// ----------------------------------------------------------------------------

export type Step = {
  id: number;
  path: Maybe<string>;
};

type WelcomeStepsProviderProps = {
  children: ReactNode;
};

export const stepsSelectors = {
  current(state: StateFrom<WelcomeMachine>) {
    return state.context.current;
  },
  isFinished(state: StateFrom<WelcomeMachine>) {
    return state.matches("finished");
  },
};

type Context = {
  state: WelcomeMachineState;
  send: WelcomeMachineService["send"];
  service: WelcomeMachineService;
  next: () => void;
};

const ctx = createContext<Context>({} as Context);

export function WelcomeStepsProvider({ children }: WelcomeStepsProviderProps) {
  const navigate = useNavigate();
  const { fuel } = useFuel();
  const service = useInterpret(() =>
    welcomeMachine.withConfig({
      actions: {
        navigateTo: (context) => {
          if (!context.current.path) {
            navigate(Pages.swap);
            return;
          }
          navigate(`/welcome/${context.current.path}`, { replace: true });
        },
      },
    })
  );
  const send = service.send;
  const state = useSelector(service, (s) => s);

  useEffect(() => {
    if (fuel) {
      service.send({
        type: "WALLET_DETECTED",
        value: fuel,
      });
    }
  }, [fuel]);

  function next() {
    send("NEXT");
  }

  return (
    <ctx.Provider value={{ service, state, send, next }}>
      {children}
    </ctx.Provider>
  );
}

export function useWelcomeSteps() {
  return useContext(ctx);
}
