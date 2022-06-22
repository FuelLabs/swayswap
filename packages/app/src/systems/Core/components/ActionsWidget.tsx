import { BsTwitter } from "react-icons/bs";
import { FaFaucet } from "react-icons/fa";

import { FaucetDialog, useFaucetDialog } from "~/systems/Faucet";
import { TwitterDialog, useTwitterDialog } from "~/systems/Tweet";
import { Button } from "~/systems/UI";

export function ActionsWidget() {
  const twitterDialog = useTwitterDialog();
  const faucetDialog = useFaucetDialog();

  return (
    <div className="actionsWidget">
      <Button
        {...faucetDialog.openButtonProps}
        size="md"
        className="actionsWidget--faucetBtn"
        onPress={faucetDialog.open}
      >
        <FaFaucet />
        Faucet
      </Button>
      <Button
        {...twitterDialog.openButtonProps}
        size="md"
        className="actionsWidget--shareBtn"
        onPress={twitterDialog.open}
      >
        <BsTwitter /> Share
      </Button>
      <TwitterDialog />
      <FaucetDialog />
    </div>
  );
}
