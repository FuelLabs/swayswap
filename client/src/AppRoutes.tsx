import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { Pages } from "./types/pages";

const SwapPage = lazy(() => import("src/pages/SwapPage"));
const WalletPage = lazy(() => import("src/pages/WalletPage"));
const MintTokenPage = lazy(() => import("src/pages/MintTokenPage"));
const FaucetPage = lazy(() => import("src/pages/FaucetPage"));
const PoolPage = lazy(() => import("src/pages/PoolPage/index"));
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
          element={<RequireWallet children={<Navigate to={Pages.wallet} />} />}
        />
        <Route
          path={Pages.wallet}
          element={<RequireWallet children={<WalletPage />} />}
        />
        <Route
          path={Pages.swap}
          element={<RequireWallet children={<SwapPage />} />}
        />
        <Route
          path={`${Pages.pool}/*`}
          element={<RequireWallet children={<PoolPage />} />}
        >
          <Route index element={<Navigate to={Pages.addLiquidity} />} />
          <Route path={Pages.addLiquidity} element={<AddLiquidity />} />
          <Route
            path={Pages.removeLiquidity}
            element={<RequireWallet children={<RemoveLiquidityPage />} />}
          />
        </Route>
        <Route
          path={Pages.mintToken}
          element={<RequireWallet children={<MintTokenPage />} />}
        />
        <Route
          path={Pages.faucet}
          element={<RequireWallet children={<FaucetPage />} />}
        />
      </Route>
    </Routes>
  );
}
