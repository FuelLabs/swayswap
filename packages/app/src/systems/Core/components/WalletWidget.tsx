import { cssObj } from "@fuel-ui/css";
import { IconButton, Icon, Menu, Popover } from "@fuel-ui/react";
import cx from "classnames";
import { FiLogOut } from "react-icons/fi";

import { useWallet } from "../hooks";

import { ButtonGroup, Button } from "~/systems/UI";

const style = {
  wallet: `flex items-center gap-3 rounded-full text-gray-300 bg-gray-800 inner-shadow p-1`,
  button: `py-0 px-3 border-transparent rounded-none`,
  buttonLeft: `border-r-2 border-r-gray-800 text-gray-300 hover:text-gray-200 disabled:hover:text-gray-200 disabled:text-gray-200 rounded-l-full`,
  buttonRight: `rounded-r-full`,
};

export function WalletWidget() {
  const { wallet } = useWallet();

  function handleDisconnect() {
    window.localStorage.clear();
    window.fuel?.disconnect();
    window.location.reload();
  }

  return (
    <div className={style.wallet}>
      <div className="flex items-center bg-gray-700 rounded-full">
        <ButtonGroup>
          <Button className={cx(style.button, style.buttonLeft)} isDisabled>
            {String(wallet?.address).slice(0, 4)}...
            {String(wallet?.address).slice(-4)}
          </Button>
          <Popover
            css={styles.menu}
            content={
              <Menu
                onAction={(action) => {
                  if (action === "disconnect") {
                    handleDisconnect();
                  }
                }}
                css={styles.menu}
              >
                <Menu.Item key="disconnect">
                  <FiLogOut />
                  Disconnect
                </Menu.Item>
              </Menu>
            }
          >
            <IconButton
              icon={Icon.is("Gear")}
              variant="link"
              aria-label="settings"
              color="gray"
            />
          </Popover>
        </ButtonGroup>
      </div>
    </div>
  );
}

const styles = {
  menu: cssObj({
    padding: 0,
  }),
};
