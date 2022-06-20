import { useEffect } from "react";

import { useTwitterDialog } from "../hooks/useTwitterDialog";

import { Button, Dialog, Link, useDialog } from "~/systems/UI";

const tweetText = `I'm using #SwaySwap, a blazingly fast DEX built on Fuel @fuellabs_\nhttps://fuellabs.github.io/swayswap`;
const tweetLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  tweetText
)}`;

export function TwitterDialog() {
  const dialog = useDialog();
  const { isOpen, close } = useTwitterDialog();

  useEffect(() => {
    dialog.setOpen(isOpen);
  }, [isOpen]);

  function shareTweet() {
    setTimeout(() => {
      close();
    }, 500);
  }

  function handleSkip() {
    close();
  }

  return (
    <Dialog
      {...dialog.dialogProps}
      isOpen={isOpen}
      shouldCloseOnBlur={false}
      isBlocked={true}
      onClose={close}
    >
      <Dialog.Content className="w-40 p-4 pt-8">
        <p className="text-l text-gray-50 text-center">
          💚 Share that you&apos;re using SwaySwap on Twitter.
        </p>
        <Link href={tweetLink} isExternal className="de">
          <Button
            size="md"
            variant="primary"
            isFull
            className="mt-6"
            onPress={shareTweet}
          >
            Share on twitter
          </Button>
        </Link>
        <Button
          size="sm"
          isFull
          className="mt-2 p-0 border-0 text-gray-400"
          onPress={handleSkip}
        >
          I don&apos;t have a Twitter account
        </Button>
      </Dialog.Content>
    </Dialog>
  );
}
