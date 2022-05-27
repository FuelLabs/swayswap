import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";
import { Tooltip } from "./Tooltip";

import { RECAPTCHA_SITE_KEY } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";
import { useUserInfo } from "~/hooks/useUserInfo";

export function FaucetWidget() {
  const [userInfo, setUserInfo] = useUserInfo();
  const [faucetCaptcha, setFaucetCaptcha] = useState<string | null>(null);
  const dialog = useDialog();
  const [showTour, setShowTour] = useState(false);

  const faucet = useFaucet({
    onSuccess: () => {
      if (userInfo.isNew) setUserInfo({ isNew: false });
      dialog.close();
    },
  });

  useEffect(() => {
    if (userInfo.isNew) {
      console.log(userInfo.isNew);
      setTimeout(() => {
        setShowTour(true);
      }, 2000);
    }
  }, [userInfo.isNew]);

  const tour = (
    <>
      <div className="text-xs max-w-[170px] text-center">
        Since is your first access, you need to have some funds in your wallet.{" "}
        <br />
        <b>Click above to mint ETH.</b>
      </div>
    </>
  );

  return (
    <div className="faucetWidget">
      <Tooltip
        open={showTour}
        onOpenChange={setShowTour}
        sideOffset={5}
        content={tour}
        className="bg-primary-500 text-primary-500"
        contentClassName="text-white"
      >
        <Button {...dialog.openButtonProps} size="md">
          <FaFaucet />
          Faucet
        </Button>
      </Tooltip>
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
    </div>
  );
}
