import toast from "react-hot-toast";
import { BiCoin, BiDotsHorizontalRounded, BiWallet } from "react-icons/bi";
import { FaFaucet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Card } from "./Card";

import { AssetItem } from "~/components/AssetItem";
import { Button } from "~/components/Button";
import { Link } from "~/components/Link";
import { Menu } from "~/components/Menu";
import { Popover, usePopover } from "~/components/Popover";
import { Spinner } from "~/components/Spinner";
import { ENABLE_FAUCET_API } from "~/config";
import { useWallet } from "~/context/AppContext";
import { useAssets } from "~/hooks/useAssets";
import { useFaucet } from "~/hooks/useFaucet";
import { Pages } from "~/types/pages";

type WalletInfoProps = {
  onClose: () => void;
};

export function WalletInfo({ onClose }: WalletInfoProps) {
  const wallet = useWallet();
  const navigate = useNavigate();
  const popover = usePopover({ placement: "bottom" });
  const { coins, isLoading, refetch } = useAssets();

  const faucet = useFaucet({
    onSuccess: () => {
      toast.success("Faucet added successfully!");
      refetch();
    },
  });

  function handleFaucet() {
    if (ENABLE_FAUCET_API) {
      navigate(Pages.faucet);
      onClose();
      return;
    }
    faucet.mutate();
    popover.close();
  }

  function handleMint() {
    navigate("/mint");
    onClose();
  }

  const titleElementRight = wallet && (
    <div className="flex items-center gap-3">
      <Button
        autoFocus
        variant="ghost"
        isLoading={faucet.isLoading}
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
          <Menu.Item key="mint" onPress={handleMint}>
            <BiCoin size={16} className="text-gray-600" />
            Mint Tokens
          </Menu.Item>
        </Menu>
      </Popover>
    </div>
  );

  return (
    <Card>
      <Card.Title elementRight={titleElementRight}>
        <div className="flex items-center gap-2 mr-2">
          <BiWallet className="text-primary-500" />
          Wallet
        </div>
      </Card.Title>
      {isLoading && (
        <div className="flex justify-start rounded-xl px-2 pt-2">
          <Spinner />
        </div>
      )}
      {coins.map((coin) => (
        <div className="mt-4" key={coin.assetId}>
          <AssetItem key={coin.assetId} coin={coin} />
        </div>
      ))}
      {!isLoading && !coins.length && (
        <div className="text-gray-300 pb-1">
          There is no assets in your wallet.
          <br />
          <Link onPress={() => faucet.mutate()}>Click here</Link> to faucet test
          ether.
        </div>
      )}
    </Card>
  );
}
