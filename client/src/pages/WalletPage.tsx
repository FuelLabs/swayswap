import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { useAppContext, useWallet } from "src/context/AppContext";
import { Spinner } from "src/components/Spinner";
import { AssetItem } from "src/components/AssetItem";
import { WalletCard } from "src/components/WalletCard";
import { Button } from "src/components/Button";
import { useAssets } from "src/hooks/useAssets";
import { useFaucet } from "src/hooks/useFaucet";
import { Link } from "src/components/Link";

const style = {
  sectionTitle: `flex items-center justify-between font-semibold text-xl mb-2`,
};

export default function WalletPage() {
  const wallet = useWallet();
  const { createWallet } = useAppContext();
  const { coins, isLoading, refetch } = useAssets();
  const faucet = useFaucet({
    onSuccess: () => {
      refetch();
    },
  });

  const createWalletMutation = useMutation(async () => createWallet(), {
    onSuccess: () => {
      toast.success("Wallet created successfully!");
    },
  });

  function handleCreateWallet() {
    createWalletMutation.mutate();
  }

  if (!wallet) {
    return (
      <WalletCard>
        <div className="flex flex-col justify-center text-gray-400 prose text-center">
          <h3 className="text-gray-300 mb-0">⚡️ Welcome SwaySwap</h3>
          <p>
            Seems you don&apos; have any wallet yet
            <br /> Click bellow to generate one
          </p>
          <div>
            <Button variant="primary" size="lg" onPress={handleCreateWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </WalletCard>
    );
  }

  return (
    <WalletCard onFaucetAdded={refetch}>
      <div className={style.sectionTitle}>Assets</div>
      {isLoading && (
        <div className="flex justify-start rounded-xl px-2 pt-2">
          <Spinner />
        </div>
      )}
      {coins.map((coin) => {
        return (
          <div className="mt-4" key={coin.assetId}>
            <AssetItem key={coin.assetId} coin={coin} />
          </div>
        );
      })}
      {!isLoading && !Boolean(coins.length) && (
        <div className="text-gray-500 pb-1">
          There&apos; no asset added yet.
          <br />
          <Link onPress={() => faucet.mutate()}>Click here</Link> to generate a
          new asset.
        </div>
      )}
    </WalletCard>
  );
}
