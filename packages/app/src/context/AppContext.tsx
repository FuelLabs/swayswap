import { randomBytes } from "ethers/lib/utils";
import type { TransactionResult } from "fuels";
import { Wallet, ScriptTransactionRequest, CoinStatus, toBigInt } from "fuels";
import type { PropsWithChildren } from "react";
import React, { useContext, useMemo } from "react";
import { atom, useRecoilState } from "recoil";

import { CONTRACT_ID, FAUCET_AMOUNT, FUEL_PROVIDER_URL } from "~/config";
import { CoinETH } from "~/lib/constants";
import { persistEffect } from "~/lib/recoilEffects";
import type { ExchangeContractAbi } from "~/types/contracts";
import { ExchangeContractAbi__factory } from "~/types/contracts";

interface AppContextValue {
  wallet: Wallet | null;
  contract: ExchangeContractAbi | null;
  createWallet: () => void;
  faucet: () => Promise<TransactionResult<"success">>;
}

const walletPrivateKeyState = atom<string | null>({
  key: "privateKey",
  default: null,
  effects_UNSTABLE: [persistEffect],
});

export const AppContext = React.createContext<AppContextValue | null>(null);

export const useAppContext = () => useContext(AppContext)!;

export const useWallet = () => {
  const { wallet } = useContext(AppContext)!;
  return wallet;
};

export const useContract = () => {
  const { contract } = useContext(AppContext)!;
  return contract;
};

export const AppContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [privateKey, setPrivateKey] = useRecoilState(walletPrivateKeyState);

  const wallet = useMemo(() => {
    if (!privateKey) return null;
    return new Wallet(privateKey, FUEL_PROVIDER_URL);
  }, [privateKey]);

  const contract = useMemo(() => {
    if (!wallet) return null;
    return ExchangeContractAbi__factory.connect(CONTRACT_ID, wallet);
  }, [wallet]);

  return (
    <AppContext.Provider
      value={{
        wallet,
        contract,
        createWallet: () => {
          const nextWallet = Wallet.generate({
            provider: FUEL_PROVIDER_URL,
          });
          setPrivateKey(nextWallet.privateKey);
          return nextWallet;
        },
        faucet: async () => {
          const transactionRequest = new ScriptTransactionRequest({
            gasPrice: 0,
            gasLimit: "0x0F4240",
            script: "0x24400000",
            scriptData: randomBytes(32),
          });
          transactionRequest.addCoin({
            id: "0x000000000000000000000000000000000000000000000000000000000000000000",
            assetId: CoinETH,
            amount: FAUCET_AMOUNT,
            owner:
              "0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e",
            status: CoinStatus.Unspent,
            maturity: toBigInt(0),
            blockCreated: toBigInt(0),
          });
          transactionRequest.addCoinOutput(
            wallet!.address,
            FAUCET_AMOUNT,
            CoinETH
          );
          const submit = await wallet!.sendTransaction(transactionRequest);

          return submit.wait();
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
