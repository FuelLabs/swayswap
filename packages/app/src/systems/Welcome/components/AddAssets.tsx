import { Button } from "@fuel-ui/react";
import { useSelector } from "@xstate/react";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

import { FaucetApp } from "~/systems/Faucet";

export function AddFunds() {
  const { next, state, service } = useWelcomeSteps();
  const isFetchingBalance = useSelector(service, (args) =>
    args.matches("fecthingBalance")
  );
  const enableFacuet = useSelector(service, (args) =>
    args.matches("fauceting.faucet")
  );

  return (
    <WelcomeStep id={2}>
      <WelcomeImage src="/illustrations/add-funds.png" />
      <h2>Add pool assets to your wallet</h2>
      <p>
        To get started you&apos;ll need some funds.
        <br />
        Click &ldquo;Mint Assets&rdquo; below to get some from the token
        contracts.
      </p>
      {enableFacuet ? (
        <FaucetApp onSuccess={next} isLoading={isFetchingBalance} />
      ) : (
        <Button onPress={next}>Mint assets</Button>
      )}
    </WelcomeStep>
  );
}
