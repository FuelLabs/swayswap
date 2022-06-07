import { Suspense } from "react";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import { useWallet } from "../hooks";

import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from "./Header";

import { FaucetWidget } from "~/systems/Faucet";
import { Skeleton } from "~/systems/UI";
import { Pages } from "~/types";

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const location = useLocation();
  const path = useResolvedPath(location);
  const wallet = useWallet();
  const isWelcome = path.pathname.includes(Pages.welcome);

  if (isWelcome) {
    return <Outlet />;
  }

  return (
    <main className="mainLayout">
      <Header />
      <div className="mainLayout--wrapper">
        <ErrorBoundary onReset={resetReactQuery}>
          <Suspense fallback={<Skeleton />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
      {wallet && <FaucetWidget />}
    </main>
  );
}
