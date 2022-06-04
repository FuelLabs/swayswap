import { useSelector } from "@xstate/react";
import cx from "classnames";

import type { Step } from "../hooks";
import { stepsSelectors, useWelcomeSteps } from "../hooks";

function getClasses(id: number, current: Step) {
  return cx({ done: current.id > id, active: current.id === id });
}

export function StepsIndicator() {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);

  return (
    <ul className="stepsIndicator">
      <li className={getClasses(0, current)}>
        <span>Create wallet</span>
      </li>
      <li className={getClasses(1, current)}>
        <span>Add funds</span>
      </li>
      <li className={getClasses(2, current)}>
        <span>Done</span>
      </li>
    </ul>
  );
}
