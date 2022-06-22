import { useTwitterDialog } from "../hooks/useTwitterDialog";

import { Button, Dialog, Link } from "~/systems/UI";

const tweetText = `I'm using #SwaySwap, a blazingly fast DEX built on Fuel @fuellabs_\nhttps://fuellabs.github.io/swayswap`;
const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  tweetText
)}`;

export function TwitterDialog() {
  const dialog = useTwitterDialog();

  function shareTweet() {
    setTimeout(() => {
      dialog.close();
    }, 500);
  }

  return (
    <Dialog {...dialog.dialogProps} shouldCloseOnBlur={false} isBlocked={true}>
      <Dialog.Content className="w-40 p-4 pt-8">
        <p className="text-l text-gray-50 text-center">
          💚 Share that you&apos;re using SwaySwap on Twitter.
        </p>
        <Link href={tweetLink} isExternal className="no-underline">
          <Button
            size="md"
            variant="primary"
            isFull
            className="mt-6"
            onPress={shareTweet}
          >
            Share on Twitter
          </Button>
        </Link>
        <Button
          size="sm"
          isFull
          className="mt-2 p-0 border-0 text-gray-400"
          onPress={dialog.close}
        >
          No thanks
        </Button>
      </Dialog.Content>
    </Dialog>
  );
}
