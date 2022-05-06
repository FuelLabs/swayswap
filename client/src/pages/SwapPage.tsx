import { useEffect, useState } from "react";
import { RiSettings3Fill } from "react-icons/ri";
import { assets, filterAssets, NativeAsset } from "src/lib/SwaySwapMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { InvertButton } from "src/components/InvertButton";
import { useExchangeContract, useSwaySwapContract, useWallet } from "src/context/AppContext";
import { ExchangeContractAbi, ExchangeContractAbi__factory, SwayswapContractAbi__factory } from "src/types/contracts";
import { BigNumber, NativeAssetId, ZeroBytes32 } from "fuels";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { EXCHANGE_CONTRACT_ID } from "src/config";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
    justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8 w-full
    disabled:bg-[#a0bbb1]`,
  switchDirection: `flex items-center justify-center -my-3`,
};

const getSwapWithMaximumForwardAmount = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BigNumber
) => {
  const forwardAmount =
    await contract.callStatic.swap_with_maximum_forward_amount(amount, {
      forward: [1, assetId],
    });
  return forwardAmount;
};

const getSwapWithMinimumMinValue = async (
  contract: ExchangeContractAbi,
  assetId: string,
  amount: BigNumber
) => {
  const minValue = await contract.callStatic.swap_with_minimum_min_value(
    amount,
    {
      forward: [1, assetId],
    }
  );
  return minValue;
};

const oneSide = [NativeAsset];
const otherSide = assets;

export default function SwapPage() {
  const wallet = useWallet()!;
  const swaySwapContract = useSwaySwapContract()!;
  const [exchangeId, setExchangeId] = useState('');
  const exchangeContract = useExchangeContract(exchangeId)!;
  const [[assetsTo, assetsFrom], setSides] = useState<[Coin[], Coin[]]>([
    oneSide,
    otherSide,
  ]) 
  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);
  const [fromAmount, setFromAmount] = useState<BigNumber>(BigNumber.from(0));
  const [toAmount, setToAmount] = useState<BigNumber>(BigNumber.from(0));
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [poolExists, setPoolExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const tokenId = coinFrom.assetId === NativeAssetId ? coinTo.assetId : coinFrom.assetId;
      const exchangeId = await swaySwapContract.callStatic.get_exchange_contract(tokenId);

      setPoolExists(exchangeId !== ZeroBytes32);
      setExchangeId(exchangeId);
      // const exchangeContract = ExchangeContractAbi__factory.connect(exchangeId, wallet);
      // const poolInfo = await exchangeContract.callStatic.get_info();
      // const reserveETH = BigNumber.from(poolInfo.eth_reserve);
      // const reserveToken = BigNumber.from(poolInfo.token_reserve);
      // if (coinFrom.assetId === NativeAssetId) {
      //   setReserveEmpty(reserveETH.gte(fromAmount) && reserveToken.gte(toAmount));
      // } else {
      //   setReserveEmpty(reserveToken.gte(fromAmount) && reserveETH.gte(toAmount));
      // }
    })();
  }, [coinFrom, coinTo]);

  const handleSubmit = async (e: any) => {
    if (!fromAmount) {
      throw new Error('"fromAmount" is required');
    }
    if (!toAmount) {
      throw new Error('"toAmount" is required');
    }

    const deadline = 1000;

    if (mode === "with_maximum") {
      const forwardAmount = await getSwapWithMaximumForwardAmount(
        exchangeContract,
        coinFrom.assetId,
        toAmount
      );
      await exchangeContract.functions.swap_with_maximum(toAmount, deadline, {
        forward: [forwardAmount, coinFrom.assetId],
        variableOutputs: 1,
      });
    } else if (mode === "with_minimum") {
      const minValue = await getSwapWithMinimumMinValue(
        exchangeContract,
        coinFrom.assetId,
        fromAmount
      );
      await exchangeContract.functions.swap_with_minimum(minValue, deadline, {
        forward: [fromAmount, coinFrom.assetId],
        variableOutputs: 1,
      });
    } else {
      throw new Error(`Invalid mode "${mode}"`);
    }

    // TODO: Improve feedback after swap
    //
    navigate(Pages.assets);
  };

  const setAmountField = (amount: BigNumber, field: "from" | "to") => {
    if (field === "from" && mode !== "with_maximum") {
      setFromAmount(amount);
      if (amount) {
        setIsLoading(true);
        (async () => {
          const minValue = await getSwapWithMinimumMinValue(
            exchangeContract,
            coinFrom.assetId,
            amount
          );

          setToAmount(minValue);
        })().finally(() => setIsLoading(false));
      }
    } else if (field === "to" && mode !== "with_minimum") {
      setToAmount(amount);
      if (amount) {
        setIsLoading(true);
        (async () => {
          const forwardAmount = await getSwapWithMaximumForwardAmount(
            exchangeContract,
            coinFrom.assetId,
            amount
          );

          setFromAmount(forwardAmount);
        })().finally(() => setIsLoading(false));
      }
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Swap</h1>
          <div>
            <RiSettings3Fill />
          </div>
        </div>

        <div className="mt-6">
          <CoinInput
            coin={coinFrom}
            amount={fromAmount}
            onInput={() => setMode("with_minimum")}
            onChangeAmount={(amount) => setAmountField(amount, "from")}
            coins={filterAssets(assetsTo, [coinFrom, coinTo])}
            onChangeCoin={(coin: Coin) => setCoins([coin, coinTo])}
          />
        </div>
        <div className={style.switchDirection}>
          <InvertButton
            onClick={() => {
              const _toAmount = toAmount;
              setToAmount(fromAmount);
              setFromAmount(_toAmount);
              setCoins([coinTo, coinFrom]);
              setSides([assetsFrom, assetsTo]);
            }}
          />
        </div>
        <div className="mb-10">
          <CoinInput
            coin={coinTo}
            amount={toAmount}
            onInput={() => setMode("with_maximum")}
            onChangeAmount={(amount) => setAmountField(amount, "to")}
            coins={filterAssets(assetsFrom, [coinFrom, coinTo])}
            onChangeCoin={(coin: Coin) => setCoins([coinFrom, coin])}
          />
        </div>
        <button
          disabled={!poolExists}
          className={style.confirmButton}
          onClick={(e) => handleSubmit(e)}>
          Confirm
        </button>
      </div>
    </div>
  );
}
