import type { ReactNode } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";

import { useFuel } from "../hooks/useFuel";

import { getCurrent, getAgreement } from "~/systems/Welcome";
import { Pages } from "~/types";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const current = getCurrent();
  const acceptAgreement = getAgreement();
  const fuel = useFuel();

  const { data: isConnected, isLoading } = useQuery(
    ["isConnected", fuel],
    async () => {
      const isFuelConnected = await fuel?.isConnected();
      return isFuelConnected;
    },
    {
      enabled: Boolean(fuel),
    }
  );

  if ((current.id > 4 && acceptAgreement) || (isConnected && !current.id)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div data-testid="fuel-wallet-loading"></div>;
  }

  return <Navigate to={Pages.welcome} replace />;
}
