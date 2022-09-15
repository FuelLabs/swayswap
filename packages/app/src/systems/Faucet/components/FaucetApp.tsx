import cx from "classnames";
import ReCAPTCHA from "react-google-recaptcha";

import { useCaptcha, useFaucet } from "../hooks";

import { Button, Spinner } from "~/systems/UI";

type FaucetAppProps = {
  isButtonFull?: boolean;
  onSuccess?: () => void;
};

export function FaucetApp({ isButtonFull, onSuccess }: FaucetAppProps) {
  const faucet = useFaucet({ onSuccess });
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
            <ReCAPTCHA {...captcha.getProps()} />
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
        isLoading={faucet.mutation.isLoading}
        onPress={() => faucet.handleFaucet(captcha.value)}
        {...(captcha.needToShow && { isDisabled: !captcha.value })}
      >
        Give me ETH
      </Button>
    </>
  );
}
