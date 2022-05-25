import { QueryClientProvider } from "react-query";

import AppRoutes from "~/AppRoutes";
import { Dialog } from "~/components/Dialog";
import { Toaster } from "~/components/Toaster";
import { AppContextProvider } from "~/context/AppContext";
import { queryClient } from "~/lib/queryClient";

export default function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Dialog.Provider>
          <AppContextProvider>
            <AppRoutes />
          </AppContextProvider>
        </Dialog.Provider>
      </QueryClientProvider>
    </>
  );
}
