import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";

import { RECAPTCHA_SITE_KEY } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";
import { useUserInfo } from "~/hooks/useUserInfo";

export function FaucetWidget() {
  const dialog = useDialog();
  const [faucetCaptcha, setFaucetCaptcha] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useUserInfo();

  const faucet = useFaucet({
    onSuccess: () => {
      if (userInfo.isNew) setUserInfo({ isNew: false });
      dialog.close();
    },
  });

  useEffect(() => {
    if (userInfo.isNew) {
      dialog.open();
    }
  }, []);

  return (
    <div className="faucetWidget">
      <Button size="md" {...dialog.openButtonProps}>
        <FaFaucet />
        Faucet
      </Button>
      <Dialog {...dialog.dialogProps} isBlocked={userInfo.isNew}>
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
    </div>
  );
}
