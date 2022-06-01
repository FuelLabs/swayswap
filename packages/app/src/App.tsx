import { QueryClientProvider } from "react-query";

import AppRoutes from "~/AppRoutes";
import { Dialog } from "~/components/Dialog";
import { Toaster } from "~/components/Toaster";
import { AppContextProvider } from "~/context/AppContext";
import { StepsProvider } from "~/hooks/useWelcomeSteps";
import { queryClient } from "~/lib/queryClient";

export default function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Dialog.Provider>
          <AppContextProvider>
            <StepsProvider>
              <AppRoutes />
            </StepsProvider>
          </AppContextProvider>
        </Dialog.Provider>
      </QueryClientProvider>
    </>
  );
}
