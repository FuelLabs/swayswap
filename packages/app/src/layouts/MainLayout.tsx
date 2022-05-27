import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import { FaucetWidget } from "~/components/FaucetWidget";
import Header from "~/components/Header";
import Skeleton from "~/components/Skeleton";
import { useWallet } from "~/context/AppContext";
import { Pages } from "~/types/pages";

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const location = useLocation();
  const path = useResolvedPath(location);
  const wallet = useWallet();

  return (
    <div className="layout">
      <Header />
      <div className="layout--wrapper">
        <ErrorBoundary
          onReset={resetReactQuery}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div
              className="layout--errorContent"
              style={{ textAlign: "center" }}
            >
              Error
              <br />
              {error.message}
              <br />
              <br />
              <button
                className="layout--confirmBtn"
                onClick={resetErrorBoundary}
              >
                Reset
              </button>
            </div>
          )}
        >
          {path.pathname === Pages.createWallet ? (
            <Outlet />
          ) : (
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          )}
        </ErrorBoundary>
      </div>
      {wallet && <FaucetWidget />}
    </div>
  );
}
