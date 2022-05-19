import clipboard from "clipboard";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { BiWallet } from "react-icons/bi";
import { FaFaucet, FaRegCopy } from "react-icons/fa";
import { Link } from "react-router-dom";

import { PageContent } from "./PageContent";

import { Button } from "~/components/Button";
import { Spinner } from "~/components/Spinner";
import { ENABLE_FAUCET_API } from "~/config";
import { useWallet } from "~/context/AppContext";
import { useFaucet } from "~/hooks/useFaucet";
import { Pages } from "~/types/pages";

export type WalletPropsCard = {
  children: ReactNode;
  onFaucetAdded?: () => void;
};

export function WalletCard({ children, onFaucetAdded }: WalletPropsCard) {
  const wallet = useWallet();

  const faucetMutation = useFaucet({
    onSuccess: () => {
      toast.success("Faucet added successfully!");
      onFaucetAdded?.();
    },
  });

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
    toast("Address copied", { icon: "✨" });
  };

  const titleElementRight = wallet && (
    <div className="flex items-center gap-3">
      {ENABLE_FAUCET_API ? (
        <Link to={Pages.faucet}>
          <FaFaucet />
        </Link>
      ) : (
        <>
          {faucetMutation.isLoading ? (
            <div className="flex justify-center rounded-xl p-1">
              <Spinner />
            </div>
          ) : (
            <Button variant="ghost" onPress={() => faucetMutation.mutate()}>
              <FaFaucet size="1.2rem" />
            </Button>
          )}
        </>
      )}
    </div>
  );

  return (
    <PageContent>
      <PageContent.Title elementRight={titleElementRight}>
        <div className="flex items-center gap-2 mr-2">
          <BiWallet className="text-primary-500" />
          Wallet
        </div>
        {wallet && (
          <Button aria-label="Copy your wallet address" onPress={handleCopy}>
            <span className="text-gray-100">
              {wallet?.address.slice(0, 4)}...{wallet?.address.slice(-4)}
            </span>
            <FaRegCopy size="1em" />
          </Button>
        )}
      </PageContent.Title>
      {children}
    </PageContent>
  );
}
