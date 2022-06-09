import { useWelcomeSteps } from "../hooks";

import { WelcomeStep } from "./WelcomeStep";

import { FaucetApp } from "~/systems/Faucet";

export function AddFunds() {
  const { next } = useWelcomeSteps();
  return (
    <WelcomeStep id={1}>
      <img src="/illustrations/add-funds.png" />
      <h2>Add some ETH to your wallet</h2>
      <p>
        To get started you&apos;ll need a wallet, <br />
        click bellow to generate one
      </p>
      <FaucetApp onSuccess={next} />
    </WelcomeStep>
  );
}
