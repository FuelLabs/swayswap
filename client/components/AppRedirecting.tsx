import { useRouter } from "next/router";
import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

export function AppRedirecting() {
  const router = useRouter();
  const { getWallet } = useContext(WalletContext);
  const wallet = getWallet();

  if (wallet) {
    router.push('/swap');
  } else {
    router.push('/setup');
  }

  return null;
}
