import Providers from "./components/Providers";

import AppRoutes from "~/AppRoutes";

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}
