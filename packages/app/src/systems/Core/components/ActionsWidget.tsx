import { FaFaucet } from "react-icons/fa";

import { FaucetDialog, useFaucetDialog } from "~/systems/Faucet";
import { Button } from "~/systems/UI";

export function ActionsWidget() {
  const faucetDialog = useFaucetDialog();

  return (
    <div className="actionsWidget">
      <Button
        {...faucetDialog.openButtonProps}
        size="md"
        className="actionsWidget--btn "
        onPress={faucetDialog.open}
      >
        <FaFaucet />
        <span className="content">Faucet</span>
      </Button>
      <FaucetDialog />
    </div>
  );
}
