import toast from "react-hot-toast";
import { FaFaucet } from "react-icons/fa";

import { useFaucetDialog } from "../hooks";
import { useFaucet } from "../hooks/useFaucet";

import { FaucetApp } from "./FaucetApp";

import { Card, Dialog } from "~/systems/UI";

export function FaucetDialog() {
  const faucet = useFaucet();
  const dialog = useFaucetDialog();
  return (
    <Dialog {...dialog.dialogProps}>
      <Dialog.Content className="faucetDialog">
        <Card>
          <Card.Title>
            <FaFaucet className="text-primary-500" /> Faucet
          </Card.Title>
          <div>
            Click the button below to receive {faucet.faucetAmount} test ETH to
            your wallet.
          </div>
          <FaucetApp
            isButtonFull
            onSuccess={() => {
              toast.success("Test ETH successfully fauceted!");
              dialog.close();
            }}
          />
        </Card>
      </Dialog.Content>
    </Dialog>
  );
}
