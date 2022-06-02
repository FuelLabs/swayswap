import type { ReactNode } from "react";
import { QueryClientProvider } from "react-query";
import { useLocation } from "react-router-dom";

import { Dialog } from "~/components/Dialog";
import { Toaster } from "~/components/Toaster";
import { AppContextProvider } from "~/context/AppContext";
import { queryClient } from "~/lib/queryClient";

export const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

type AppProps = {
  children?: ReactNode;
};

export default function Providers({ children }: AppProps) {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Dialog.Provider>
          <AppContextProvider>{children}</AppContextProvider>
        </Dialog.Provider>
      </QueryClientProvider>
      {process.env.NODE_ENV === "test" && <LocationDisplay />}
    </>
  );
}
