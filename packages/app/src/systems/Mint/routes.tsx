import { Route } from "react-router-dom";

import { PrivateRoute } from "../Core";

import { MintPage } from "./pages";

import { Pages } from "~/types";

export const mintRoutes = (
  <Route
    path={Pages.mint}
    element={
      <PrivateRoute>
        <MintPage />
      </PrivateRoute>
    }
  />
);
