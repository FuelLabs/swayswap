import { Suspense } from "react";
import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "react-query";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";

import Header from "~/components/Header";
import Skeleton from "~/components/Skeleton";
import { Pages } from "~/types/pages";

const style = {
  wrapper: `min-h-screen w-screen text-white select-none flex flex-col justify-between`,
  content: `w-[30rem] flex-1 rounded-2xl p-4 m-2 text-center`,
  confirmButton: `bg-primary-500 my-2 rounded-2xl py-2 px-8 text-l font-semibold items-center
    justify-center cursor-pointer border border-primary-500 hover:border-primary-600 mt-8`,
};

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const location = useLocation();
  const path = useResolvedPath(location);

  const content = (
    <div className="w-screen flex flex-1 items-center justify-center pb-14">
      <Outlet />
    </div>
  );

  const fallback = (
    <div className="flex flex-1 place-content-center place-items-center">
      <Skeleton />
    </div>
  );

  const fallbackError = ({ error, resetErrorBoundary }: FallbackProps) => (
    <div className="flex flex-1 place-content-center place-items-center">
      <div className={style.content}>
        Error
        <br />
        {error.message}
        <br />
        <br />
        <button className={style.confirmButton} onClick={resetErrorBoundary}>
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className={style.wrapper}>
      <Header />
      <ErrorBoundary onReset={resetReactQuery} fallbackRender={fallbackError}>
        {path.pathname === Pages.createWallet ? (
          content
        ) : (
          <Suspense fallback={fallback}>{content}</Suspense>
        )}
      </ErrorBoundary>
    </div>
  );
}
