import { FuelLogo } from "@fuel-ui/react";
import cx from "classnames";
import type { ComponentType, ReactNode } from "react";
import { BiDollarCircle } from "react-icons/bi";
import { MdSwapCalls } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { useBreakpoint } from "../hooks/useBreakpoint";

import { MigrationWarning } from "./MigrationWarning";
import { WalletWidget } from "./WalletWidget";

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
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <MigrationWarning />
      <div className="header">
        <FuelLogo className="cursor-pointer" size={50} />
        <div className="header--nav">
          <div className="header--navContainer">
            <ButtonGroup>
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
            </ButtonGroup>
          </div>
        </div>
        <div className="header--wallet">
          <WalletWidget />
        </div>
      </div>
    </>
  );
};
