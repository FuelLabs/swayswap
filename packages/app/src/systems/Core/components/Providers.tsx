import type { ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import { useLocation } from "react-router-dom";

import { AppContextProvider } from "../context";
import { queryClient } from "../utils";

import { Toaster, Dialog } from "~/systems/UI";

export const LocationDisplay = () => {
  const location = useLocation();
  return <div>{location.pathname}</div>;
};

type AppProps = {
  children?: ReactNode;
};

const IS_TEST = process.env.NODE_ENV === "test";

export function Providers({ children }: AppProps) {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Dialog.Provider>
          <AppContextProvider justContent={IS_TEST}>
            {children}
          </AppContextProvider>
        </Dialog.Provider>
      </QueryClientProvider>
      {IS_TEST && <LocationDisplay />}
    </>
  );
}
