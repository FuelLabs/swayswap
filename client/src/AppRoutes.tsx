import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { Pages } from "./types/pages";

const SetupPage = lazy(() => import("src/pages/SetupPage"));
const SwapPage = lazy(() => import("src/pages/SwapPage"));
const AssetsPage = lazy(() => import("src/pages/AssetsPage"));
const PoolPage = lazy(() => import("src/pages/PoolPage"));
const MintTokenPage = lazy(() => import("src/pages/MintTokenPage"));
const RemoveLiquidityPage = lazy(() => import("./pages/RemoveLiquidityPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="*"
          element={<RequireWallet children={<Navigate to={Pages.assets} />} />}
        />
        <Route path={Pages.setup} element={<SetupPage />} />
        <Route
          path={Pages.assets}
          element={<RequireWallet children={<AssetsPage />} />}
        />
        <Route
          path={Pages.swap}
          element={<RequireWallet children={<SwapPage />} />}
        />
        <Route
          path={Pages.pool}
          element={<RequireWallet children={<PoolPage />} />}
        />
        <Route
          path={Pages.mintToken}
          element={<RequireWallet children={<MintTokenPage />} />}
        />
        <Route
          path={Pages.removeLiquidity}
          element={<RequireWallet children={<RemoveLiquidityPage />} />}
        />
      </Route>
    </Routes>
  );
}
