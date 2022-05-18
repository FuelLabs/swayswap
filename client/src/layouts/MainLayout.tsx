import Header from "src/components/Header";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "react-query";
import { Suspense } from "react";

const style = {
  wrapper: `min-h-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`,
  content: `bg-[#191B1F] w-[30rem] flex-1 rounded-2xl p-4 m-2`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-2 px-8 text-l font-semibold items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
};

export function MainLayout() {
  const { reset: resetReactQuery } = useQueryErrorResetBoundary();

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
      </ErrorBoundary>
    </div>
  );
}
