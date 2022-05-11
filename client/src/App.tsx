import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AppContextProvider } from "src/context/AppContext";
import { QueryClient, QueryClientProvider } from "react-query";

import AppRoutes from "./AppRoutes";

const { PUBLIC_URL } = process.env;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        alert((error as Error).message);
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
        alert((error as Error).message);
      },
    },
  },
});

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter basename={PUBLIC_URL}>
        <QueryClientProvider client={queryClient}>
          <AppContextProvider>
            <AppRoutes />
          </AppContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}
