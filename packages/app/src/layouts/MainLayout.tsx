import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import { FaucetWidget } from "~/components/FaucetWidget";
import Header from "~/components/Header";
import Skeleton from "~/components/Skeleton";
import { useWallet } from "~/context/AppContext";
import { Pages } from "~/types/pages";

const style = {
  centered: `flex flex-1 place-content-center place-items-center`,
  wrapper: `min-h-screen w-screen text-white flex flex-col justify-between overflow-y-auto`,
  content: `w-[30rem] flex-1 rounded-2xl p-4 m-2`,
  confirmButton: `bg-primary-500 my-2 rounded-2xl py-2 px-8 text-l font-semibold items-center
    justify-center cursor-pointer border border-primary-500 hover:border-primary-600 mt-8`,
};

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const location = useLocation();
  const path = useResolvedPath(location);
  const wallet = useWallet();

  return (
    <div className={style.wrapper}>
      <Header />
      <ErrorBoundary
        onReset={resetReactQuery}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className={style.centered}>
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
        {path.pathname === Pages.createWallet ? (
          <div className="w-screen flex flex-1 pb-14">
            <Outlet />
          </div>
        ) : (
          <Suspense
            fallback={
              <div className={style.centered}>
                <Skeleton />
              </div>
            }
          >
            <div className={style.centered}>
              <div className="-translate-y-[40px]">
                <Outlet />
              </div>
            </div>
          </Suspense>
        )}
      </ErrorBoundary>
      {wallet && (
        <>
          <FaucetWidget />
        </>
      )}
    </div>
  );
}
