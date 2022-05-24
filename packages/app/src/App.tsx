import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "~/AppRoutes";
import { Dialog } from "~/components/Dialog";
import { Toaster } from "~/components/Toaster";
import { AppContextProvider } from "~/context/AppContext";
import { queryClient } from "~/lib/queryClient";

const { PUBLIC_URL } = process.env;

export default function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter basename={PUBLIC_URL}>
        <QueryClientProvider client={queryClient}>
          <Dialog.Provider>
            <AppContextProvider>
              <AppRoutes />
            </AppContextProvider>
          </Dialog.Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  );
}
