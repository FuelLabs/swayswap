import { Route } from "react-router-dom";

import { HomePage } from "./pages";

import { Pages } from "~/types";

export const homeRoutes = <Route path={Pages.home} element={<HomePage />} />;
