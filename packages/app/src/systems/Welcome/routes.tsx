import { Route } from "react-router-dom";

import { WelcomeStepsProvider } from "./hooks";
import { WelcomePage } from "./pages";

import { Pages } from "~/types";

export const welcomeRoutes = (
  <Route
    path={`${Pages.welcome}/*`}
    element={
      <WelcomeStepsProvider>
        <WelcomePage />
      </WelcomeStepsProvider>
    }
  />
);
