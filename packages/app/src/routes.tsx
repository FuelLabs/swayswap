import { Routes, Route, Navigate } from "react-router-dom";

import { homeRoutes } from "./systems/Home";

// import { poolRoutes } from "~/systems/Pool";
import { mintRoutes } from "~/systems/Mint";
import { swapRoutes } from "~/systems/Swap";
import { welcomeRoutes } from "~/systems/Welcome";
import { Pages } from "~/types";

export const routes = (
  <Routes>
    <Route>
      <Route path="*" element={<Navigate to={Pages.home} />} />
      {homeRoutes}
      {welcomeRoutes}
      {swapRoutes}
      {mintRoutes}
      {/* {poolRoutes} */}
    </Route>
  </Routes>
);
