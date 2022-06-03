import { useMutation } from "react-query";

import { WelcomeStep } from "./WelcomeStep";

import { Button } from "~/components/Button";
import { useAppContext } from "~/context/AppContext";
import { useWelcomeSteps } from "~/hooks/useWelcomeSteps";

export default function CreateWallet() {
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
      <img src="/illustrations/create-wallet.png" />
      <h2>Welcome to SwaySwap</h2>
      <p className="my-5">
        To get started you&apos;ll need a wallet, <br />
        click below to generate one.
      </p>
      <Button
        variant="primary"
        size="lg"
        onPress={handleCreateWallet}
        data-testid="createWalletBtn"
      >
        Create wallet
      </Button>
    </WelcomeStep>
  );
}
