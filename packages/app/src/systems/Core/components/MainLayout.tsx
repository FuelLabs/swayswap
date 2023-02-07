import type { ReactNode } from "react";
import { Suspense, useContext } from "react";
import { useQueryErrorResetBoundary } from "react-query";

import { AppContext } from "../context";
import { useBreakpoint, useWallet } from "../hooks";

import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from "./Header";

import { ActionsWidget } from "~/systems/Core";
import { SkeletonLoader } from "~/systems/UI";

type MainLayoutProps = {
  children?: ReactNode;
};

function MainLayoutLoader() {
  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "sm";
  const width = isSmall ? 300 : 410;

  return (
    <SkeletonLoader
      width={width}
      height={300}
      viewBox={`0 0 ${width} 300`}
      backgroundColor="#17191C"
      foregroundColor="#2D3138"
    >
      <rect y="0" width="82" height="37" rx="10" />
      <rect y="51" width={width} height="85" rx="10" />
      <rect y="150" width={width} height="85" rx="10" />
      <rect y="249" width={width} height="51" rx="10" />
    </SkeletonLoader>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const { wallet } = useWallet();
  const ctx = useContext(AppContext);

  return (
    <>
      <main className="mainLayout">
        {!ctx?.justContent && <Header />}
        <div className="mainLayout--wrapper">
          <ErrorBoundary onReset={resetReactQuery}>
            {process.env.NODE_ENV !== "test" ? (
              <Suspense fallback={<MainLayoutLoader />}>{children}</Suspense>
            ) : (
              children
            )}
          </ErrorBoundary>
          {/* {wallet && !ctx?.justContent && <ActionsWidget />} */}
        </div>
      </main>
    </>
  );
}
