import { FocusScope, useFocusManager } from "@react-aria/focus";
import cx from "classnames";
import clipboard from "clipboard";
import type { ComponentType, ReactNode } from "react";
import toast from "react-hot-toast";
import { BiDollarCircle } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import { MdChecklist, MdSwapCalls } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "./Button";

import fuelLogo from "~/assets/fuel-logo-512x512.png";
import { useWallet } from "~/context/AppContext";
import { useEthBalance } from "~/hooks/useEthBalance";
import { Pages } from "~/types/pages";

const style = {
  wrapper: `relative p-4 w-screen flex flex-col sm:flex-row justify-between items-center`,
  headerLogo: `absolute top-4 left-4 flex items-center justify-start`,
  nav: `flex-1 flex justify-center items-center mt-2 sm:mt-0`,
  navItemsContainer: `px-1 gap-1 flex bg-gray-800 rounded-3xl`,
  navItem: `py-1 px-3 my-1 text-base rounded-full border-transparent text-gray-400 hover:bg-gray-500/20 hover:text-gray-200`,
  activeNavItem: `bg-gray-500/20 text-gray-200`,
  buttonsContainer: `flex justify-end items-center`,
  button: `flex items-center bg-gray-800 rounded-2xl mx-2 font-semi-bold`,
  buttonPadding: `p-2`,
  navIcon: `text-gray-500 stroke-current`,
  wallet: `flex items-center gap-3 absolute top-4 right-4 rounded-full
  text-gray-300 bg-gray-800 inner-shadow p-1`,
};

const HeaderNav = ({
  onPress,
  isActive,
  icon: Icon,
  children,
}: {
  onPress: () => void;
  isActive: boolean;
  icon: ComponentType<any>;
  children: ReactNode;
}) => {
  const focusManager = useFocusManager();
  const onKeyDown = (e: any) => {
    // eslint-disable-next-line default-case
    switch (e.key) {
      case "ArrowRight":
        focusManager.focusNext({ wrap: true });
        break;
      case "ArrowLeft":
        focusManager.focusPrevious({ wrap: true });
        break;
    }
  };

  return (
    <Button
      onKeyDown={onKeyDown}
      variant="ghost"
      size="lg"
      onPress={onPress}
      className={cx(style.navItem, {
        [style.activeNavItem]: isActive,
      })}
    >
      <Icon
        className={cx("text-primary-gray", { "text-primary-400": isActive })}
      />
      {children}
    </Button>
  );
};

const Header = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const ethBalance = useEthBalance();

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
    toast("Address copied", { icon: "✨" });
  };

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <img src={fuelLogo} alt="swayswap" height={40} width={40} />
      </div>
      {wallet && (
        <div className={style.nav}>
          <FocusScope>
            <div className={style.navItemsContainer}>
              <HeaderNav
                icon={MdSwapCalls}
                onPress={() => navigate(Pages.swap)}
                isActive={location.pathname === Pages.swap}
              >
                Swap
              </HeaderNav>
              <HeaderNav
                icon={BiDollarCircle}
                onPress={() => navigate(Pages.pool)}
                isActive={location.pathname.includes(Pages.pool)}
              >
                Pool
              </HeaderNav>
              <HeaderNav
                icon={MdChecklist}
                onPress={() => navigate(Pages.assets)}
                isActive={location.pathname.includes(Pages.assets)}
              >
                Assets
              </HeaderNav>
            </div>
          </FocusScope>
        </div>
      )}
      {wallet && (
        <nav
          className={cx(style.wallet, {
            "pl-5": Boolean(ethBalance.formatted),
          })}
        >
          <>
            {ethBalance.formatted && <span>{ethBalance.formatted} ETH</span>}
            <Button
              aria-label="Copy your wallet address"
              onPress={handleCopy}
              className="bg-gray-700 px-4 rounded-full"
            >
              <span className="text-gray-100">
                {wallet?.address.slice(0, 4)}...{wallet?.address.slice(-4)}
              </span>
              <FaRegCopy size="1em" />
            </Button>
          </>
        </nav>
      )}
    </div>
  );
};

export default Header;
