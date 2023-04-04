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
        <span>Connect Wallet</span>
      </li>
      <li className={getClasses(1, current)}>
        <span>Faucet</span>
      </li>
      <li className={getClasses(2, current)}>
        <span>Add Assets</span>
      </li>
      <li className={getClasses(3, current)}>
        <span>Mint Assets</span>
      </li>
      <li className={getClasses(4, current)}>
        <span>Done</span>
      </li>
    </ul>
  );
}
