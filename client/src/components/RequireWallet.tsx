import { Navigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useWallet } from "src/context/WalletContext";

export const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const { getWallet } = useWallet();
  const wallet = getWallet();

  if (!wallet) {
    return <Navigate to={Pages.setup} replace={true} />;
  }

  return children;
};