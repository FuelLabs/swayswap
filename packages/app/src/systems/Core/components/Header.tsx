import cx from "classnames";
import type { ComponentType, ReactNode } from "react";
import { BiDollarCircle } from "react-icons/bi";
import { MdSwapCalls } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { useBreakpoint } from "../hooks/useBreakpoint";
import { useWallet } from "../hooks/useWallet";

import { WalletWidget } from "./WalletWidget";

import fuelLogo from "~/assets/fuel-logo-512x512.png";
import type { ButtonProps } from "~/systems/UI";
import { ButtonGroup, Button } from "~/systems/UI";
import { Pages } from "~/types";

type HeaderNavProps = ButtonProps & {
  onPress: () => void;
  isActive: boolean;
  icon: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  children: ReactNode;
};

const HeaderNav = ({
  onPress,
  isActive,
  icon: Icon,
  children,
  ...props
}: HeaderNavProps) => {
  const breakpoint = useBreakpoint();
  return (
    <Button
      {...props}
      isFull={breakpoint === "sm"}
      variant="ghost"
      size="lg"
      onPress={onPress}
      className={cx("header--navItem", {
        "header--navItemActive": isActive,
      })}
    >
      <Icon
        className={cx("text-primary-gray", { "text-primary-400": isActive })}
      />
      {children}
    </Button>
  );
};

export const Header = () => {
  const wallet = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="header">
      <img src={fuelLogo} alt="swayswap" height={40} width={40} />
      {wallet && (
        <div className="header--wallet">
          <WalletWidget />
        </div>
      )}
      {wallet && (
        <div className="header--nav">
          <div className="header--navContainer">
            <ButtonGroup>
              <HeaderNav
                icon={MdSwapCalls}
                onPress={() => navigate(Pages.swap)}
                isActive={location.pathname === Pages.swap}
                data-testid="swapMenuBtn"
              >
                Swap
              </HeaderNav>
              <HeaderNav
                icon={BiDollarCircle}
                onPress={() => navigate(Pages.pool)}
                isActive={location.pathname.includes(Pages.pool)}
                data-testid="poolMenuBtn"
              >
                Pool
              </HeaderNav>
            </ButtonGroup>
          </div>
        </div>
      )}
    </div>
  );
};
