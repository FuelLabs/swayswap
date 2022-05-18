import { FaFaucet, FaRegCopy } from "react-icons/fa";
import { useWallet } from "src/context/AppContext";
import { BiWallet } from "react-icons/bi";
import { Spinner } from "src/components/Spinner";
import { Link } from "react-router-dom";
import { Pages } from "src/types/pages";
import { ENABLE_FAUCET_API } from "src/config";
import classNames from "classnames";
import clipboard from "clipboard";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { ReactNode } from "react";
import { useFaucet } from "src/hooks/useFaucet";

const style = {
  divider: `border border-[#212327] border-b-0`,
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl py-4 m-2`,
  formHeader: `px-6 flex items-center font-semibold text-xl`,
  titleWrapper: `flex items-center flex-1`,
  title: `flex items-center gap-2 mr-4`,
};

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

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div className={style.titleWrapper}>
            <h2 className={style.title}>
              <BiWallet className="text-primary-400" />
              Wallet
            </h2>
            {wallet && (
              <Button
                aria-label="Copy your wallet address"
                onPress={handleCopy}
              >
                <span className="text-gray-100">
                  {wallet?.address.slice(0, 4)}...{wallet?.address.slice(-4)}
                </span>
                <FaRegCopy size="1em" />
              </Button>
            )}
          </div>
          {wallet && (
            <div className="flex w-10 justify-center rounded-xl p-1">
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
                    <Button
                      variant="ghost"
                      onPress={() => faucetMutation.mutate()}
                    >
                      <FaFaucet size="1.2rem" />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div className={classNames(style.divider, "my-4")} />
        <div className="px-6 pb-2">{children}</div>
      </div>
    </div>
  );
}
