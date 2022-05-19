import clipboard from "clipboard";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { BiCoin, BiDotsHorizontalRounded, BiWallet } from "react-icons/bi";
import { FaFaucet, FaRegCopy } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { Menu } from "./Menu";
import { PageContent } from "./PageContent";
import { Popover, usePopover } from "./Popover";

import { Button } from "~/components/Button";
import { ENABLE_FAUCET_API } from "~/config";
import { useWallet } from "~/context/AppContext";
import { useFaucet } from "~/hooks/useFaucet";
import { Pages } from "~/types/pages";
import { Spinner } from "./Spinner";

export type WalletPropsCard = {
  children: ReactNode;
  onFaucetAdded?: () => void;
};

export function WalletCard({ children, onFaucetAdded }: WalletPropsCard) {
  const wallet = useWallet();
  const navigate = useNavigate();
  const popover = usePopover({ placement: "bottom" });

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

  function handleFaucet() {
    faucetMutation.mutate();
    popover.close();
  }

  const titleElementRight = wallet && (
    <div className="flex items-center gap-3">
      {ENABLE_FAUCET_API ? (
        <Link to={Pages.faucet}>
          <FaFaucet />
        </Link>
      ) : (
        <>
          <Button
            variant="ghost"
            isLoading={faucetMutation.isLoading}
            {...popover.getTriggerProps()}
          >
            <BiDotsHorizontalRounded size="1.2rem" />
          </Button>
          <Popover {...popover.rootProps}>
            <Menu>
              <Menu.Item key="faucet" onPress={handleFaucet}>
                <FaFaucet size={16} className="text-gray-600" />
                Faucet
              </Menu.Item>
              <Menu.Item key="mint" onPress={() => navigate("/mint")}>
                <BiCoin size={16} className="text-gray-600" />
                Mint Tokens
              </Menu.Item>
            </Menu>
          </Popover>
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
