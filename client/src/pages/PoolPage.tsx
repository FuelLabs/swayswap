import classNames from "classnames";
import { BigNumber, ContractFactory, Wallet, ZeroBytes32 } from "fuels";
import { useEffect, useState, useCallback } from "react";
import { RiCheckFill } from "react-icons/ri";
import { useExchangeContract, useSwaySwapContract, useWallet } from "src/context/AppContext";
import {
  assets,
  NativeAsset,
  filterAssets
} from "src/lib/SwaySwapMetadata";
import { Coin, CoinInput } from "src/components/CoinInput";
import { Spinner } from "src/components/Spinner";
import { useNavigate } from "react-router-dom";
import { Pages } from "src/types/pages";
import { PoolInfoStruct } from "src/types/contracts/ExchangeContractAbi";
import { formatUnits } from "ethers/lib/utils";
import { EXCHANGE_CONTRACT_ID } from "src/config";
import { ExchangeContractAbi__factory } from "src/types/contracts";

const style = {
  wrapper: `w-screen flex flex-1 items-center justify-center mb-14`,
  content: `bg-[#191B1F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-between font-semibold text-xl`,
  confirmButton: `bg-[#58c09b] my-2 rounded-2xl py-6 px-8 text-xl font-semibold flex items-center
  justify-center cursor-pointer border border-[#58c09b] hover:border-[#234169] mt-8 w-full
  disabled:bg-[#a0bbb1]`,
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
    <ul className="w-full rounded-lg border border-[#2b3039] text-gray-900">
      {steps.map((stepText, index) => (
        <li
          key={index}
          className={classNames(
            "space-between flex w-full items-center border-b border-[#2b3039] px-6 py-2 text-white",
            {
              "rounded-t-lg": index === 0,
              "bg-[#58c09a]": step === index && loading,
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

const createExchangeContract = async (wallet: Wallet, tokenId: string) => {
  const { bytecode } = (await wallet.provider.getContract(EXCHANGE_CONTRACT_ID))!;
  const contractFactory = new ContractFactory(bytecode, ExchangeContractAbi__factory.abi, wallet);
  const contract = await contractFactory.deployContract([
    [
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      tokenId
    ]
  ]);
  return contract;
}

export default function PoolPage() {
  const wallet = useWallet()!;
  const swaySwapContract = useSwaySwapContract()!;
  const navigate = useNavigate();
  const [coinTo, setCoinTo] = useState<Coin>(assets[1]);
  const [fromAmount, setFromAmount] = useState<BigNumber>(BigNumber.from(0));
  const [toAmount, setToAmount] = useState<BigNumber>(BigNumber.from(0));
  const [stage, setStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [poolInfo, setPoolInfo] = useState<PoolInfoStruct>({
    eth_reserve: BigNumber.from(0),
    token_reserve: BigNumber.from(0)
  });
  const [exchangeId, setExchangeId] = useState('');
  const exchangeContract = useExchangeContract(exchangeId)!;

  const setExchangeContractId = useCallback(async () => {
    setExchangeId('');
    const result = await swaySwapContract.callStatic.get_exchange_contract(coinTo.assetId);
    console.log('result', result);
    // If exchange contract id is different
    // of 0 them set exchange contract id
    if (result !== ZeroBytes32) {
      setExchangeId(result);
    }
  }, [swaySwapContract, setExchangeId, coinTo.assetId]);

  useEffect(() => {
    setExchangeContractId();
  }, [setExchangeContractId]);

  useEffect(() => {
    (async () => {
      if (exchangeId) {
        const pi = await exchangeContract.callStatic.get_info();
        setPoolInfo(pi);
      } else {
        setPoolInfo({
          eth_reserve: BigNumber.from(0),
          token_reserve: BigNumber.from(0)
        });
      }
    })();
  }, []);

  const addLiquidity = async (tokenId: string) => {
    const contractId = await swaySwapContract.callStatic.get_exchange_contract(tokenId);
    const exchangeContract = ExchangeContractAbi__factory.connect(contractId, wallet);
    // TODO: Combine all transactions on single tx leverage by scripts
    // https://github.com/FuelLabs/swayswap-demo/issues/42
    setIsLoading(true);
    // Deposit coins from
    setStage(1);
    await exchangeContract.functions.deposit({
      forward: [fromAmount, NativeAsset.assetId],
    });
    // Deposit coins to
    setStage(2);
    await exchangeContract.functions.deposit({
      forward: [toAmount, coinTo.assetId],
    });
    // Create liquidity pool
    setStage(3);
    await exchangeContract.functions.add_liquidity(1, toAmount, 1000, {
      variableOutputs: 1,
    });
    // We are done, reset
    setStage(0);
  };

  const provideLiquidity = async () => {
    // Change state to loading
    setIsLoading(true);
    const tokenId = coinTo.assetId;
    // If contract didn't exists create e new contract exchange
    const contractId = await swaySwapContract.callStatic.get_exchange_contract(tokenId);
    if (contractId === ZeroBytes32) {
      // Create a exchange contract token
      const exchangeContract = await createExchangeContract(wallet, tokenId);
      // Register exchange contract on swayswap
      await swaySwapContract.functions.add_exchange_contract(tokenId, exchangeContract.id);
      // Get new id from the swayswap contract
      await setExchangeContractId();
      // Create pool of liquidity
    }
    await addLiquidity(tokenId);
    // Set state loading to false
    setIsLoading(false);
    // TODO: Improve feedback after add liquidity
    navigate(Pages.assets);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <h1>Pool</h1>
        </div>
        {isLoading ? (
          <div className="mt-6 mb-8 flex justify-center">
            <PoolLoader
              steps={[
                `Deposit: ${NativeAsset.name}`,
                `Deposit: ${coinTo.name}`,
                `Provide liquidity`,
                `Done`,
              ]}
              step={stage}
              loading={isLoading}
              coinFrom={NativeAsset}
              coinTo={coinTo}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 mb-4">
              <CoinInput
                coin={NativeAsset}
                amount={fromAmount}
                onChangeAmount={(amount) => setFromAmount(amount)}
                coins={[]}
              />
            </div>
            <div className="mb-10">
              <CoinInput
                coin={coinTo}
                amount={toAmount}
                onChangeAmount={(amount) => setToAmount(amount)}
                coins={filterAssets(assets, [coinTo, NativeAsset])}
                onChangeCoin={(coin: Coin) => setCoinTo(coin)}
              />
            </div>
            {poolInfo ? (
              <div
                className="mt-3 ml-4 text-slate-400 decoration-1"
                style={{
                  fontFamily: "monospace",
                }}
              >
                Reserves
                <br />
                ETH: {formatUnits(poolInfo.eth_reserve, 9).toString()}
                <br />
                DAI: {formatUnits(poolInfo.token_reserve, 9).toString()}
                {BigNumber.from(poolInfo.eth_reserve).gt(0) &&
                BigNumber.from(poolInfo.token_reserve).gt(0) ? (
                  <>
                    <br />
                    ETH/DAI:{" "}
                    {BigNumber.from(1000)
                      .mul(poolInfo.eth_reserve)
                      .div(poolInfo.token_reserve)
                      .toNumber() / 1000}
                    <br />
                    DAI/ETH:{" "}
                    {BigNumber.from(1000)
                      .mul(poolInfo.token_reserve)
                      .div(poolInfo.eth_reserve)
                      .toNumber() / 1000}
                  </>
                ) : null}
              </div>
            ) : null}
            <button
              onClick={(e) => provideLiquidity()}
              className={style.confirmButton}
              disabled={
                // !swapContract ||
                !toAmount?.toNumber() || !fromAmount?.toNumber()
              }
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
}
