import { WelcomeNavItem } from "./WelcomeNavItem";

import fuelLogo from "~/assets/fuel-logo-512x512.png";

export function WelcomeSidebar() {
  return (
    <aside className="welcomeSidebar">
      <img
        src={fuelLogo}
        className="welcomeSidebar--logo"
        alt="swayswap"
        height={50}
        width={50}
      />
      <div className="welcomeSidebar--steps">
        <nav>
          <WelcomeNavItem id={0} label="Create wallet" />
          <WelcomeNavItem id={1} label="Add funds" />
          <WelcomeNavItem id={2} label="Done" />
        </nav>
      </div>
    </aside>
  );
}
