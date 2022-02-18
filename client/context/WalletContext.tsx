import React, { PropsWithChildren } from 'react';
import { Wallet, TransactionType, ScriptTransactionRequest, OutputType, InputType, TransactionResult, Coin } from 'fuels';
import { saveWallet, loadWallet } from '../lib/walletStorage';
import { CoinETH, GraphqlURL } from '../lib/constants';
import { hexlify } from 'ethers/lib/utils';

interface WalletProviderContext {
    sendTransaction: (data: any) => void;
    createWallet: () => void;
    getWallet: () => Wallet | null;
    getCoins: () => Promise<Coin[]>;
    faucet: () => Promise<TransactionResult>;
}

// TODO: remove ether needed
const genBytes32 = () => hexlify(new Uint8Array(32).map(() => Math.floor(Math.random() * 256)));

// @ts-ignore
export const WalletContext = React.createContext<WalletProviderContext>();

export const WalletProvider = ({children}: PropsWithChildren<{}>) => {
    const getWallet = () => {
        const privateKey = loadWallet<string>();

        if (!privateKey) return null;

        return new Wallet(privateKey, GraphqlURL);
    };

    return (
        <WalletContext.Provider value={{
            createWallet: () => {
                const wallet = Wallet.generate({
                    provider: GraphqlURL
                });
                saveWallet(wallet.privateKey);
                return wallet;
            },
            getWallet,
            faucet: async () => {
                const wallet = getWallet() as Wallet;
                const transactionRequest: ScriptTransactionRequest = {
                    "type": TransactionType.Script,
                    "gasPrice": 0,
                    "gasLimit": "0x0F4240",
                    "script": "0x24400000",
                    "scriptData": genBytes32(),
                    "bytePrice": 0,
                    "inputs": [
                      {
                        "type": InputType.Coin,
                        "id": "0x000000000000000000000000000000000000000000000000000000000000000000",
                        "color": CoinETH,
                        "amount": 1,
                        "owner": "0xf1e92c42b90934aa6372e30bc568a326f6e66a1a0288595e6e3fbd392a4f3e6e",
                        "witnessIndex": 0
                      }
                    ],
                    "outputs": [
                      {
                        "type": OutputType.Coin,
                        "to": wallet.address,
                        "color": CoinETH,
                        "amount": 1
                      }
                    ]
                  };
                const submit = await wallet.sendTransaction(transactionRequest);

                return submit.wait();
            },
            getCoins: async () => {
                const wallet = getWallet() as Wallet;

                const coins = await wallet.provider.getCoins(wallet.address);

                return coins;
            },
            sendTransaction: (data: any) => {
                console.log('Transaction sent', data)
            }
        }}>
            {children}
        </WalletContext.Provider>
    )
}

