import { useSelector } from "@xstate/react";
import { AnimatePresence } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import {
  WelcomeSidebar,
  CreateWallet,
  AddFunds,
  WelcomeDone,
  StepsIndicator,
} from "../components";
import { useWelcomeSteps, stepsSelectors } from "../hooks";

import { MainLayout, useBreakpoint } from "~/systems/Core";
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
    <MainLayout>
      <div className="welcomePage--layout">
        {breakpoint === "lg" && <WelcomeSidebar />}
        <section className="welcomePage--content">
          <AnimatePresence exitBeforeEnter>
            <Routes key={location.pathname} location={location}>
              <Route
                index
                element={<Navigate to={Pages["welcome.createWallet"]} />}
              />
              <Route
                path={Pages["welcome.createWallet"]}
                element={<CreateWallet />}
              />
              <Route path={Pages["welcome.addFunds"]} element={<AddFunds />} />
              <Route path={Pages["welcome.done"]} element={<WelcomeDone />} />
            </Routes>
          </AnimatePresence>
          <Outlet />
          <StepsIndicator />
        </section>
      </div>
    </MainLayout>
  );
}
