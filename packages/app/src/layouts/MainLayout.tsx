import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import Header from "~/components/Header";

const style = {
  wrapper: `min-h-screen w-screen text-white select-none flex flex-col justify-between`,
  content: `w-[30rem] flex-1 rounded-2xl p-4 m-2`,
  confirmButton: `bg-primary-500 my-2 rounded-2xl py-2 px-8 text-l font-semibold items-center
    justify-center cursor-pointer border border-primary-500 hover:border-primary-600 mt-8`,
};

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const location = useLocation();
  const path = useResolvedPath(location);

  return (
    <div className={style.wrapper}>
      <Header />
      <ErrorBoundary
        onReset={resetReactQuery}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div
            style={{
              display: "flex",
              flex: 1,
              placeItems: "center",
              placeContent: "center",
            }}
          >
            <div className={style.content} style={{ textAlign: "center" }}>
              Error
              <br />
              {error.message}
              <br />
              <br />
              <button
                className={style.confirmButton}
                onClick={resetErrorBoundary}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      >
        {path.pathname === "/create-wallet" ? (
          <Outlet />
        ) : (
          <Suspense
            fallback={
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  placeItems: "center",
                  placeContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>Loading...</div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        )}
      </ErrorBoundary>
    </div>
  );
}
