import { useNavigate } from "react-router-dom";

import { WelcomeStep } from "./WelcomeStep";

import { Button } from "~/components/Button";
import { useWelcomeSteps } from "~/hooks/useWelcomeSteps";

export default function WelcomeDone() {
  const navigate = useNavigate();
  const { send } = useWelcomeSteps();

  function handleDone() {
    navigate("/swap");
    send("FINISH");
  }

  return (
    <WelcomeStep id={2}>
      <img src="/illustrations/done.png" width="70%" />
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
