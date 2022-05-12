import fuelLogo from "src/assets/fuel-logo-512x512.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";

const style = {
  wrapper: `p-4 w-screen flex flex-col sm:flex-row justify-between items-center`,
  headerLogo: `flex items-center justify-start`,
  nav: `flex-1 flex justify-center items-center mt-2 sm:mt-0`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semi-bold`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const exists = Object.values(Pages).includes(location.pathname as Pages);

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <img src={fuelLogo} alt="swayswap" height={40} width={40} />
      </div>
      <div className={style.nav}>
        {exists && (
          <div className={style.navItemsContainer}>
            <div
              onClick={() => navigate(Pages.wallet)}
              className={`${style.navItem} ${
                location.pathname === Pages.wallet && style.activeNavItem
              }`}
            >
              Wallet
            </div>
            <div
              onClick={() => navigate(Pages.swap)}
              className={`${style.navItem} ${
                location.pathname === Pages.swap && style.activeNavItem
              }`}
            >
              Swap
            </div>
            <div
              onClick={() => navigate(Pages.pool)}
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
      <div className={style.buttonsContainer} />
    </div>
  );
};

export default Header;
