import { useLocation, useNavigate } from "react-router-dom";
import { FocusScope, useFocusManager } from "@react-aria/focus";
import { ReactNode } from "react";
import cx from "classnames";

import fuelLogo from "src/assets/fuel-logo-512x512.png";
import { Pages } from "src/types/pages";
import { Button } from "./Button";
import { useWallet } from "src/context/AppContext";

const style = {
  wrapper: `p-4 w-screen flex flex-col sm:flex-row justify-between items-center`,
  headerLogo: `flex items-center justify-start`,
  nav: `flex-1 flex justify-center items-center mt-2 sm:mt-0`,
  navItemsContainer: `flex bg-gray-800 rounded-3xl`,
  navItem: `m-1 rounded-full border-transparent text-gray-400 hover:bg-gray-500/20 hover:text-gray-200`,
  activeNavItem: `bg-gray-500/20 text-gray-200`,
  buttonsContainer: `flex justify-end items-center`,
  button: `flex items-center bg-gray-800 rounded-2xl mx-2 font-semi-bold`,
  buttonPadding: `p-2`,
};

const HeaderNav = ({
  onPress,
  isActive,
  children,
}: {
  onPress: () => void;
  isActive: boolean;
  children: ReactNode;
}) => {
  const focusManager = useFocusManager();
  const onKeyDown = (e: any) => {
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
      {children}
    </Button>
  );
};

const Header = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const exists = Object.values(Pages).includes(location.pathname as Pages);

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <img src={fuelLogo} alt="swayswap" height={40} width={40} />
      </div>
      {wallet && (
        <div className={style.nav}>
          {exists && (
            <FocusScope>
              <div className={style.navItemsContainer}>
                <HeaderNav
                  onPress={() => navigate(Pages.wallet)}
                  isActive={location.pathname === Pages.wallet}
                >
                  Wallet
                </HeaderNav>
                <HeaderNav
                  onPress={() => navigate(Pages.swap)}
                  isActive={location.pathname === Pages.swap}
                >
                  Swap
                </HeaderNav>
                <HeaderNav
                  onPress={() => navigate(Pages.pool)}
                  isActive={location.pathname === Pages.pool}
                >
                  Pool
                </HeaderNav>
                {/* TODO: Change in a way that only shows remove liquidity if use has SWAY tokens */}
                {/* https://github.com/FuelLabs/swayswap/issues/56 */}
                <HeaderNav
                  onPress={() => navigate(Pages.removeLiquidity)}
                  isActive={location.pathname === Pages.removeLiquidity}
                >
                  Remove Liquidity
                </HeaderNav>
              </div>
            </FocusScope>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
