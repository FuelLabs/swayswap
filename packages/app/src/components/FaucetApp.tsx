import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "./Button";
import { Spinner } from "./Spinner";

import { FUEL_FAUCET_URL, RECAPTCHA_KEY } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";

type FaucetAppProps = {
  onSuccess?: () => void;
};

export function FaucetApp({ onSuccess }: FaucetAppProps) {
  const [faucetCaptcha, setFaucetCaptcha] = useState<string | null>(null);

  const faucet = useFaucet({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return (
    <>
      {RECAPTCHA_KEY && (
        <div className="faucetCaptcha">
          <div className="faucetCaptcha--front">
            <ReCAPTCHA
              theme="dark"
              sitekey={RECAPTCHA_KEY}
              onChange={setFaucetCaptcha}
            />
          </div>
          <div className="faucetCaptcha--back">
            <Spinner />
          </div>
        </div>
      )}
      <Button
        size="lg"
        variant="primary"
        className="mt-5"
        isDisabled={Boolean(FUEL_FAUCET_URL) && !faucetCaptcha}
        isLoading={faucet.isLoading}
        onPress={() => faucet.handleFaucet(faucetCaptcha)}
      >
        Give me ETH
      </Button>
    </>
  );
}
