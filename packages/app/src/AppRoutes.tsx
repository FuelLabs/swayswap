import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { Pages } from "./types/pages";

const SwapPage = lazy(() => import("~/pages/SwapPage"));
const WalletPage = lazy(() => import("~/pages/WalletPage"));
const MintTokenPage = lazy(() => import("~/pages/MintTokenPage"));
const FaucetPage = lazy(() => import("~/pages/FaucetPage"));
const PoolPage = lazy(() => import("~/pages/PoolPage/index"));
const AddLiquidity = lazy(() => import("./pages/PoolPage/AddLiquidity"));
const RemoveLiquidityPage = lazy(
  () => import("./pages/PoolPage/RemoveLiquidity")
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="*"
          element={
            <RequireWallet>
              <Navigate to={Pages.wallet} />
            </RequireWallet>
          }
        />
        <Route
          path={Pages.wallet}
          element={
            <RequireWallet>
              <WalletPage />
            </RequireWallet>
          }
        />
        <Route
          path={Pages.swap}
          element={
            <RequireWallet>
              <SwapPage />
            </RequireWallet>
          }
        />
        <Route
          path={`${Pages.pool}/*`}
          element={
            <RequireWallet>
              <PoolPage />
            </RequireWallet>
          }
        >
          <Route index element={<Navigate to={Pages.addLiquidity} />} />
          <Route path={Pages.addLiquidity} element={<AddLiquidity />} />
          <Route
            path={Pages.removeLiquidity}
            element={
              <RequireWallet>
                <RemoveLiquidityPage />
              </RequireWallet>
            }
          />
        </Route>
        <Route
          path={Pages.mintToken}
          element={
            <RequireWallet>
              <MintTokenPage />
            </RequireWallet>
          }
        />
        <Route
          path={Pages.faucet}
          element={
            <RequireWallet>
              <FaucetPage />
            </RequireWallet>
          }
        />
      </Route>
    </Routes>
  );
}
