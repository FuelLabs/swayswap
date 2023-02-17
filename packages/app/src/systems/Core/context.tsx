import type { ReactNode } from "react";
import React, { useContext } from "react";

import type { Maybe } from "~/types";

interface AppContextValue {
  justContent?: boolean;
}

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
  return (
    <AppContext.Provider
      value={{
        justContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
