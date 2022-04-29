import { BrowserRouter } from "react-router-dom";
import { WalletProvider } from "src/context/WalletContext";

import AppRoutes from "./AppRoutes";

const { PUBLIC_URL } = process.env;

export default function App() {
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <WalletProvider>
        <AppRoutes />
      </WalletProvider>
    </BrowserRouter>
  );
}
