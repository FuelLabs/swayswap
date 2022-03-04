import "./index.css";
import {
  useWallet,
  WalletContext,
  WalletProvider,
} from "src/context/WalletContext";
import Header from "src/components/Header";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import { Setup } from "src/components/Setup";
import { Swap } from "src/components/Swap";
import { Assets } from "src/components/Assets";
import { Children, useContext } from "react";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#282c34] text-white select-none flex flex-col justify-between`,
};

const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const { getWallet } = useWallet();
  const wallet = getWallet();

  if (!wallet) {
    return <Navigate to={"/setup"} replace={true} />;
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
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="*"
          element={<RequireWallet children={<Navigate to={"/assets"} />} />}
        />
        <Route path="/setup" element={<Setup />} />
        <Route
          path="/assets"
          element={<RequireWallet children={<Assets />} />}
        />
        <Route path="/swap" element={<RequireWallet children={<Swap />} />} />
      </Route>
    </Routes>
  );
}

export default App;
