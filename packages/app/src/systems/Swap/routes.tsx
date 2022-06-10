import { Route } from "react-router-dom";

import { PrivateRoute } from "../Core";

import { SwapPage } from "./pages";

import { Pages } from "~/types";

export const swapRoutes = (
  <Route
    path={Pages.swap}
    element={
      <PrivateRoute>
        <SwapPage />
      </PrivateRoute>
    }
  />
);
