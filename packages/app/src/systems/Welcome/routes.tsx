import { Route } from "react-router-dom";

import { StepsProvider } from "./hooks";
import { WelcomePage } from "./pages";

import { Pages } from "~/types";

export const welcomeRoutes = (
  <Route
    path={`${Pages.welcome}/*`}
    element={
      <StepsProvider>
        <WelcomePage />
      </StepsProvider>
    }
  />
);
