import { Routes, Route, Navigate } from "react-router-dom";
import { Setup } from "src/pages/Setup";
import { Swap } from "src/pages/Swap";
import { Assets } from "src/pages/Assets";
import { Pages } from "src/types/pages";
import { Pool } from "src/pages/Pool";
import { MintToken } from "src/pages/MintToken";
import { RequireWallet } from "./components/RequireWallet";
import { MainLayout } from "./layouts/MainLayout";
import { RemoveLiquidity } from "./pages/RemoveLiquidity";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="*"
          element={<RequireWallet children={<Navigate to={Pages.assets} />} />}
        />
        <Route path={Pages.setup} element={<Setup />} />
        <Route
          path={Pages.assets}
          element={<RequireWallet children={<Assets />} />}
        />
        <Route
          path={Pages.swap}
          element={<RequireWallet children={<Swap />} />}
        />
        <Route
          path={Pages.pool}
          element={<RequireWallet children={<Pool />} />}
        />
        <Route
          path={Pages.mintToken}
          element={<RequireWallet children={<MintToken />} />}
        />
        <Route
          path={Pages.removeLiquidity}
          element={<RequireWallet children={<RemoveLiquidity />} />}
        />
      </Route>
    </Routes>
  );
}
