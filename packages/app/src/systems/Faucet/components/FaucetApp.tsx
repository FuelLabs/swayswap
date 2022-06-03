import cx from "classnames";
import ReCAPTCHA from "react-google-recaptcha";

import { useCaptcha, useFaucet } from "../hooks";

import { Button, Spinner } from "~/systems/UI";

type FaucetAppProps = {
  onSuccess?: () => void;
};

export function FaucetApp({ onSuccess }: FaucetAppProps) {
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
              Sorry, something wrong happened here, please reload your this
              page!
            </div>
          )}
        </div>
      )}
      <Button
        size="lg"
        variant="primary"
        className="mt-5"
        isLoading={faucet.mutation.isLoading}
        onPress={() => faucet.handleFaucet(captcha.value)}
        {...(captcha.needToShow && { isDisabled: !captcha.value })}
      >
        Give me ETH
      </Button>
    </>
  );
}
