import { useSelector } from "@xstate/react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AddFunds from "./AddFunds";
import CreateWallet from "./CreateWallet";
import { StepsIndicator } from "./StepsIndicator";
import WelcomeDone from "./WelcomeDone";
import { WelcomeSidebar } from "./WelcomeSidebar";

import { stepsSelectors, useWelcomeSteps } from "~/hooks/useWelcomeSteps";
import { Pages } from "~/types/pages";

export function WelcomePage() {
  const { service } = useWelcomeSteps();
  const isFinished = useSelector(service, stepsSelectors.isFinished);

  if (isFinished) {
    return <Navigate to={Pages.swap} replace />;
  }

  return (
    <div className="welcomePage--layout">
      <WelcomeSidebar />
      <section className="welcomePage--content">
        <Routes>
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
        <Outlet />
        <StepsIndicator />
      </section>
    </div>
  );
}
