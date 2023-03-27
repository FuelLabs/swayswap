import { useSelector } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import {
  WelcomeSidebar,
  WelcomeDone,
  StepsIndicator,
  AddAssets,
  AddFunds,
} from "../components";
import { MintAssets } from "../components/MintAssets";
import { WelcomeConnect } from "../components/WelcomeConnect";
import { useWelcomeSteps, stepsSelectors } from "../hooks";

import { useBreakpoint } from "~/systems/Core";
import { Pages } from "~/types";

export function WelcomePage() {
  const { service } = useWelcomeSteps();
  const isFinished = useSelector(service, stepsSelectors.isFinished);
  const location = useLocation();
  const breakpoint = useBreakpoint();
  if (isFinished) {
    return <Navigate to={Pages.swap} replace />;
  }

  return (
    <div className="welcomePage--layout">
      {breakpoint === "lg" && <WelcomeSidebar />}
      <section className="welcomePage--content">
        <AnimatePresence exitBeforeEnter>
          <Routes key={location.pathname} location={location}>
            <Route path={Pages.connect} element={<WelcomeConnect />} />
            <Route path={Pages.faucet} element={<AddFunds />} />
            <Route path={Pages.addAssets} element={<AddAssets />} />
            <Route path={Pages.mint} element={<MintAssets />} />
            <Route path={Pages["welcome.done"]} element={<WelcomeDone />} />
          </Routes>
        </AnimatePresence>
        <Outlet />
        <StepsIndicator />
      </section>
    </div>
  );
}
