import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { getCurrent } from "~/systems/Welcome";
import { Pages } from "~/types";

export function PrivateRoute({ children }: { children: ReactNode }) {
  if (getCurrent().id > 2) return <>{children}</>;
  return <Navigate to={Pages.welcome} replace />;
}
