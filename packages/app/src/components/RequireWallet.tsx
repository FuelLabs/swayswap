import { Navigate } from "react-router-dom";

import { useWallet } from "~/hooks/useWallet";
import { Pages } from "~/types/pages";

export const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const wallet = useWallet();

  if (!wallet) {
    return <Navigate to={Pages.createWallet} replace={true} />;
  }

  return children;
};
