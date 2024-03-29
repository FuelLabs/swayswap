import { Button } from "@fuel-ui/react";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

export function AddAssets() {
  const { send, state } = useWelcomeSteps();

  function handleAddAssets() {
    send("ADD_ASSETS");
  }

  return (
    <WelcomeStep>
      <WelcomeImage src="/illustrations/add-funds.png" />
      <h2>Add SwaySwap assets</h2>
      <p className="my-5">
        To see the SwaySwap assets in your wallet we need to add them.
        <br />
        Click &ldquo;Add Assets&rdquo; below and approve it.
      </p>
      <Button
        className="mt-5 mx-auto"
        onPress={handleAddAssets}
        isLoading={state.hasTag("isLoading")}
      >
        Add Assets
      </Button>
    </WelcomeStep>
  );
}
