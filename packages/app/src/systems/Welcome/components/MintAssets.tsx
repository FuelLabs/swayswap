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
      <h2>Add some test Assets to your wallet</h2>
      <p className="my-5">
        To get started you&apos;ll need some funds.
        <br />
        Click &ldquo;Mint Assets&rdquo; below to mint some test sETH and DAI
        tokens that are the tokens used on SwaySwap.
      </p>
      <Button className="mt-5 mx-auto" onPress={handleAddAssets}>
        Mint assets
      </Button>
    </WelcomeStep>
  );
}
