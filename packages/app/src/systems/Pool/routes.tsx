import { Navigate, Route } from "react-router-dom";

import { PoolPage, RemoveLiquidityPage, Pools } from "./pages";
import { AddLiquidityPortal } from "./portals/AddLiquidityPortal";

import { Pages } from "~/types";

export const poolRoutes = (
  <Route path={`${Pages.pool}/*`} element={<PoolPage />}>
    <Route index element={<Navigate to={Pages["pool.list"]} />} />
    <Route path={Pages["pool.list"]} element={<Pools />} />
    <Route path={Pages["pool.addLiquidity"]} element={<AddLiquidityPortal />} />
    <Route
      path={Pages["pool.removeLiquidity"]}
      element={<RemoveLiquidityPage />}
    />
  </Route>
);
