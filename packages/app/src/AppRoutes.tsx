import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { Pages } from "./types/pages";

const AddLiquidity = lazy(() => import("./pages/PoolPage/AddLiquidity"));
const CreateWallet = lazy(() => import("~/pages/CreateWallet"));
const PoolPage = lazy(() => import("~/pages/PoolPage/index"));
const PoolsPreview = lazy(() => import("~/pages/PoolPage/Pools"));
const MintPage = lazy(() => import("~/pages/MintPage"));
const RemoveLiquidityPage = lazy(
  () => import("./pages/PoolPage/RemoveLiquidity")
);
const SwapPage = lazy(() => import("~/pages/SwapPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="*"
          element={
            <RequireWallet>
              <Navigate to={Pages.swap} />
            </RequireWallet>
          }
        />
        <Route path={Pages.createWallet} element={<CreateWallet />} />
        <Route
          path={Pages.swap}
          element={
            <RequireWallet>
              <SwapPage />
            </RequireWallet>
          }
        />
        <Route
          path={Pages.mintToken}
          element={
            <RequireWallet>
              <MintPage />
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
          <Route index element={<Navigate to={Pages["pool.list"]} />} />
          <Route path={Pages["pool.list"]} element={<PoolsPreview />} />
          <Route path={Pages["pool.addLiquidity"]} element={<AddLiquidity />} />
          <Route
            path={Pages["pool.removeLiquidity"]}
            element={
              <RequireWallet>
                <RemoveLiquidityPage />
              </RequireWallet>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
