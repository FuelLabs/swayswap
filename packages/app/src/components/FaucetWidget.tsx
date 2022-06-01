import { FaFaucet } from "react-icons/fa";

import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, useDialog } from "./Dialog";
import { FaucetApp } from "./FaucetApp";

export function FaucetWidget() {
  const dialog = useDialog();

  function handleClickFaucet() {
    return dialog.openButtonProps.onPress();
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
