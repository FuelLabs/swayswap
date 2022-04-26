import React, { PropsWithChildren, useContext } from "react";
import {
  Wallet,
  ScriptTransactionRequest,
  TransactionResult,
  CoinQuantity,
} from "fuels";
import { saveWallet, loadWallet } from "src/lib/walletStorage";
import { CoinETH } from "src/lib/constants";
import { randomBytes } from "ethers/lib/utils";
import { FAUCET_AMOUNT, FUEL_PROVIDER_URL } from "src/config";

interface WalletProviderContext {
  sendTransaction: (data: any) => void;
  createWallet: () => void;
  getWallet: () => Wallet | null;
  getCoins: () => Promise<CoinQuantity[]>;
  faucet: () => Promise<TransactionResult>;
}

// @ts-ignore
export const WalletContext = React.createContext<WalletProviderContext>();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }: PropsWithChildren<{}>) => {
  const getWallet = () => {
    const privateKey = loadWallet<string>();

    if (!privateKey) return null;

    return new Wallet(privateKey, FUEL_PROVIDER_URL);
  };

  return (
    <WalletContext.Provider
      value={{
        createWallet: () => {
          const wallet = Wallet.generate({
            provider: FUEL_PROVIDER_URL,
          });
          saveWallet(wallet.privateKey);
          return wallet;
        },
        getWallet,
        faucet: async () => {
          const wallet = getWallet() as Wallet;
          const transactionRequest = new ScriptTransactionRequest({
            gasPrice: 0,
            gasLimit: "0x0F4240",
            script: "0x24400000",
            scriptData: randomBytes(32),
          });
          // @ts-ignore
          transactionRequest.addCoin({
            id: "0x000000000000000000000000000000000000000000000000000000000000000000",
            assetId: CoinETH,
            amount: FAUCET_AMOUNT,
            owner:
              "0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e",
          });
          transactionRequest.addCoinOutput(
            wallet.address,
            FAUCET_AMOUNT,
            CoinETH
          );
          const submit = await wallet.sendTransaction(transactionRequest);

          return submit.wait();
        },
        getCoins: async () => {
          const wallet = getWallet() as Wallet;

          const coins = await wallet.getBalances();

          return coins;
        },
        sendTransaction: (data: any) => {
          console.log("Transaction sent", data);
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
