import React, { PropsWithChildren } from 'react';
import { Provider, Wallet } from 'fuels';
import { saveWallet, getWallet } from '../lib/walletStorage';

interface WalletProviderContext {
    sendTransaction: (data: any) => void;
    createWallet: () => void;
    getWallet: () => Wallet | null;
}

// @ts-ignore
export const WalletContext = React.createContext<WalletProviderContext>();

export const WalletProvider = ({children}: PropsWithChildren<{}>) => {
    return (
        <WalletContext.Provider value={{
            createWallet: () => {
                const wallet = Wallet.generate({
                    provider: 'https://swayswap.io/graphql'
                });
                saveWallet(wallet.privateKey);
                return wallet;
            },
            getWallet: () => {
                const privateKey = getWallet<string>();

                if (!privateKey) return null;

                return new Wallet(privateKey, '');
            },
            sendTransaction: (data: any) => {
                console.log('Transaction sent', data)
            }
        }}>
            {children}
        </WalletContext.Provider>
    )
}

