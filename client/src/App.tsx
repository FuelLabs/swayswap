import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AppContextProvider } from "src/context/AppContext";

import AppRoutes from "./AppRoutes";

const { PUBLIC_URL } = process.env;

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter basename={PUBLIC_URL}>
        <AppContextProvider>
          <AppRoutes />
        </AppContextProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}
