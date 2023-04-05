import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import {
  WelcomeSidebar,
  WelcomeTerms,
  StepsIndicator,
  AddAssets,
  AddFunds,
} from "../components";
import { MintAssets } from "../components/MintAssets";
import { WelcomeConnect } from "../components/WelcomeConnect";

import { useBreakpoint } from "~/systems/Core";
import { Pages } from "~/types";

export function WelcomePage() {
  const location = useLocation();
  const breakpoint = useBreakpoint();

  return (
    <div className="welcomePage--layout">
      {breakpoint === "lg" && <WelcomeSidebar />}
      <section className="welcomePage--content">
        <Routes key={location.pathname} location={location}>
          <Route path={Pages.welcomeConnect} element={<WelcomeConnect />} />
          <Route path={Pages.welcomeFaucet} element={<AddFunds />} />
          <Route path={Pages.welcomeAddAssets} element={<AddAssets />} />
          <Route path={Pages.welcomeMint} element={<MintAssets />} />
          <Route path={Pages.welcomeTerms} element={<WelcomeTerms />} />
        </Routes>
        <Outlet />
        <StepsIndicator />
      </section>
    </div>
  );
}
