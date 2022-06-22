import { BsTwitter } from "react-icons/bs";
import { FaFaucet } from "react-icons/fa";

import { FaucetDialog, useFaucetDialog } from "~/systems/Faucet";
import { Button, Link } from "~/systems/UI";

const tweetText = `I'm using #SwaySwap, a blazingly fast DEX on the Fuel devnet @fuellabs_\nhttps://fuellabs.github.io/swayswap`;
const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  tweetText
)}`;

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
      <Link href={tweetLink} isExternal className="no-underline">
        <Button
          size="md"
          className="actionsWidget--btn actionsWidget--shareBtn"
        >
          <BsTwitter />
          <span className="content">Share</span>
        </Button>
      </Link>
      <FaucetDialog />
    </div>
  );
}
