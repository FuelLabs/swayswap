import type { ReactNode } from "react";
import { Suspense, useContext } from "react";
import { useQueryErrorResetBoundary } from "react-query";

import { AppContext } from "../context";
import { useWallet } from "../hooks";

import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from "./Header";

import { ActionsWidget } from "~/systems/Core";
import { Skeleton } from "~/systems/UI";

type MainLayoutProps = {
  children?: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();
  const wallet = useWallet();
  const ctx = useContext(AppContext);

  return (
    <>
      <main className="mainLayout">
        {!ctx?.justContent && <Header />}
        <div className="mainLayout--wrapper">
          <ErrorBoundary onReset={resetReactQuery}>
            {process.env.NODE_ENV !== "test" ? (
              <Suspense fallback={<Skeleton />}>{children}</Suspense>
            ) : (
              children
            )}
          </ErrorBoundary>
        </div>
        {wallet && !ctx?.justContent && <ActionsWidget />}
      </main>
    </>
  );
}
