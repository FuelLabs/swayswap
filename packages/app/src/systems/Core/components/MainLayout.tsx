import { Suspense, useContext } from "react";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import { AppContext } from "../context";
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
  const ctx = useContext(AppContext);

  if (isWelcome) {
    return <Outlet />;
  }

  return (
    <main className="mainLayout">
      {!ctx?.justContent && <Header />}
      <div className="mainLayout--wrapper">
        <ErrorBoundary onReset={resetReactQuery}>
          {process.env.NODE_ENV !== "test" ? (
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          ) : (
            <Outlet />
          )}
        </ErrorBoundary>
      </div>
      {wallet && !ctx?.justContent && <FaucetWidget />}
    </main>
  );
}
