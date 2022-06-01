import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { Pages } from "./types/pages";

/** TODO: for some reason, I can't load this async because of XState and Suspense */
import WelcomePage from "~/pages/WelcomePage";

const AddLiquidity = lazy(() => import("./pages/PoolPage/AddLiquidity"));
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
        <Route path="*" element={<Navigate to={Pages.swap} />} />
        <Route path={`${Pages.welcome}/*`} element={<WelcomePage />}></Route>
        <Route path={Pages.swap} element={<SwapPage />} />
        <Route path={Pages.mint} element={<MintPage />} />
        <Route path={`${Pages.pool}/*`} element={<PoolPage />}>
          <Route index element={<Navigate to={Pages["pool.list"]} />} />
          <Route path={Pages["pool.list"]} element={<PoolsPreview />} />
          <Route path={Pages["pool.addLiquidity"]} element={<AddLiquidity />} />
          <Route
            path={Pages["pool.removeLiquidity"]}
            element={<RemoveLiquidityPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
