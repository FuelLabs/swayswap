import { useState } from "react";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

import { Button, Link } from "~/systems/UI";

const DISCLAIMER_URL =
  "https://github.com/FuelLabs/swayswap/blob/master/docs/LEGAL_DISCLAIMER.md";

export function WelcomeTerms() {
  const { send } = useWelcomeSteps();
  const [agreement, setAgreement] = useState(false);

  function handleDone() {
    send("ACCEPT_AGREEMENT");
  }

  return (
    <WelcomeStep>
      <WelcomeImage src="/illustrations/done.png" />
      <p className="text-sm font-light italic my-5">
        This is running on the <b>Fuel test network</b>. No real funds are used.
        Demonstration purposes only.
      </p>
      <div className="flex justify-center mb-6">
        <label htmlFor="accept-agreement">
          <input
            aria-label="Accept the use agreement"
            id="accept-agreement"
            checked={agreement}
            onChange={(e) => {
              setAgreement(e.target.checked);
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
        isDisabled={!agreement}
        onPress={handleDone}
      >
        Get Swapping!
      </Button>
    </WelcomeStep>
  );
}
