import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

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
      <WelcomeImage src="/illustrations/done.png" />
      <h2>Wallet Created!</h2>
      <p className="my-5">
        Now you&apos;re ready to swap and pool <b>test assets</b> using Fuel:
        the fastest modular execution layer.
      </p>
      <div className="flex justify-center mb-6">
        <label htmlFor="accept-agreement">
          <input
            aria-label="Accept the use agreement"
            id="accept-agreement"
            checked={state.context.acceptAgreement}
            onChange={(e) => {
              send("ACCEPT_AGREEMENT", {
                value: e.target.checked,
              });
            }}
            className="h-5 w-5 mr-1 cursor-pointer"
            type="checkbox"
          />{" "}
          I have read and understand the{" "}
          <Link isExternal href={DISCLAIMER_URL}>
            legal disclaimer
          </Link>
          .
        </label>
      </div>
      <Button
        size="lg"
        variant="primary"
        className="mt-5 mx-auto"
        isDisabled={!state.context.acceptAgreement}
        onPress={handleDone}
      >
        Get Swapping!
      </Button>
    </WelcomeStep>
  );
}
