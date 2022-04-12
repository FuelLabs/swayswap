import { useContext } from "react";
import fuelLogo from "src/assets/fuel-logo-512x512.png";
import { useLocation, useNavigate } from "react-router-dom";
import { WalletContext } from "src/context/WalletContext";

export enum Routes {
  "wallet" = "/wallet",
  "assets" = "/assets",
  "swap" = "/swap",
}

const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semi-bold`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exists = Object.values(Routes).includes(location.pathname as Routes);
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
              onClick={() => navigate(Routes.assets)}
              className={`${style.navItem} ${
                location.pathname === Routes.assets && style.activeNavItem
              }`}
            >
              Assets
            </div>

            <div
              onClick={() => navigate(Routes.swap)}
              className={`${style.navItem} ${
                location.pathname === Routes.swap && style.activeNavItem
              }`}
            >
              Swap
            </div>
          </div>
        )}
      </div>

      <div className={style.buttonsContainer}>
        {wallet && (
          <div className={`${style.button} ${style.buttonPadding}`}>
            <div className={style.buttonTextContainer}>
              {wallet?.address.slice(0, 8)}...{wallet?.address.slice(-5)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
