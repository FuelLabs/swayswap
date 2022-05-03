import { formatUnits } from "ethers/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useWallet } from "src/context/AppContext";
import { SwayswapContractAbi__factory } from "src/types/contracts";
import coins from "src/lib/CoinsMetadata";
import { CoinInput } from "src/components/CoinInput";
import { useNavigate } from "react-router-dom";
import { BigNumber } from "fuels";
import { Pages } from "src/types/pages";
import { CONTRACT_ID } from "src/config";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8 w-full
    disabled:bg-[#a0bbb1]`,
};

export const RemoveLiquidityPage = () => {
  const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
  const [amount, setAmount] = useState(null as BigNumber | null);
  const [balance, setBalance] = useState(null as BigNumber | null);
  const [isLoading, setLoading] = useState(false);
  const wallet = useWallet()!;
  const navigate = useNavigate();

  const retrieveLiquidityToken = useCallback(async () => {
    const coins = await wallet.getBalances();
    const liquidityToken = coins.find((c) => c.assetId === CONTRACT_ID);
    return liquidityToken;
  }, [wallet]);

  const removeLiquidity = async () => {
    if (!amount) {
      throw new Error('"amount" is required');
    }
    setLoading(true);
    const liquidityToken = await retrieveLiquidityToken();
    if (amount?.gt(liquidityToken?.amount ?? 0)) {
      alert("Amount is bigger them the current balance!");
    }
    try {
      const swayswap = SwayswapContractAbi__factory.connect(
        CONTRACT_ID,
        wallet
      );
      // TODO: Add way to set min_eth and min_tokens
      // https://github.com/FuelLabs/swayswap/issues/55
      await swayswap.functions.remove_liquidity(1, 1, 1000, {
        forward: [amount, CONTRACT_ID],
        variableOutputs: 2,
      });
      navigate(Pages.assets);
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const liquidityToken = await retrieveLiquidityToken();
      setBalance(liquidityToken?.amount ?? BigNumber.from(0));
    };
    init();
  }, [retrieveLiquidityToken]);

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
            onClick={() => setAmount(balance)}
          >
            Max amount: {balance ? formatUnits(balance, 9) : "..."}
          </div>
        </div>
        <button
          onClick={(e) => removeLiquidity()}
          className={style.confirmButton}
          disabled={!amount || !balance || amount.gt(balance) || isLoading}
        >
          {isLoading ? "Removing..." : "Remove liquidity"}
        </button>
      </div>
    </div>
  );
};
