import { useMutation } from "react-query";

import { useWelcomeSteps } from "../hooks";

import { WelcomeStep } from "./WelcomeStep";

import illustration from "~/assets/illustrations/create-wallet.png";
import { useAppContext } from "~/systems/Core";
import { Button } from "~/systems/UI";

export function CreateWallet() {
  const { createWallet } = useAppContext();
  const { next } = useWelcomeSteps();

  const createWalletMutation = useMutation(async () => createWallet(), {
    onSuccess: () => {
      next();
    },
  });

  function handleCreateWallet() {
    createWalletMutation.mutate();
  }

  return (
    <WelcomeStep id={0}>
      <img src={illustration} />
      <h2>Welcome to SwaySwap</h2>
      <p className="my-5">
        To get started you&apos;ll need a wallet, <br />
        click below to generate one.
      </p>
      <Button
        variant="primary"
        size="lg"
        onPress={handleCreateWallet}
        aria-label="welcome-create-wallet-btn"
      >
        Create wallet
      </Button>
    </WelcomeStep>
  );
}
