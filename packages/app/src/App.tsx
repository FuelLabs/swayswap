import toast from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import AppRoutes from "./AppRoutes";
import { Dialog } from "./components/Dialog";
import { Toaster } from "./components/Toaster";

import { AppContextProvider } from "~/context/AppContext";

const { PUBLIC_URL } = process.env;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        toast.error((error as Error).message);
      },
      // These two are annoying during development
      retry: false,
      refetchOnWindowFocus: false,
      // This is disabled because it causes a bug with arrays with named keys
      // For example, if a query returns: [BN, BN, a: BN, b: BN]
      // with this option on it will be cached as: [BN, BN]
      // and break our code
      structuralSharing: false,
    },
    mutations: {
      onError: (error) => {
        toast.error((error as Error).message);
      },
    },
  },
});

export default function App() {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
}
