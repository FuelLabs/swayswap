import { formatUnits } from "ethers/lib/utils";
import { useState } from "react";
import { useContract, useWallet } from "src/context/AppContext";
import coins from "src/lib/CoinsMetadata";
import { CoinInput } from "src/components/CoinInput";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { CONTRACT_ID, DECIMAL_UNITS } from "src/config";
import { useMutation, useQuery } from "react-query";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8 w-full
    disabled:bg-[#a0bbb1]`,
};

export default function RemoveLiquidityPage() {
  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const [amount, setAmount] = useState(null as bigint | null);
  const wallet = useWallet()!;
  const contract = useContract()!;
  const navigate = useNavigate();

  const { data: balance } = useQuery(
    "RemoveLiquidityPage-balance",
    async () => {
      const balances = await wallet.getBalances();
      const balance = balances.find((b) => b.assetId === CONTRACT_ID)!;
      return balance.amount;
    }
  );

  const removeLiquidityMutation = useMutation(
    async () => {
      if (!amount) {
        throw new Error('"amount" is required');
      }
      if (amount > (balance || 0)) {
        alert("Amount is bigger them the current balance!");
      }

      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      await contract.functions.remove_liquidity(1, 1, 1000, {
        forward: [amount, CONTRACT_ID],
        variableOutputs: 2,
      });
    },
    {
      onSuccess: () => {
        navigate(Pages.wallet);
      },
    }
  );

  if (!liquidityToken) {
    return null;
  }

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Remove liquidity</h1>
        </div>
        <div className="mt-8 mb-10">
          <CoinInput
            coin={liquidityToken}
            amount={amount}
            onChangeAmount={(amount) => setAmount(amount)}
          />
          <div
            className="mt-3 ml-4 cursor-pointer text-slate-400 underline decoration-1"
            onClick={() => setAmount(balance!)}
          >
            Max amount: {balance ? formatUnits(balance, DECIMAL_UNITS) : "..."}
          </div>
        </div>
        <button
          onClick={() => removeLiquidityMutation.mutate()}
          className={style.confirmButton}
          disabled={
            !amount ||
            !balance ||
            amount > balance ||
            removeLiquidityMutation.isLoading
          }
        >
          {removeLiquidityMutation.isLoading
            ? "Removing..."
            : "Remove liquidity"}
        </button>
      </div>
    </div>
  );
}
