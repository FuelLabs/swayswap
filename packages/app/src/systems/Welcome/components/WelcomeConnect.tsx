import { Button } from "@fuel-ui/react";
import { useMutation } from "react-query";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

import { useFuel } from "~/systems/Core/hooks/useFuel";

export const WelcomeConnect = () => {
  const { next } = useWelcomeSteps();
  const fuel = useFuel();

  const connectWalletMutation = useMutation(
    async () => {
      if (!fuel) {
        throw new Error(
          "Trying to connect wallet when fuel instance is not injected"
        );
      }
      await fuel.connect();
    },
    {
      onSuccess: () => {
        next();
      },
    }
  );

  function handleConnectWallet() {
    connectWalletMutation.mutate();
  }

  return (
    <WelcomeStep id={0}>
      <WelcomeImage src="/illustrations/create-wallet.png" />
      <h2>Welcome to SwaySwap</h2>
      {!fuel ? (
        <>
          <p className="my-5">
            To get started you&apos;ll need a wallet.
            <br />
            Click the button below to learn how to install and use the Fuel
            Wallet extension. After you have installed and setup your wallet
            come back to this page.
          </p>
          <a
            href="https://wallet.fuel.network/docs/install/"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="solid" size="lg" className="mt-5 mx-auto">
              Install Fuel Wallet
            </Button>
          </a>
        </>
      ) : (
        <>
          <p className="my-5">
            The wallet is installed!
            <br />
            Click the button below to connect your wallet to SwaySwap.
          </p>
          <Button
            variant="solid"
            size="lg"
            className="mt-5 mx-auto"
            onPress={handleConnectWallet}
          >
            Connect Wallet
          </Button>
        </>
      )}
    </WelcomeStep>
  );
};
