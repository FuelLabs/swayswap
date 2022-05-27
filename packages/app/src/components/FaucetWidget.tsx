import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";
import { Popover, usePopover } from "./Popover";

import { RECAPTCHA_SITE_KEY } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";
import { useUserInfo } from "~/hooks/useUserInfo";

export function FaucetWidget() {
  const [userInfo, setUserInfo] = useUserInfo();
  const [faucetCaptcha, setFaucetCaptcha] = useState<string | null>(null);
  const dialog = useDialog();

  const popover = usePopover({
    offset: 55,
    crossOffset: 140,
  });

  const faucet = useFaucet({
    onSuccess: () => {
      if (userInfo.isNew) setUserInfo({ isNew: false });
      dialog.close();
    },
  });

  useEffect(() => {
    if (userInfo.isNew) {
      popover.open();
    }
  }, [userInfo.isNew]);

  return (
    <div className="faucetWidget">
      <Button {...dialog.openButtonProps} size="md">
        <FaFaucet />
        Faucet
      </Button>
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content className="faucetWidget--dialog">
          <Card>
            <Card.Title>
              <FaFaucet className="text-primary-500" /> Faucet
            </Card.Title>
            {userInfo.isNew ? (
              <div>
                <p>
                  Since is your first access, you need to have some funds in
                  your wallet.
                </p>
                <p className="mt-2">Click the button below to mint 0.5 ETH.</p>
              </div>
            ) : (
              <div>Click the button below to mint 0.5 ETH to your wallet.</div>
            )}
            <div className="mt-4 mx-6 flex items-center justify-center">
              <ReCAPTCHA
                theme="dark"
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={setFaucetCaptcha}
              />
            </div>
            <Button
              size="md"
              variant="primary"
              isFull
              className="mt-5"
              isDisabled={!faucetCaptcha}
              isLoading={faucet.isLoading}
              onPress={() => faucet.handleFaucet(faucetCaptcha)}
            >
              Give me ETH
            </Button>
          </Card>
        </Dialog.Content>
      </Dialog>
      <Popover {...popover.rootProps} className="bg-primary-600">
        <div className="p-3 text-xs max-w-[150px] text-center text-white">
          Since is your first access, you need to have some funds in your
          wallet. Click above to mint ETH.
        </div>
        <Popover.Arrow className="text-primary-600" />
      </Popover>
      <div
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        {...(popover.triggerProps as any)}
        className="faucetWidget--tour"
        aria-hidden
      />
    </div>
  );
}
