import { useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { TextInput } from "src/components/TextInput";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { sleep } from "src/lib/utils";
import { DECIMAL_UNITS, MINT_AMOUNT, TOKEN_ID } from "src/config";
import { formatUnits } from "ethers/lib/utils";
import { useMutation } from "react-query";
import { useTokenMethods } from "src/hooks/useTokensMethods";
import toast from "react-hot-toast";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-primary-500 my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-primary-500 hover:border-primary-600 mt-8`,
};

export default function MintTokenPage() {
  const [asset, setAsset] = useState(TOKEN_ID);
  const methods = useTokenMethods(TOKEN_ID);
  const navigate = useNavigate();

  const mintMutation = useMutation(
    async () => {
      const amount = MINT_AMOUNT;
      await methods.mint(amount);
      // Transfer minted coins to the output
      await methods.transferTo(amount, { variableOutputs: 1 });
      await sleep(1000);
    },
    {
      onSuccess: () => {
        // Navigate to assets page to show new cons
        // https://github.com/FuelLabs/swayswap-demo/issues/40
        toast.success(`Token minted successfully!`);
        navigate(Pages.wallet);
      },
    }
  );

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
          <label className="mx-2 mb-2 flex text-gray-300">
            Paste the the token contractId
          </label>
          {/* TODO: Add validation of contract id, querying from the the core */}
          {/* TODO: Add validation to match a valid address */}
          {/* https://github.com/FuelLabs/swayswap-demo/issues/41 */}
          <TextInput value={asset} placeholder={""} onChange={setAsset} />
        </div>
        <div
          onClick={() => !mintMutation.isLoading && mintMutation.mutate()}
          className={style.confirmButton}
        >
          {!mintMutation.isLoading
            ? `Mint ${formatUnits(MINT_AMOUNT, DECIMAL_UNITS)} tokens`
            : `Minting ${formatUnits(MINT_AMOUNT, DECIMAL_UNITS)} tokens...`}
        </div>
      </div>
    </div>
  );
}
