import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

import { FaucetApp } from "~/systems/Faucet";

export function AddFunds() {
  const { next } = useWelcomeSteps();
  return (
    <WelcomeStep id={1}>
      <WelcomeImage src="/illustrations/add-funds.png" />
      <h2>Add some test ETH to your wallet</h2>
      <p>
        To get started you&apos;ll need some funds.
        <br />
        Click &ldquo;Give me ETH&rdquo; below to get some from the faucet.
      </p>
      <FaucetApp onSuccess={next} />
    </WelcomeStep>
  );
}
