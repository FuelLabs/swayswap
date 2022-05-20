import toast from "react-hot-toast";
import { BiCoin, BiDotsHorizontalRounded } from "react-icons/bi";
import { FaFaucet } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { AssetItem } from "~/components/AssetItem";
import { Button } from "~/components/Button";
import { Link } from "~/components/Link";
import { Menu } from "~/components/Menu";
import { PageContent } from "~/components/PageContent";
import { Popover, usePopover } from "~/components/Popover";
import { Spinner } from "~/components/Spinner";
import { ENABLE_FAUCET_API } from "~/config";
import { useWallet } from "~/context/AppContext";
import { useAssets } from "~/hooks/useAssets";
import { useFaucet } from "~/hooks/useFaucet";
import { Pages } from "~/types/pages";

export default function AssetsPage() {
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
    faucet.mutate();
    popover.close();
  }

  const titleElementRight = wallet && (
    <div className="flex items-center gap-3">
      {ENABLE_FAUCET_API ? (
        <RouterLink to={Pages.faucet}>
          <FaFaucet />
        </RouterLink>
      ) : (
        <>
          <Button
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
          <MdChecklist className="text-primary-500" />
          Assets
        </div>
      </PageContent.Title>
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
          There&apos; no asset added yet.
          <br />
          <Link onPress={() => faucet.mutate()}>Click here</Link> to generate a
          new asset.
        </div>
      )}
    </PageContent>
  );
}
