import cx from "classnames";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

import { useWallet } from "../hooks";

import { Confirm } from "./Confirm";

import { ButtonGroup, Button } from "~/systems/UI";

const style = {
  wallet: `flex items-center gap-3 rounded-full text-gray-300 bg-gray-800 inner-shadow p-1`,
  button: `py-0 px-3 border-transparent rounded-none`,
  buttonLeft: `border-r-2 border-r-gray-800 text-gray-300 hover:text-gray-200 disabled:hover:text-gray-200 disabled:text-gray-200 rounded-l-full`,
  buttonRight: `rounded-r-full`,
};

export function WalletWidget() {
  const { wallet } = useWallet();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    window.localStorage.clear();
    window.location.reload();
  }

  return (
    <div className={style.wallet}>
      <>
        <Confirm
          open={open}
          header="Confirm reset"
          content="By confirming we are going to reset the state of SwaySwap. This will not affect the balances you have on your wallet or the assets you have on the pool."
          onCancel={() => setOpen(false)}
          onConfirm={handleLogout}
        />
        <div className="flex items-center bg-gray-700 rounded-full">
          <ButtonGroup>
            <Button className={cx(style.button, style.buttonLeft)} isDisabled>
              {String(wallet?.address).slice(0, 4)}...
              {String(wallet?.address).slice(-4)}
            </Button>
            <Button
              aria-label="Reset SwaySwap state"
              onPress={() => setOpen(true)}
              className={cx(style.button, style.buttonRight)}
            >
              <FiLogOut size="1em" />
            </Button>
          </ButtonGroup>
        </div>
      </>
    </div>
  );
}
