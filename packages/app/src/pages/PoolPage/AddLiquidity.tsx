/* eslint-disable no-nested-ternary */
import classNames from "classnames";
import { formatUnits } from "ethers/lib/utils";
import { toNumber } from "fuels";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiCheckFill } from "react-icons/ri";

import { poolFromAmountAtom, poolToAmountAtom } from "./jotai";

import { Button } from "~/components/Button";
import { CoinInput, useCoinInput } from "~/components/CoinInput";
import { CoinSelector } from "~/components/CoinSelector";
import { PreviewItem, PreviewTable } from "~/components/PreviewTable";
import { Spinner } from "~/components/Spinner";
import { CONTRACT_ID, DECIMAL_UNITS } from "~/config";
import { useContract } from "~/context/AppContext";
import { useAddLiquidity } from "~/hooks/useAddLiquidity";
import { usePoolInfo } from "~/hooks/usePoolInfo";
import { usePreviewLiquidity } from "~/hooks/usePreviewLiquidity";
import assets from "~/lib/CoinsMetadata";
import { calculateRatio } from "~/lib/asset";
import type { Coin } from "~/types";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 w-[30rem] rounded-2xl p-4 m-2`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  info: `font-mono my-4 px-4 py-3 text-sm text-slate-400 decoration-1 border border-dashed border-white/10 rounded-lg`,
  createPoolInfo: `font-mono my-4 px-4 py-3 text-sm text-slate-400 decoration-1 border border-dashed border-white/10 rounded-lg max-w-[400px]`,
};

function PoolLoader({
  loading,
  step,
  steps,
}: {
  coinFrom: Coin;
  coinTo: Coin;
  loading: boolean;
  step: number;
  steps: string[];
}) {
  return (
    <ul className="w-full rounded-lg border border-gray-600 text-gray-900">
      {steps.map((stepText, index) => (
        <li
          key={index}
          className={classNames(
            "space-between flex w-full items-center border-b border-gray-600 px-6 py-2 text-white",
            {
              "rounded-t-lg": index === 0,
              "bg-primary-500": step === index && loading,
              "rounded-b-lg": index === steps.length,
            }
          )}
        >
          <div className="flex-1">{stepText}</div>
          {step === index && loading && <Spinner />}
          {step > index && <RiCheckFill />}
        </li>
      ))}
    </ul>
  );
}

export default function AddLiquidity() {
  const [fromInitialAmount, setFromInitialAmount] = useAtom(poolFromAmountAtom);
  const [toInitialAmount, setToInitialAmount] = useAtom(poolToAmountAtom);

  const contract = useContract()!;

  const [[coinFrom, coinTo], setCoins] = useState<[Coin, Coin]>([
    assets[0],
    assets[1],
  ]);

  const poolInfoQuery = usePoolInfo(contract);

  const { data: poolInfo, isLoading: isLoadingPoolInfo } = poolInfoQuery;

  const handleChangeFromValue = (val: bigint | null) => {
    fromInput.setAmount(val);

    if (reservesFromToRatio) {
      const value = val || BigInt(0);
      const newToValue = Math.round(toNumber(value) / reservesFromToRatio);
      toInput.setAmount(BigInt(newToValue));
    }
  };
  const handleChangeToValue = (val: bigint | null) => {
    toInput.setAmount(val);

    if (reservesFromToRatio) {
      const value = val || BigInt(0);
      const newFromValue = Math.round(toNumber(value) * reservesFromToRatio);
      fromInput.setAmount(BigInt(newFromValue));
    }
  };

  const fromInput = useCoinInput({
    coin: coinFrom,
    disableWhenEth: true,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    gasFee: BigInt(1),
    onChange: handleChangeFromValue,
  });

  const toInput = useCoinInput({
    coin: coinTo,
    disableWhenEth: true,
    onChangeCoin: (coin: Coin) => setCoins([coin, coinTo]),
    onChange: handleChangeToValue,
  });

  const reservesFromToRatio = calculateRatio(
    poolInfo?.eth_reserve,
    poolInfo?.token_reserve
  );
  const reservesToFromRatio = calculateRatio(
    poolInfo?.token_reserve,
    poolInfo?.eth_reserve
  );
  const addLiquidityRatio = calculateRatio(fromInput.amount, toInput.amount);

  const {
    mutation: addLiquidityMutation,
    stage,
    errorsCreatePull,
  } = useAddLiquidity({
    fromInput,
    toInput,
    poolInfoQuery,
    coinFrom,
    coinTo,
    reservesFromToRatio,
    addLiquidityRatio,
  });

  useEffect(() => {
    fromInput.setAmount(fromInitialAmount);
    toInput.setAmount(toInitialAmount);
  }, []);

  useEffect(() => {
    setFromInitialAmount(fromInput.amount);
    setToInitialAmount(toInput.amount);
  }, [fromInput.amount, toInput.amount]);

  const { previewTokensToReceive, nextCurrentPoolShare } = usePreviewLiquidity({
    fromInput,
    poolInfo,
    contractId: CONTRACT_ID,
  });

  return addLiquidityMutation.isLoading ? (
    <div className="mt-6 mb-8 flex justify-center">
      <PoolLoader
        steps={[
          `Deposit: ${coinFrom.name}`,
          `Deposit: ${coinTo.name}`,
          `Provide liquidity`,
          `Done`,
        ]}
        step={stage}
        loading={addLiquidityMutation.isLoading}
        coinFrom={coinFrom}
        coinTo={coinTo}
      />
    </div>
  ) : (
    <>
      <div className="mt-6 mb-4">
        <CoinInput
          {...fromInput.getInputProps()}
          rightElement={<CoinSelector {...fromInput.getCoinSelectorProps()} />}
          autoFocus
        />
      </div>
      <div className="mb-6">
        <CoinInput
          {...toInput.getInputProps()}
          rightElement={<CoinSelector {...toInput.getCoinSelectorProps()} />}
        />
      </div>
      {!!addLiquidityRatio && (
        <PreviewTable title="Expected output:" className="my-2">
          <PreviewItem
            title="Pool tokens you'll receive:"
            value={formatUnits(previewTokensToReceive, DECIMAL_UNITS)}
          />
          <PreviewItem
            title={"Your share of current pool:"}
            value={`${(nextCurrentPoolShare * 100).toFixed(2)}%`}
          />
        </PreviewTable>
      )}
      {poolInfo && reservesFromToRatio ? (
        <div className={style.info}>
          <h4 className="text-white mb-2 font-bold">Reserves</h4>
          <div className="flex">
            <div className="flex flex-col flex-1">
              <span>
                ETH:{" "}
                {formatUnits(poolInfo.eth_reserve, DECIMAL_UNITS).toString()}
              </span>
              <span>
                DAI:{" "}
                {formatUnits(poolInfo.token_reserve, DECIMAL_UNITS).toString()}
              </span>
            </div>
            {poolInfo.eth_reserve > 0 && poolInfo.token_reserve > 0 ? (
              <div className="flex flex-col">
                <span>
                  <>ETH/DAI: {reservesFromToRatio.toFixed(6)}</>
                </span>
                <span>
                  <>DAI/ETH: {reservesToFromRatio.toFixed(6)}</>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      <Button
        isDisabled={!!errorsCreatePull.length}
        isFull
        size="lg"
        variant="primary"
        onPress={
          errorsCreatePull.length
            ? undefined
            : () => addLiquidityMutation.mutate()
        }
      >
        {errorsCreatePull.length
          ? errorsCreatePull[0]
          : reservesFromToRatio
          ? "Add liquidity"
          : "Create liquidity"}
      </Button>
      {!reservesFromToRatio && !isLoadingPoolInfo ? (
        <div className={style.createPoolInfo}>
          <h4 className="text-orange-400 mb-2 font-bold">
            You are creating a new pool
          </h4>
          <div className="flex">
            You are the first to provide liquidity to this pool. The ratio
            between these tokens will set the price of this pool.
          </div>
        </div>
      ) : null}
    </>
  );
}
