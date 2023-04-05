import type { ReactNode } from "react";

import { AnimatedPage } from "~/systems/Core";

type WelcomeStepProps = {
  children: ReactNode;
};

export function WelcomeStep({ children }: WelcomeStepProps) {
  return (
    <AnimatedPage>
      <div className="welcomeStep">{children}</div>
    </AnimatedPage>
  );
}
