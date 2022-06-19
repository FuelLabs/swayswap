import { useWelcomeSteps } from "../hooks";

import { WelcomeStep } from "./WelcomeStep";

import { relativeUrl } from "~/systems/Core";
import { FaucetApp } from "~/systems/Faucet";

export function AddFunds() {
  const { next } = useWelcomeSteps();
  return (
    <WelcomeStep id={1}>
      <img src={relativeUrl("/illustrations/add-funds.png")} />
      <h2>Add some test ETH to your wallet</h2>
      <p>
        To get started you&apos;ll need some funds.<br />
        Click "Give me ETH" below to get some from the faucet.
      </p>
      <FaucetApp onSuccess={next} />
    </WelcomeStep>
  );
}
