import { useWelcomeSteps } from "../hooks";

import { WelcomeStep } from "./WelcomeStep";

import { relativeUrl } from "~/systems/Core";
import { Button, Link } from "~/systems/UI";

const DISCLAIMER_URL =
  "https://github.com/FuelLabs/swayswap/blob/master/docs/LEGAL_DISCLAIMER.md";

export function WelcomeDone() {
  const { send, state } = useWelcomeSteps();

  function handleDone() {
    send("FINISH");
  }

  return (
    <WelcomeStep id={2}>
      <img src={relativeUrl("/illustrations/done.png")} width="70%" />
      <h2>Wallet Created!</h2>
      <p className="my-5">
        Now you&apos;re ready to swap and pool <b>test assets</b> using Fuel:
        the fastest modular execution layer.
      </p>
      <div className="flex justify-center items-center mb-6">
        <input
          checked={state.context.acceptAgreement}
          onChange={(e) => {
            send("ACCEPT_AGREEMENT", {
              value: e.target.checked,
            });
          }}
          className="h-5 w-5 mr-3 cursor-pointer"
          type="checkbox"
        />
        <span>
          {" "}
          I agree to the{" "}
          <Link isExternal href={DISCLAIMER_URL}>
            (legal disclaimer)
          </Link>
          .
        </span>
      </div>
      <Button
        size="lg"
        variant="primary"
        isDisabled={!state.context.acceptAgreement}
        onPress={handleDone}
      >
        Get Swapping!
      </Button>
    </WelcomeStep>
  );
}
