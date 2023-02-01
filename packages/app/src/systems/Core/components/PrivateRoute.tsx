import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useWallet } from "../hooks";

import { getCurrent, getAgreement } from "~/systems/Welcome";
import { Pages } from "~/types";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const current = getCurrent();
  const acceptAgreement = getAgreement();
  const { wallet } = useWallet();
  if ((current.id > 2 && acceptAgreement) || (wallet && !current.id)) {
    return <>{children}</>;
  }
  return <Navigate to={Pages.welcome} replace />;
}
