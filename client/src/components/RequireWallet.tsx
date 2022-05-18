import { Navigate, useLocation, useResolvedPath } from "react-router-dom";
import { Pages } from "src/types/pages";
import { useWallet } from "src/context/AppContext";

export const RequireWallet = ({ children }: { children: JSX.Element }) => {
  const wallet = useWallet();
  const location = useLocation();
  const path = useResolvedPath(location.pathname);

  if (!wallet && path.pathname !== "/wallet") {
    return <Navigate to={Pages.wallet} replace={true} />;
  }

  return children;
};
