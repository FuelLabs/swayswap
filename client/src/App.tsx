import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { WalletProvider } from "src/context/WalletContext";

import AppRoutes from "./AppRoutes";

const { PUBLIC_URL } = process.env;

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter basename={PUBLIC_URL}>
        <WalletProvider>
          <AppRoutes />
        </WalletProvider>
      </BrowserRouter>
    </RecoilRoot>
  );
}
