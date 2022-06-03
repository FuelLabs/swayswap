import cx from "classnames";
import clipboard from "clipboard";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { useAssets, useEthBalance, useWallet } from "../hooks";

import { WalletInfo } from "./WalletInfo";

import { Popover, usePopover, ButtonGroup, Button } from "~/systems/UI";

const style = {
  wallet: `flex items-center gap-3 rounded-full text-gray-300 bg-gray-800 inner-shadow p-1`,
  button: `py-0 px-3 border-transparent rounded-none`,
  buttonLeft: `border-r-2 border-r-gray-800 text-gray-300 hover:text-gray-200 disabled:hover:text-gray-200 disabled:text-gray-200 rounded-l-full`,
  buttonRight: `rounded-r-full`,
};

export function WalletWidget() {
  const wallet = useWallet();
  const ethBalance = useEthBalance();
  const { coins } = useAssets();

  const popover = usePopover({
    placement: "bottom end",
    offset: 10,
    crossOffset: 42,
  });

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
    toast("Address copied", { icon: "✨" });
  };

  return (
    <div
      className={cx(style.wallet, {
        "pl-4": Boolean(ethBalance.formatted),
      })}
    >
      <>
        {ethBalance.formatted && (
          <span data-testid="wallet-balance">{ethBalance.formatted} ETH</span>
        )}
        <div className="flex items-center bg-gray-700 rounded-full">
          <ButtonGroup>
            <Button
              {...popover.triggerProps}
              isDisabled={!coins.length}
              className={cx(style.button, style.buttonLeft)}
            >
              {wallet?.address.slice(0, 4)}...{wallet?.address.slice(-4)}
            </Button>
            {Boolean(coins.length) && (
              <Popover {...popover.rootProps}>
                <WalletInfo onClose={() => popover.close()} />
              </Popover>
            )}
            <Button
              aria-label="Copy your wallet address"
              onPress={handleCopy}
              className={cx(style.button, style.buttonRight)}
            >
              <FaRegCopy size="1em" />
            </Button>
          </ButtonGroup>
        </div>
      </>
    </div>
  );
}
