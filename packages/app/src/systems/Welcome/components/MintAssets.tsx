import { Button } from "@fuel-ui/react";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

export function MintAssets() {
  const { service } = useWelcomeSteps();

  function handleAddAssets() {
    service.send("ADD_ASSETS");
  }

  return (
    <WelcomeStep id={3}>
      <WelcomeImage src="/illustrations/add-funds.png" />
      <h2>Add pool assets to your wallet</h2>
      <p>
        To get started you&apos;ll need some funds.
        <br />
        Click &ldquo;Mint Assets&rdquo; below to get some from the token
        contracts.
      </p>
      <Button onPress={handleAddAssets}>Mint assets</Button>
    </WelcomeStep>
  );
}
