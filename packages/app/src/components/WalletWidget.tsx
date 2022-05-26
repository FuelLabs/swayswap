import cx from "classnames";
import clipboard from "clipboard";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegCopy } from "react-icons/fa";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { Popover, usePopover } from "./Popover";
import { WalletInfo } from "./WalletInfo";

import { useWallet } from "~/context/AppContext";
import { useEthBalance } from "~/hooks/useEthBalance";
import { useFaucet } from "~/hooks/useFaucet";
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
  const popover = usePopover({ placement: "bottom end", offset: 10 });
  const [userInfo, setUserInfo] = useUserInfo();
  const faucet = useFaucet({
    onSuccess() {
      toast.success(
        "Hey, we added 0.5 ETH to your test account. Open you wallet clicking above to add more.",
        {
          icon: "💰",
          duration: 5000,
          position: "top-right",
          style: {
            marginTop: 55,
          },
        }
      );
    },
  });

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
    toast("Address copied", { icon: "✨" });
  };

  function handleClose() {
    popover.close();
  }

  useEffect(() => {
    if (wallet && userInfo.isNew) {
      setTimeout(() => {
        faucet.mutate();
        setUserInfo({ isNew: false });
      }, 1000);
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
              <WalletInfo onClose={handleClose} />
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
