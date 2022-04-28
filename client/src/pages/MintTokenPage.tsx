import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { TokenContractAbi__factory } from "src/types/contracts";
import { useWallet } from "src/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { objectId } from "src/lib/utils";
import { MINT_AMOUNT } from "src/config";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Coin, CoinInput } from "src/components/CoinInput";
import { filterCoin, tokens } from "src/lib/SwaySwapMetadata";
import { CoinETH } from "src/lib/constants";
import { Wallet } from "fuels";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
};

export function MintTokenPage() {
  const amount = parseUnits("1", 9);
  const _tokens = tokens.filter((t: Coin) => t.assetId !== CoinETH);
  const wallet = useWallet() as Wallet;
  const [token, setToken] = useState<Coin>(_tokens[0]);
  const [isMinting, setMinting] = useState(true);
  const navigate = useNavigate();

  const handleMinCoins = async () => {
    const tokenContract = TokenContractAbi__factory.connect(token.assetId, wallet);

    try {
      setMinting(true);
      await tokenContract.functions.mint_coins(amount);
      // Transfer the just minted coins to the output
      await tokenContract.functions.transfer_coins_to_output(
        amount,
        objectId(token.assetId),
        objectId(wallet.address),
        {
          variableOutputs: 1,
        }
      );
      // TODO: Improve feedback for the user
      // Navigate to assets page to show new cons
      // https://github.com/FuelLabs/swayswap-demo/issues/40
      navigate(Pages.assets);
    } catch (err) {
      console.error(err);
    }
    setMinting(false);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Mint tokens</h1>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className="mt-8">
          <label className="mx-2 mb-2 flex text-[#B2B9D2]">
            Amount
          </label>
          <CoinInput
            coin={token}
            amount={amount}
            disabled={true}
            coins={filterCoin(_tokens, token)}
            onChangeCoin={setToken}
          />
        </div>
        <div
          onClick={(e) => isMinting && handleMinCoins()}
          className={style.confirmButton}
        >
          {isMinting
            ? `Mint ${formatUnits(MINT_AMOUNT, 9)} tokens`
            : `Minting ${formatUnits(MINT_AMOUNT, 9)} tokens...`}
        </div>
      </div>
    </div>
  );
}
