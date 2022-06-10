import { useNavigate } from "react-router-dom";

import { relativeUrl, useBreakpoint } from "~/systems/Core";
import { Button, Link } from "~/systems/UI";
import { Pages } from "~/types";

export function Header() {
  const breakpoint = useBreakpoint();
  const navigate = useNavigate();
  return (
    <header className="homePage--header">
      <img
        src={relativeUrl("/fuel-logo-512x512.png")}
        alt="swayswap"
        height={40}
        width={40}
      />
      <nav className="homePage--menu">
        <Link isExternal href="https://github.com/FuelLabs/swayswap">
          Github
        </Link>
        <Link
          isExternal
          href="https://github.com/FuelLabs/swayswap/blob/master/README.md"
        >
          Docs
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
