import { FaFaucet, FaRegCopy } from "react-icons/fa";
import { useWallet, useAppContext } from "src/context/AppContext";
import { CoinQuantity, toBigInt } from "fuels";
import { Coin } from "src/components/CoinInput";
import CoinsMetadata from "src/lib/CoinsMetadata";
import { Spinner } from "src/components/Spinner";
import { useQuery, useMutation } from "react-query";
import { sleep } from "src/lib/utils";
import { Link } from "react-router-dom";
import { Pages } from "src/types/pages";
import { ENABLE_FAUCET_API } from "src/config";
import classNames from "classnames";
import clipboard from "clipboard";
import { AssetItem } from "src/components/AssetItem";

const style = {
  divider: `border border-[#212327] border-b-0`,
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl py-4 m-2`,
  formHeader: `px-6 flex items-center justify-between font-semibold text-xl pb-2`,
  sectionTitle: `px-2 flex items-center justify-between font-semibold text-xl mb-4`,
  faucetButton: `hover:bg-[#41444F] cursor-pointer p-2 rounded-full flex justify-center`,
  copyButton: `w-8 h-8 flex justify-center items-center p-1`,
  accountContainer: `flex justify-center w-full text-sm my-8`,
  accountContent: `flex items-center border-radius rounded-xl border border-[#3f444e] text-sm p-2 hover:opacity-70 active:opacity-50 cursor-pointer`,
  address: `text-[#e3e9f3] pl-2 pr-2`,
};

type Asset = Coin & { amount: bigint };
const mergeCoinsWithMetadata = (coins: CoinQuantity[]): Array<Asset> => {
  return coins.map((coin) => {
    const coinMetadata = CoinsMetadata.find((c) => c.assetId === coin.assetId);

    return {
      // TODO: Create default Coin Metadata when token didn't have registered data
      // Another options could be querying from the contract
      // https://github.com/FuelLabs/swayswap-demo/issues/33
      name: coinMetadata?.name || "404",
      img: coinMetadata?.img || "/icons/other.svg",
      assetId: coin.assetId,
      amount: toBigInt(coin.amount || 0),
    };
  });
};

export default function WalletPage() {
  const { faucet } = useAppContext();
  const wallet = useWallet();

  const { data: balances, refetch: refetchBalances } = useQuery(
    "AssetsPage-balances",
    () => wallet!.getBalances()
  );

  const handleCopy = () => {
    clipboard.copy(wallet!.address);
  };

  const faucetMutation = useMutation(
    async () => {
      await faucet();
      await sleep(1000);
    },
    {
      onSuccess: () => refetchBalances(),
    }
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Wallet</div>
          <div className="flex w-10 justify-center rounded-xl p-1">
            {ENABLE_FAUCET_API ? (
              <Link to={Pages.faucet} className={style.faucetButton}>
                <FaFaucet />
              </Link>
            ) : (
              <>
                {faucetMutation.isLoading ? (
                  <div className="flex justify-center rounded-xl p-1">
                    <Spinner />
                  </div>
                ) : (
                  <div
                    className={style.faucetButton}
                    onClick={() => faucetMutation.mutate()}
                  >
                    <FaFaucet />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className={style.divider} />
        <div className={style.accountContainer}>
          <div className={style.accountContent} onClick={handleCopy}>
            <span className={style.address}>
              {wallet?.address.slice(0, 8)}...{wallet?.address.slice(-8)}
            </span>
            <button className={style.copyButton}>
              <FaRegCopy size="1.4em" color="#575f6c" />
            </button>
          </div>
        </div>
        <div className={classNames(style.divider, "mb-6")} />
        <div className="px-6">
          <div className={style.sectionTitle}>Assets</div>
          {balances &&
            mergeCoinsWithMetadata(balances).map((coin) => {
              return (
                <div className="my-4" key={coin.assetId}>
                  <AssetItem key={coin.assetId} coin={coin} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
