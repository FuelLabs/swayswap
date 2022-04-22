import { useContext } from "react";
import fuelLogo from "src/assets/fuel-logo-512x512.png";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "src/context/WalletContext";
import { Pages } from "src/types/pages";

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl focus:outline focus:outline-2 focus:outline-[#006842]`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semi-bold focus:outline focus:outline-2 focus:outline-[#006842] cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exists = Object.values(Pages).includes(location.pathname as Pages);
  const { getWallet } = useContext(WalletContext);
  const wallet = getWallet?.();

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <img src={fuelLogo} alt="swayswap" height={40} width={40} />
      </div>
      <div className={style.nav}>
        {exists && (
          <div className={style.navItemsContainer}>
            <div
              tabIndex={0}
              onClick={() => navigate(Pages.assets)}
              onKeyPress={() => navigate(Pages.assets)}
              className={`${style.navItem} ${
                location.pathname === Pages.assets && style.activeNavItem
              }`}
              >
              Assets
            </div>
            <div
              tabIndex={0}
              onClick={() => navigate(Pages.swap)}
              onKeyPress={() => navigate(Pages.swap)}
              className={`${style.navItem} ${
                location.pathname === Pages.swap && style.activeNavItem
              }`}
              >
              Swap
            </div>
            <div
              tabIndex={0}
              onClick={() => navigate(Pages.pool)}
              onKeyPress={() => navigate(Pages.pool)}
              className={`${style.navItem} ${
                location.pathname === Pages.pool && style.activeNavItem
              }`}
            >
              Pool
            </div>
            {/* TODO: Change in a way that only shows remove liquidity if use has SWAY tokens */}
            {/* https://github.com/FuelLabs/swayswap/issues/56 */}
            <div
              onClick={() => navigate(Pages.removeLiquidity)}
              className={`${style.navItem} ${
                location.pathname === Pages.removeLiquidity &&
                style.activeNavItem
              }`}
            >
              Remove
            </div>
          </div>
        )}
      </div>

      <div className={style.buttonsContainer}>
        {wallet && (
          <div className={`${style.button} ${style.buttonPadding}`} tabIndex={1}>
            <div className={style.buttonTextContainer}>
              {/* TODO: On hover we should show the address https://github.com/FuelLabs/swayswap-demo/issues/38 */}
              {/* TODO: On click/press should copy wallet address https://github.com/FuelLabs/swayswap-demo/issues/37 */}
              {wallet?.address.slice(0, 8)}...{wallet?.address.slice(-5)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
