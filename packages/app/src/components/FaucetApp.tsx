import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "./Button";
import { Spinner } from "./Spinner";

import { RECAPTCHA_SITE_KEY, ENABLE_FAUCET_API } from "~/config";
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
      {ENABLE_FAUCET_API && (
        <div className="faucetCaptcha">
          <div className="faucetCaptcha--front">
            <ReCAPTCHA
              theme="dark"
              sitekey={RECAPTCHA_SITE_KEY}
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
        isDisabled={ENABLE_FAUCET_API && !faucetCaptcha}
        isLoading={faucet.isLoading}
        onPress={() =>
          ENABLE_FAUCET_API
            ? faucet.handleFaucet(faucetCaptcha)
            : faucet.directFaucet()
        }
      >
        Give me ETH
      </Button>
    </>
  );
}
