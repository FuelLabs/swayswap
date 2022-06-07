import type { ReactNode } from "react";
import type { ErrorBoundaryProps as RootProps } from "react-error-boundary";
import { ErrorBoundary as Root } from "react-error-boundary";

type ErrorBoundaryProps = Pick<RootProps, "onReset"> & { children: ReactNode };

export function ErrorBoundary({ children, onReset }: ErrorBoundaryProps) {
  if (process.env.NODE_ENV === "test") return <>children</>;
  return (
    <Root
      onReset={onReset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div
          className="mainLayout--errorContent"
          style={{ textAlign: "center" }}
        >
          Error
          <br />
          {error.message}
          <br />
          <br />
          <button
            className="mainLayout--confirmBtn"
            onClick={resetErrorBoundary}
          >
            Reset
          </button>
        </div>
      )}
    >
      {children}
    </Root>
  );
}
