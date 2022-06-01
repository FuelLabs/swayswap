import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";
import { FaucetApp } from "./FaucetApp";

import { ENABLE_FAUCET_API } from "~/config";
import { useFaucet } from "~/hooks/useFaucet";

export function FaucetWidget() {
  const dialog = useDialog();
  const { directFaucet } = useFaucet();

  function handleClickFaucet() {
    if (ENABLE_FAUCET_API) {
      return dialog.openButtonProps.onPress();
    }
    directFaucet();
  }

  return (
    <div className="faucetWidget">
      <Button {...dialog.openButtonProps} onPress={handleClickFaucet} size="md">
        <FaFaucet />
        Faucet
      </Button>
      <Dialog {...dialog.dialogProps}>
        <Dialog.Content className="faucetWidget--dialog">
          <Card>
            <Card.Title>
              <FaFaucet className="text-primary-500" /> Faucet
            </Card.Title>
            <div>Click the button below to mint 0.5 ETH to your wallet.</div>
            <FaucetApp />
          </Card>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
