import { Button } from "@fuel-ui/react";
import { useSelector } from "@xstate/react";

import { useWelcomeSteps } from "../hooks";

import { WelcomeImage } from "./WelcomeImage";
import { WelcomeStep } from "./WelcomeStep";

export const WelcomeConnect = () => {
  const { service, send } = useWelcomeSteps();
  const installWallet = useSelector(service, (s) => s.matches("installWallet"));

  return (
    <WelcomeStep>
      <WelcomeImage src="/illustrations/create-wallet.png" />
      <h2>Welcome to SwaySwap</h2>
      {installWallet ? (
        <>
          <p className="my-5">
            To get started you&apos;ll need to install
            <br /> the <b>Fuel wallet</b>. Click the button below to learn how
            to install. After you have installed come back to this page.
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
            onPress={() => send("CONNECT")}
          >
            Connect Wallet
          </Button>
        </>
      )}
    </WelcomeStep>
  );
};
