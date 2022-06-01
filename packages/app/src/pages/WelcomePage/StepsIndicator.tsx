import { useSelector } from "@xstate/react";
import cx from "classnames";

import { stepsSelectors, useWelcomeSteps } from "~/hooks/useWelcomeSteps";

export function StepsIndicator() {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);

  return (
    <ul className="stepsIndicator">
      <li className={cx({ done: current.id > 0, active: current.id === 0 })}>
        <span>Create wallet</span>
      </li>
      <li className={cx({ done: current.id > 1, active: current.id === 1 })}>
        <span>Add funds</span>
      </li>
      <li className={cx({ done: current.id > 2, active: current.id === 2 })}>
        <span>Done</span>
      </li>
    </ul>
  );
}
