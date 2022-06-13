import { Wallet } from "fuels";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ReactNode } from "react";
import React, { useContext, useMemo } from "react";

import { LocalStorageKey } from "./utils";

import { FUEL_PROVIDER_URL } from "~/config";
import type { Maybe } from "~/types";

interface AppContextValue {
  justContent?: boolean;
  wallet: Maybe<Wallet>;
  createWallet: () => void;
}

const walletPrivateKeyState = atomWithStorage<Maybe<string>>(
  `${LocalStorageKey}-state`,
  null
);

export const AppContext = React.createContext<Maybe<AppContextValue>>(null);

export const useAppContext = () => useContext(AppContext)!;

type ProviderProps = {
  children: ReactNode;
  justContent?: boolean;
};

export const AppContextProvider = ({
  justContent,
  children,
}: ProviderProps) => {
  const [privateKey, setPrivateKey] = useAtom(walletPrivateKeyState);

  const wallet = useMemo(() => {
    if (!privateKey) return null;
    return new Wallet(privateKey, FUEL_PROVIDER_URL);
  }, [privateKey]);

  return (
    <AppContext.Provider
      value={{
        justContent,
        wallet,
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
