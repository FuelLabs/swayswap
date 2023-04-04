import { WelcomeNavItem } from "./WelcomeNavItem";
import { WelcomeSidebarBullet } from "./WelcomeSidebarBullet";

import { relativeUrl } from "~/systems/Core";

export function WelcomeSidebar() {
  return (
    <aside className="welcomeSidebar">
      <img
        src={relativeUrl("/fuel-logo-512x512.png")}
        className="welcomeSidebar--logo"
        alt="swayswap"
        height={50}
        width={50}
      />
      <div className="welcomeSidebar--steps">
        <WelcomeSidebarBullet />
        <nav>
          <WelcomeNavItem id={0} label="Connect Wallet" />
          <WelcomeNavItem id={1} label="Faucet" />
          <WelcomeNavItem id={2} label="Add Assets" />
          <WelcomeNavItem id={3} label="Mint Assets" />
          <WelcomeNavItem id={4} label="Done" />
        </nav>
      </div>
    </aside>
  );
}
