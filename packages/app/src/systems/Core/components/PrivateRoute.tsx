import type { ReactNode } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";

import { useFuel } from "../hooks/useFuel";

import { getAgreement } from "~/systems/Welcome";
import { Pages } from "~/types";

export function PrivateRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const acceptAgreement = getAgreement();
  const { fuel, error } = useFuel();
  const { data: isConnected, isLoading } = useQuery(
    ["isConnected", fuel !== undefined],
    async () => {
      const isFuelConnected = await fuel?.isConnected();
      return isFuelConnected;
    },
    {
      enabled: Boolean(fuel),
    }
  );

  function handleWalletConnectionError() {
    localStorage.clear();
    navigate(Pages.welcome);
  }

  useEffect(() => {
    if (error !== "") {
      handleWalletConnectionError();
    }
  }, [error]);

  useEffect(() => {
    const timeoutConnection = setInterval(async () => {
      const isFuelConnected = await fuel?.isConnected();
      if (!isFuelConnected) {
        handleWalletConnectionError();
      }
    }, 1000);
    return () => {
      clearTimeout(timeoutConnection);
    };
  }, [isConnected, fuel]);

  if (acceptAgreement) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div data-testid="fuel-wallet-loading"></div>;
  }

  return <Navigate to={Pages.welcome} replace />;
}
