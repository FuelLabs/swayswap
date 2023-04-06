import cx from "classnames";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { useCaptcha, useFaucet } from "../hooks";

import { Button, Spinner } from "~/systems/UI";

type FaucetAppProps = {
  isButtonFull?: boolean;
  isLoading?: boolean;
  onSuccess?: () => void;
};

export function FaucetApp({
  isButtonFull,
  isLoading,
  onSuccess,
}: FaucetAppProps) {
  // We need to re-render the captcha widget when it faucet
  // endpoint fails and need to retrigger the captcha.
  const [version, setVersion] = useState(0);
  const faucet = useFaucet({
    onSuccess,
    onError: () => setVersion(version + 1),
  });
  const captcha = useCaptcha();

  return (
    <>
      {captcha.needToShow && (
        <div className="faucetCaptcha">
          {captcha.isLoading && (
            <div className="faucetCaptcha--loading">
              <Spinner />
              Loading Captcha...
            </div>
          )}
          <div
            className={cx("faucetCaptcha--widget", {
              "is-hidden": captcha.isLoading,
            })}
          >
            <ReCAPTCHA key={version} {...captcha.getProps()} />
          </div>
          {captcha.isFailed && (
            <div className="faucetCaptcha--error">
              Sorry, something went wrong here. Please reload this page!
            </div>
          )}
        </div>
      )}
      <Button
        isFull={isButtonFull}
        size="lg"
        variant="primary"
        className="mt-5 mx-auto"
        isLoading={isLoading || faucet.mutation.isLoading}
        onPress={() => faucet.handleFaucet(captcha.value)}
        {...(captcha.needToShow && { isDisabled: !captcha.value })}
      >
        Give me ETH
      </Button>
    </>
  );
}
