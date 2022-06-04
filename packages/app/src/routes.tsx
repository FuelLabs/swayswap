import { Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "~/systems/Core";
import { mintRoutes } from "~/systems/Mint";
import { poolRoutes } from "~/systems/Pool";
import { swapRoutes } from "~/systems/Swap";
import { welcomeRoutes } from "~/systems/Welcome";
import { Pages } from "~/types";

export const routes = (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="*" element={<Navigate to={Pages.swap} />} />
      {welcomeRoutes}
      {swapRoutes}
      {mintRoutes}
      {poolRoutes}
    </Route>
  </Routes>
);
