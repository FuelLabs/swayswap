import { Navigate, useLocation, useResolvedPath } from "react-router-dom";

import { useWallet } from "~/context/AppContext";
import { Pages } from "~/types/pages";

export const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const wallet = useWallet();
  const location = useLocation();
  const path = useResolvedPath(location.pathname);

  if (!wallet && path.pathname !== "/wallet") {
    return <Navigate to={Pages.wallet} replace={true} />;
  }

  return children;
};
