import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";

export function AppRedirecting() {
  const navigate = useNavigate();
  const { getWallet } = useContext(WalletContext);
  const wallet = getWallet();

  if (wallet) {
    navigate("/swap");
  } else {
    navigate("/setup");
  }

  return null;
}
