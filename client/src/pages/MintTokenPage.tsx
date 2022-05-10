import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { TokenContractAbi__factory } from "src/types/contracts";
import { useWallet } from "src/context/AppContext";
import { TextInput } from "src/components/TextInput";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { objectId } from "src/lib/utils";
import { DECIMAL_UNITS, MINT_AMOUNT, TOKEN_ID } from "src/config";
import { formatUnits } from "ethers/lib/utils";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8`,
};

export default function MintTokenPage() {
  const wallet = useWallet()!;
  const [asset, setAsset] = useState(TOKEN_ID);
  const [isMinting, setMinting] = useState(true);
  const navigate = useNavigate();

  const handleMinCoins = async () => {
    const token = TokenContractAbi__factory.connect(TOKEN_ID, wallet);
    const amount = MINT_AMOUNT;

    try {
      setMinting(true);
      await token.functions.mint_coins(amount);
      // Transfer the just minted coins to the output
      await token.functions.transfer_coins_to_output(
        amount,
        objectId(TOKEN_ID),
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
            Paste the the token contractId
          </label>
          {/* TODO: Add validation of contract id, querying from the the core */}
          {/* TODO: Add validation to match a valid address */}
          {/* https://github.com/FuelLabs/swayswap-demo/issues/41 */}
          <TextInput value={asset} placeholder={""} onChange={setAsset} />
        </div>
        <div
          onClick={(e) => isMinting && handleMinCoins()}
          className={style.confirmButton}
        >
          {isMinting
            ? `Mint ${formatUnits(MINT_AMOUNT, DECIMAL_UNITS)} tokens`
            : `Minting ${formatUnits(MINT_AMOUNT, DECIMAL_UNITS)} tokens...`}
        </div>
      </div>
    </div>
  );
}
