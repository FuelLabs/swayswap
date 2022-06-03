import { useSelector } from "@xstate/react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useWelcomeSteps, stepsSelectors } from "../hooks";

import { AnimatedPage } from "~/systems/Core";

type WelcomeStepProps = {
  id: number;
  children: ReactNode;
};

export function WelcomeStep({ id, children }: WelcomeStepProps) {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);

  if (current?.id < id) {
    return <Navigate to={`/welcome/${current.path}`} replace />;
  }

  return (
    <AnimatedPage>
      <div className="welcomeStep">{children}</div>
    </AnimatedPage>
  );
}
