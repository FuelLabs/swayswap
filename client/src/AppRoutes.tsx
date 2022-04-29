import { Routes, Route, Navigate } from "react-router-dom";
import { SetupPage } from "src/pages/SetupPage";
import { SwapPage } from "src/pages/SwapPage";
import { AssetsPage } from "src/pages/AssetsPage";
import { Pages } from "src/types/pages";
import { PoolPage } from "src/pages/PoolPage";
import { MintTokenPage } from "src/pages/MintTokenPage";
import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { RemoveLiquidityPage } from "./pages/RemoveLiquidityPage";

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
