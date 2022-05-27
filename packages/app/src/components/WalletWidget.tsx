import cx from "classnames";
import clipboard from "clipboard";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { Popover, usePopover } from "./Popover";
import { WalletInfo } from "./WalletInfo";

import { ENABLE_FAUCET_API } from "~/config";
import { useAppContext, useWallet } from "~/context/AppContext";
import { useEthBalance } from "~/hooks/useEthBalance";
import { useUserInfo } from "~/hooks/useUserInfo";

const style = {
  wallet: `flex items-center absolute gap-3 top-4 right-4 rounded-full text-gray-300 bg-gray-800 inner-shadow p-1`,
  button: `py-0 px-3 border-transparent rounded-none`,
  buttonLeft: `border-r-2 border-r-gray-800 text-gray-300 hover:text-gray-100 rounded-l-full`,
  buttonRight: `rounded-r-full`,
};

export function WalletWidget() {
  const wallet = useWallet();
  const ethBalance = useEthBalance();
  const { faucet } = useAppContext();
  const [userInfo, setUserInfo] = useUserInfo();
  const client = useQueryClient();

  const popover = usePopover({
    placement: "bottom end",
    offset: 10,
    crossOffset: 42,
  });

  const autoFaucet = useMutation(async () => {
    await faucet();
    setUserInfo({ isNew: false });
    client.refetchQueries(["AssetsPage-balances"]);
  });

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
    toast("Address copied", { icon: "✨" });
  };

  useEffect(() => {
    if (wallet && userInfo.isNew && ENABLE_FAUCET_API) {
      popover.open();
      autoFaucet.mutate();
    }
  }, [userInfo]);

  return (
    <div
      className={cx(style.wallet, {
        "pl-4": Boolean(ethBalance.formatted),
      })}
    >
      <>
        {ethBalance.formatted && <span>{ethBalance.formatted} ETH</span>}
        <div className="flex items-center bg-gray-700 rounded-full">
          <ButtonGroup>
            <Button
              {...popover.getTriggerProps()}
              className={cx(style.button, style.buttonLeft)}
            >
              {wallet?.address.slice(0, 4)}...{wallet?.address.slice(-4)}
            </Button>
            <Popover {...popover.rootProps}>
              <WalletInfo onClose={() => popover.close()} />
            </Popover>
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
