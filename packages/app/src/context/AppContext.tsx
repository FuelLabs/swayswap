import { Wallet } from "fuels";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { PropsWithChildren } from "react";
import React, { useContext, useMemo } from "react";

import { CONTRACT_ID, FUEL_PROVIDER_URL } from "~/config";
import { LocalStorageKey } from "~/lib/constants";
import type { ExchangeContractAbi } from "~/types/contracts";
import { ExchangeContractAbi__factory } from "~/types/contracts";

interface AppContextValue {
  wallet: Wallet | null;
  contract: ExchangeContractAbi | null;
  createWallet: () => void;
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
