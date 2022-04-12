import "./index.css";
import {
  useWallet,
} from "src/context/WalletContext";
import Header from "src/components/Header";
import { Routes as Router, Route, Navigate, Outlet } from "react-router-dom";
import { Setup } from "src/components/Setup";
import { Swap } from "src/components/Swap";
import { Assets } from "src/components/Assets";
import { Routes } from "src/types/routes";
import { Pool } from "src/components/Pool";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`,
};

const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const { getWallet } = useWallet();
  const wallet = getWallet();

  if (!wallet) {
    return <Navigate to={Routes.setup} replace={true} />;
  }

  return children;
};

function Layout() {
  return (
    <div className={style.wrapper}>
      <Header />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Route element={<Layout />}>
        <Route
          path="*"
          element={<RequireWallet children={<Navigate to={Routes.assets} />} />}
        />
        <Route path={Routes.setup} element={<Setup />} />
        <Route
          path={Routes.assets}
          element={<RequireWallet children={<Assets />} />}
        />
        <Route path={Routes.swap} element={<RequireWallet children={<Swap />} />} />
        <Route path={Routes.pool} element={<RequireWallet children={<Pool />} />} />
      </Route>
    </Router>
  );
}

export default App;
