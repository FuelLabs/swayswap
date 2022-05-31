import { randomBytes } from "@ethersproject/random";
import type { TransactionResult } from "fuels";
import { Wallet, ScriptTransactionRequest, CoinStatus } from "fuels";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { PropsWithChildren } from "react";
import React, { useContext, useMemo } from "react";

import { CONTRACT_ID, FAUCET_AMOUNT, FUEL_PROVIDER_URL } from "~/config";
import { COIN_ETH, LocalStorageKey } from "~/lib/constants";
import { parseUnits, toBigInt } from "~/lib/math";
import type { ExchangeContractAbi } from "~/types/contracts";
import { ExchangeContractAbi__factory } from "~/types/contracts";

interface AppContextValue {
  wallet: Wallet | null;
  contract: ExchangeContractAbi | null;
  createWallet: () => void;
  faucet: () => Promise<TransactionResult<"success">>;
}

const walletPrivateKeyState = atomWithStorage<string | null>(
  `${LocalStorageKey}-state`,
  null
);

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
  const [privateKey, setPrivateKey] = useAtom(walletPrivateKeyState);

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
          const amount = parseUnits(String(FAUCET_AMOUNT)).toBigInt();
          transactionRequest.addCoin({
            id: "0x000000000000000000000000000000000000000000000000000000000000000000",
            assetId: COIN_ETH,
            amount,
            owner:
              "0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e",
            status: CoinStatus.Unspent,
            maturity: toBigInt(0),
            blockCreated: toBigInt(0),
          });
          transactionRequest.addCoinOutput(wallet!.address, amount, COIN_ETH);
          const submit = await wallet!.sendTransaction(transactionRequest);

          return submit.wait();
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
