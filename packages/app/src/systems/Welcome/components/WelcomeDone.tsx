import { useNavigate } from "react-router-dom";

import { useWelcomeSteps } from "../hooks";

import { WelcomeStep } from "./WelcomeStep";

import { relativeUrl } from "~/systems/Core";
import { Button } from "~/systems/UI";

export function WelcomeDone() {
  const navigate = useNavigate();
  const { send } = useWelcomeSteps();

  function handleDone() {
    navigate("/swap");
    send("FINISH");
  }

  return (
    <WelcomeStep id={2}>
      <img src={relativeUrl("/illustrations/done.png")} width="70%" />
      <h2>Done, congrats!</h2>
      <p className="my-5">
        Now you are done to swap your coins using the fatest modular execution
        layer
      </p>
      <Button size="lg" variant="primary" onPress={handleDone}>
        Go to Swap
      </Button>
    </WelcomeStep>
  );
}
