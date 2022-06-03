import { Route } from "react-router-dom";

import { WelcomePage } from "./pages";

import { Pages } from "~/types";

export const welcomeRoutes = (
  <Route path={`${Pages.welcome}/*`} element={<WelcomePage />} />
);
