import { FuelLogo } from "@fuel-ui/react";
import { useNavigate } from "react-router-dom";

import { useBreakpoint } from "~/systems/Core";
import { Button, Link } from "~/systems/UI";
import { Pages } from "~/types";

export function Header() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  return (
    <header className="homePage--header">
      <FuelLogo />
      <nav className="homePage--menu">
        <Link isExternal href="https://github.com/FuelLabs/swayswap">
          Github
        </Link>
        <Button
          size={breakpoint === "sm" ? "sm" : "lg"}
          variant="primary"
          onPress={() => navigate(Pages.swap)}
        >
          Launch app
        </Button>
      </nav>
    </header>
  );
}
