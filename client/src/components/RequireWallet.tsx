import { Navigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useWallet } from "src/context/AppContext";

export const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const wallet = useWallet();

  if (!wallet) {
    return <Navigate to={Pages.setup} replace={true} />;
  }

  return children;
};
