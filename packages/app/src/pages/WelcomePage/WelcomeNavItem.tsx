import { useSelector } from "@xstate/react";
import cx from "classnames";

import { stepsSelectors, useWelcomeSteps } from "~/hooks/useWelcomeSteps";

type SidebarItemProps = {
  id: number;
  label: string;
};

export function WelcomeNavItem({ id, label }: SidebarItemProps) {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);
  const isActive = id === current?.id;
  const isDone = id < current?.id;
  const isDisabled = id > current?.id;

  return (
    <div
      aria-label={label}
      aria-disabled={isDisabled}
      className={cx("welcomeNavItem", {
        done: isDone,
        active: isActive,
        disabled: isDisabled,
      })}
    >
      <span className="bullet" />
      <span className="label">{label}</span>
    </div>
  );
}
